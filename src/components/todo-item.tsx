import { AnimatePresence, motion } from "motion/react"
import type z from "zod"
import type { todoSchema } from "../api/todos"
import { DeleteTodoButton } from "./delete-todo-button"
import { EditTodoDialog } from "./edit-todo-dialog"
import { IsCompletedCheckbox } from "./is-completed-checkbox"

export function TodoItem({ todo }: { todo: z.infer<typeof todoSchema> }) {
	return (
		<AnimatePresence>
			<EditTodoDialog todo={todo}>
				<motion.li
					layoutId={todo.id}
					layout
					className="flex flex-col overflow-hidden border-x border-b px-4 py-4 group-data-[mode=cards]:rounded-lg group-data-[mode=cards]:border group-data-[mode=cards]:shadow-sm first:rounded-t-lg first:border-t last:rounded-b-lg hover:bg-muted sm:flex-row sm:items-center sm:gap-8"
				>
					<IsCompletedCheckbox todo={todo} />
					<div>
						<div className="text-sm font-medium">{todo.task}</div>
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
