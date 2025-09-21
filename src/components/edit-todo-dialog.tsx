import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { formatDate } from "date-fns"
import { LoaderIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { Checkbox, Dialog } from "radix-ui"
import { useState } from "react"
import type z from "zod"
import { updateTodo, updateTodoSchema, type todoSchema } from "../api/routes"
import { EditTodoDeleteButton } from "./edit-todo-delete-button"

export function EditTodoDialog({
	todo,
	children,
}: {
	readonly todo: z.infer<typeof todoSchema>
	readonly children: React.ReactNode
}) {
	const isMobile = useMediaQuery("(max-width: 40rem)")
	const [open, setOpen] = useState(false)
	const queryClient = useQueryClient()
	const mutation = useMutation({
		mutationFn: async (data: z.infer<typeof updateTodoSchema>) =>
			updateTodo(todo.id, {
				task: data.task,
				isCompleted: data.isCompleted,
				description: data.description,
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] })
			setOpen(false)
		},
	})

	const form = useForm({
		defaultValues: todo,
		onSubmit: async (data) => mutation.mutateAsync(data.value),
	})

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/50" />
				<Dialog.Content
					className={cn(
						"fixed top-1/2 right-1 h-[calc(100vh-0.5rem)] w-[90vw] max-w-[500px] -translate-y-1/2 rounded-3xl border bg-background shadow-lg focus:outline-none",
						isMobile &&
							"top-auto bottom-1 h-[90dvh] w-[calc(100dvw-0.5rem)] max-w-[calc(100dvw-0.5rem)] -translate-0"
					)}
				>
					<form
						onSubmit={(e) => {
							e.preventDefault()
							form.handleSubmit()
						}}
					>
						<div className="space-x-2 border-b px-6 py-6">
							Created on
							<span>
								{formatDate(todo.createdAt, "dd MMM, yyyy")}
							</span>
						</div>
						<div className="space-y-12 px-6 pt-5">
							<Dialog.Title>
								<form.Field name="task">
									{(field) => (
										<input
											placeholder="Title"
											value={field.state.value}
											onChange={(e) =>
												field.setValue(e.target.value)
											}
											className="h-16 w-full border-b p-3 text-xl font-semibold outline-none focus-visible:border-primary"
										/>
									)}
								</form.Field>
							</Dialog.Title>
							<Dialog.Description>
								<form.Field name="description">
									{(field) => (
										<textarea
											rows={2}
											placeholder="Description"
											value={field.state.value}
											onChange={(e) =>
												field.setValue(e.target.value)
											}
											className="w-full border-b p-3 outline-none focus-visible:border-primary"
										/>
									)}
								</form.Field>
							</Dialog.Description>
							<AnimatePresence>
								<div className="item-center flex gap-4">
									Is completed:
									<form.Field name="isCompleted">
										{(field) => (
											<Checkbox.Root
												data-slot="checkbox"
												checked={field.state.value}
												onCheckedChange={(checked) =>
													field.setValue(!!checked)
												}
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
														transition={{
															duration: 0.2,
															type: "spring",
														}}
													>
														<motion.path
															initial={{
																pathLength: 0,
															}}
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
										)}
									</form.Field>
								</div>
							</AnimatePresence>
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
											<LoaderIcon className="size-3.5 animate-spin" />
										)}
										Save
									</button>
									<EditTodoDeleteButton
										id={todo.id}
										cleanUpForm={() => {
											form.reset()
											setOpen(false)
										}}
									/>
								</fieldset>
							)}
						</form.Subscribe>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
