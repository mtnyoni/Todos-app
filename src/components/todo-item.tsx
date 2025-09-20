import { AnimatePresence, motion } from "motion/react"
import { Checkbox } from "radix-ui"
import { useState } from "react"
import type z from "zod"
import type { todoSchema } from "../api/routes"
import { DeleteTodoButton } from "./delete-todo-button"
import { EditTodoDialog } from "./edit-todo-dialog"

export function TodoItem({ todo }: { todo: z.infer<typeof todoSchema> }) {
	const [checked, setChecked] = useState(todo.isCompleted)

	return (
		<AnimatePresence>
			<EditTodoDialog todo={todo}>
				<motion.li className="flex items-center gap-8 overflow-hidden border-b px-4 py-4">
					<Checkbox.Root
						data-slot="checkbox"
						onClick={(e) => e.stopPropagation()}
						checked={checked}
						onCheckedChange={(checked) => setChecked(!!checked)}
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
					<div>
						<div className="font-medium">{todo.task}</div>
						<p className="text-sm text-muted-foreground">
							{todo.description}
						</p>
					</div>
					<DeleteTodoButton todoId={todo.id} />
				</motion.li>
			</EditTodoDialog>
		</AnimatePresence>
	)
}
