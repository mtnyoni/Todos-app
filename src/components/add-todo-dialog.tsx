import { addTodo, addTodoSchema } from "@/api/todos"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { todosQuery } from "@/queries/todos"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon, PlusIcon } from "lucide-react"
import { motion } from "motion/react"
import { Dialog } from "radix-ui"
import { toast } from "sonner"
import type z from "zod"
import { useFilters } from "./filters/use-filters"
import { useAppForm } from "./forms/context"

export function AddTodoDialog() {
	const queryClient = useQueryClient()
	const isMobile = useMediaQuery("(max-width: 40rem)")
	const { displayMode, searchTerm, filters } = useFilters()

	const dialogAnimations = {
		initial: {
			right: isMobile ? 4 : -80,
			bottom: isMobile ? -80 : 4,
		},
		animate: {
			right: 4,
			bottom: 4,
		},
	}

	const addTodoMutation = useMutation({
		mutationFn: async (data: z.infer<typeof addTodoSchema>) =>
			addTodo({
				task: data.task,

				description: data.description,
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: todosQuery.all(displayMode.sort, searchTerm, filters),
			})
			form.reset()
			toast.success("new todo added")
		},
	})

	const form = useAppForm({
		defaultValues: {
			task: "",

			description: "",
		} as z.infer<typeof addTodoSchema>,
		validators: {
			onSubmit: addTodoSchema,
		},
		onSubmit: async (data) => addTodoMutation.mutateAsync(data.value),
	})

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<button className="inline-flex h-9 items-center gap-1 rounded-lg bg-primary px-4 text-primary-foreground">
					<PlusIcon className="size-4" />
					New
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/50" />
				<Dialog.Content asChild>
					<motion.div
						initial="initial"
						animate="animate"
						variants={dialogAnimations}
						className={cn(
							"fixed top-1/2 h-[calc(100vh-0.5rem)] w-[90vw] max-w-[500px] -translate-y-1/2 rounded-3xl border bg-background shadow-lg focus:outline-none",
							isMobile &&
								"top-auto bottom-1 h-[80dvh] w-[calc(100dvw-0.5rem)] max-w-[calc(100dvw-0.5rem)] -translate-0"
						)}
					>
						<form
							onSubmit={(e) => {
								e.preventDefault()
								form.handleSubmit()
							}}
						>
							<Dialog.Title className="mt-6 text-center text-lg font-bold">
								Add Dialog
							</Dialog.Title>
							<Dialog.Description className="text-center text-muted-foreground">
								Add a new todo
							</Dialog.Description>
							<div className="space-y-20 p-6">
								<form.AppField name="task">
									{(field) => <field.TextField />}
								</form.AppField>
								<form.AppField name="description">
									{(field) => <field.DescriptionField />}
								</form.AppField>
							</div>

							<form.Subscribe>
								{({ isSubmitting }) => (
									<fieldset
										disabled={isSubmitting}
										className="absolute bottom-6 w-full space-x-2 border-t px-6 pt-6"
									>
										<button
											type="reset"
											onClick={() => form.reset()}
											className="inline-flex cursor-pointer items-center rounded-lg bg-muted px-6 py-2 text-sm font-medium text-muted-foreground hover:bg-gray-200 sm:px-10"
										>
											Reset
										</button>
										<button
											type="submit"
											className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 sm:px-10"
										>
											{isSubmitting && (
												<Loader2Icon className="size-3.5 animate-spin" />
											)}
											Save
										</button>
									</fieldset>
								)}
							</form.Subscribe>
						</form>
					</motion.div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
