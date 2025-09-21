import { addTodo, addTodoSchema } from "@/api/routes"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LoaderIcon, PlusIcon } from "lucide-react"
import { Dialog } from "radix-ui"
import { toast } from "sonner"
import type z from "zod"

export function AddTodoDialog() {
	const queryClient = useQueryClient()
	const isMobile = useMediaQuery("(max-width: 40rem)")

	const addTodoMutation = useMutation({
		mutationFn: async (data: z.infer<typeof addTodoSchema>) =>
			addTodo({
				task: data.task,

				description: data.description,
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] })
			toast.success("new todo added")
		},
	})

	const form = useForm({
		defaultValues: {
			task: "",
			isCompleted: false,
			description: "",
		},
		onSubmit: async (data) => addTodoMutation.mutateAsync(data.value),
	})

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<button className="inline-flex h-10 items-center gap-1 rounded-lg bg-primary px-6 text-primary-foreground">
					<PlusIcon className="size-3.5" />
					New
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/50" />
				<Dialog.Content
					data-mobile={isMobile}
					className={cn(
						"fixed top-1/2 right-1 h-[calc(100vh-0.5rem)] w-[90vw] max-w-[500px] -translate-y-1/2 rounded-3xl border bg-background shadow-lg focus:outline-none",
						isMobile &&
							"top-auto bottom-1 h-2/3 w-[calc(100dvw-0.5rem)] max-w-[calc(100dvw-0.5rem)] -translate-0"
					)}
				>
					<form
						onSubmit={(e) => {
							e.preventDefault()
							form.handleSubmit()
						}}
					>
						<div className="space-y-20 p-6">
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
										className="inline-flex cursor-pointer items-center rounded-lg bg-muted px-10 py-2 text-sm font-medium text-muted-foreground hover:bg-gray-200"
									>
										Reset
									</button>
									<button
										type="submit"
										className="inline-flex items-center gap-2 rounded-lg bg-primary px-10 py-2 text-sm font-medium text-white hover:bg-primary/90"
									>
										{isSubmitting && (
											<LoaderIcon className="size-3.5 animate-spin" />
										)}
										Save
									</button>
								</fieldset>
							)}
						</form.Subscribe>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
