import { deleteTodo, todoSchema } from "@/api/routes"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon, TrashIcon } from "lucide-react"
import { toast } from "sonner"
import type z from "zod"

export function DeleteTodoButton({ todoId }: { todoId: string }) {
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

	return (
		<button
			onClick={() => mutation.mutate(todoId)}
			disabled={mutation.isPending}
			className="ml-auto inline-flex h-7 items-center gap-2 disabled:opacity-50"
		>
			{mutation.isPending ? (
				<Loader2Icon className="size-4 animate-spin" />
			) : (
				<TrashIcon
					className={`ml-auto size-4 text-muted-foreground transition-colors ${
						mutation.isPending
							? "cursor-not-allowed"
							: "hover:text-destructive cursor-pointer"
					}`}
				/>
			)}
		</button>
	)
}
