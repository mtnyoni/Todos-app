import { deleteTodo, todoSchema } from "@/api/routes"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import type z from "zod"

export function EditTodoDeleteButton({
	id,
	cleanUpForm,
}: {
	readonly id: string
	readonly cleanUpForm: () => void
}) {
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
			cleanUpForm()
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] })
		},
	})

	return (
		<button
			type="button"
			onClick={() => mutation.mutate(id)}
			className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-red-200 px-6 py-2 text-sm font-medium text-red-800 hover:bg-red-300 sm:px-10"
		>
			{mutation.isPending && (
				<Loader2Icon className="size-3.5 animate-spin" />
			)}
			Delete
		</button>
	)
}
