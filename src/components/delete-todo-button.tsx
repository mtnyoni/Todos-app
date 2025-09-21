import { deleteTodo, todoSchema } from "@/api/todos"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon, TrashIcon } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import type z from "zod"

const HOLDING_THRESHOLD = 600

export function DeleteTodoButton({ todoId }: { todoId: string }) {
	const [progress, setProgress] = useState(0)

	const requestRef = useRef<number | null>(null)
	const startTimeRef = useRef<number | null>(null)

	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: deleteTodo,
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: ["todos"] })
			const previousTodos = queryClient.getQueryData<
				z.infer<typeof todoSchema>[]
			>(["todos"])

			queryClient.setQueryData<z.infer<typeof todoSchema>[]>(
				["todos"],
				(oldTodos) => {
					if (!oldTodos) return []
					return oldTodos.filter((todo) => todo.id !== id)
				}
			)

			return { previousTodos }
		},
		onError: (error, _, context) => {
			if (context?.previousTodos) {
				queryClient.setQueryData(["todos"], context.previousTodos)
			}
			toast.error(error.message || "Failed to delete todo")
		},
		onSuccess: () => {
			toast.success("Todo deleted")
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] })
		},
	})

	const step = (timestamp: number) => {
		if (!startTimeRef.current) startTimeRef.current = timestamp
		const elapsed = timestamp - startTimeRef.current
		const newProgress = Math.min(elapsed / HOLDING_THRESHOLD, 1)
		setProgress(newProgress)

		if (elapsed >= HOLDING_THRESHOLD) {
			mutation.mutate(todoId)
			cancelAnimationFrame(requestRef.current!)
			requestRef.current = null
			setProgress(0)
			return
		}

		requestRef.current = requestAnimationFrame(step)
	}

	const handleMouseDown = () => {
		startTimeRef.current = null
		setProgress(0)
		requestRef.current = requestAnimationFrame(step)
	}

	const handleMouseUp = () => {
		if (requestRef.current) {
			cancelAnimationFrame(requestRef.current)
			requestRef.current = null
		}
		setProgress(0)
	}

	return (
		<button
			onMouseDown={(e) => {
				e.stopPropagation()
				handleMouseDown()
			}}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
			onClick={(e) => e.stopPropagation()}
			disabled={mutation.isPending}
			className="relative isolate ml-auto inline-flex h-7 cursor-pointer items-center gap-1 overflow-hidden rounded-xl bg-red-100 px-3 py-1 text-sm font-medium text-red-400 disabled:opacity-50"
		>
			<div
				className="absolute inset-0 -z-1 rounded-[inherit] bg-red-300"
				style={{
					width: `${progress * 100}%`,
				}}
			/>
			{mutation.isPending ? (
				<Loader2Icon className="size-3 animate-spin" />
			) : (
				<TrashIcon
					className={`ml-auto size-4 transition-colors ${
						mutation.isPending
							? "cursor-not-allowed"
							: "hover:text-destructive cursor-pointer"
					}`}
				/>
			)}
			Delete
		</button>
	)
}
