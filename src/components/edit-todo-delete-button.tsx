import { deleteTodo, todoSchema } from "@/api/todos"
import { todosQuery } from "@/queries/todos"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import type z from "zod"
import { useFilters } from "./filters/use-filters"

export function EditTodoDeleteButton({
	id,
	cleanUpForm,
}: {
	readonly id: string
	readonly cleanUpForm: () => void
}) {
	const { displayMode, searchTerm, filters } = useFilters()
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: deleteTodo,
		onMutate: async (id) => {
			await queryClient.cancelQueries({
				queryKey: todosQuery.all(displayMode.sort, searchTerm, filters),
			})
			const previousTodos = queryClient.getQueryData<
				z.infer<typeof todoSchema>[]
			>(todosQuery.all(displayMode.sort, searchTerm, filters))

			queryClient.setQueryData<z.infer<typeof todoSchema>[]>(
				todosQuery.all(displayMode.sort, searchTerm, filters),
				(oldTodos) => {
					if (!oldTodos) return []
					return oldTodos.filter((todo) => todo.id !== id)
				}
			)

			return { previousTodos }
		},
		onError: (error, _, context) => {
			if (context?.previousTodos) {
				queryClient.setQueryData(
					todosQuery.all(displayMode.sort, searchTerm, filters),
					context.previousTodos
				)
			}
			toast.error(error.message || "Failed to delete todo")
		},
		onSuccess: () => {
			toast.success("Todo deleted")
			cleanUpForm()
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: todosQuery.all(displayMode.sort, searchTerm, filters),
			})
		},
	})

	return (
		<button
			type="button"
			onClick={() => mutation.mutate(id)}
			className="ml-auto inline-flex cursor-pointer items-center gap-1 rounded-lg bg-red-200 px-6 py-2 text-sm font-medium text-red-800 hover:bg-red-300 sm:px-10"
		>
			{mutation.isPending && (
				<Loader2Icon className="size-3.5 animate-spin" />
			)}
			Delete
		</button>
	)
}
