import { updateTodoStatus, type todoSchema } from "@/api/todos"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { motion } from "motion/react"
import { Checkbox } from "radix-ui"
import { toast } from "sonner"
import type z from "zod"

export function IsCompletedCheckbox({
	todo,
}: {
	readonly todo: z.infer<typeof todoSchema>
}) {
	const queryClient = new QueryClient()
	const updateMutation = useMutation({
		mutationFn: async (isCompleted: boolean) => {
			await updateTodoStatus(todo.id, isCompleted)
		},

		onMutate: async (isCompleted) => {
			await queryClient.cancelQueries({ queryKey: ["todos"] })
			const previousTodos = queryClient.getQueryData<
				z.infer<typeof todoSchema>[]
			>(["todos"])

			queryClient.setQueryData<z.infer<typeof todoSchema>[]>(
				["todos"],
				(oldTodos) => {
					if (!oldTodos) return []
					return oldTodos.map((todo) => {
						if (todo.id === todo.id) {
							return { ...todo, isCompleted: isCompleted }
						}

						return todo
					})
				}
			)

			return { previousTodos }
		},

		onError: (error, _, context) => {
			if (context?.previousTodos) {
				queryClient.setQueryData(["todos"], context.previousTodos)
			}
			toast.error(error.message)
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] })
		},
	})

	return (
		<Checkbox.Root
			data-slot="checkbox"
			onClick={(e) => e.stopPropagation()}
			checked={todo.isCompleted}
			onCheckedChange={(checked) => updateMutation.mutateAsync(!!checked)}
			className="grid size-[1.3rem] cursor-pointer place-items-center rounded-lg border bg-background data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
		>
			<Checkbox.Indicator>
				<motion.svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-3.5"
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					exit={{ scale: 0 }}
					transition={{ duration: 0.2, type: "spring" }}
				>
					<motion.path
						initial={{ pathLength: 0 }}
						animate={{
							pathLength: 1,
							transition: {
								duration: 0.3,
								delay: 0.1,
								ease: "easeInOut",
							},
						}}
						d="M4 12l5 5L20 6"
					/>
				</motion.svg>
			</Checkbox.Indicator>
		</Checkbox.Root>
	)
}
