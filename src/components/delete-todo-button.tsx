import { deleteTodo, todoSchema } from "@/api/routes"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon, TrashIcon } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import type z from "zod"

export function DeleteTodoButton({ todoId }: { todoId: string }) {
	const [holding, setHolding] = useState(false)
	const timerId = useRef<number | null>(null)

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

	const handleMouseDown = () => {
		setHolding(true)
		timerId.current = window.setTimeout(() => {
			mutation.mutate(todoId)
			setHolding(false)
		}, 1000)
	}

	const handleMouseUp = () => {
		setHolding(false)
		if (timerId.current) {
			clearTimeout(timerId.current)
			timerId.current = null
		}
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
			className="ml-auto inline-flex h-7 cursor-pointer items-center gap-1 rounded-xl bg-red-100 px-3 py-1 text-sm font-medium text-red-400 disabled:opacity-50"
		>
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
