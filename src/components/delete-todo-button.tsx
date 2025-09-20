import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TrashIcon } from "lucide-react"
import { toast } from "sonner"
import type z from "zod"
import { deleteTodo, todoSchema } from "../api/routes"

export function DeleteTodoButton({ todoId }: { todoId: string }) {
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: deleteTodo,
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: ["todos"] })
			const previousTodos = queryClient.getQueryData(["todos"])

			queryClient.setQueryData(
				["todos"],
				(oldTodos: z.infer<typeof todoSchema>[]) =>
					oldTodos.filter((todo) => todo.id !== id)
			)
			return { previousTodos }
		},
		onError: (error, _, context) => {
			if (context?.previousTodos) {
				queryClient.setQueryData(["todos"], context.previousTodos)
			}

			toast.error(error.message)
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: ["todos"] })
		},
	})

	return (
		<button
			onClick={async () => await mutation.mutateAsync(todoId)}
			className="ml-auto inline-flex h-7 items-center gap-2"
		>
			<TrashIcon className="hover:text-destructive ml-auto size-4 cursor-pointer text-muted-foreground" />
			{mutation.isPending && "Deleting..."}
		</button>
	)
}
