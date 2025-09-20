import { useQuery } from "@tanstack/react-query"
import { getAll } from "../api/routes"
import { TodoItem } from "./todo-item"
import { TodoListSkeleton } from "./todo-list-skeleton"

export function TodoList() {
	const todos = useQuery({
		queryKey: ["todos"],
		queryFn: getAll,
	})

	if (todos.isPending) {
		return <TodoListSkeleton />
	}

	if (todos.isError) {
		return <div>Error: {todos.error.message}</div>
	}

	return (
		<div className="mx-auto max-w-4xl py-12">
			<h1 className="text-lg font-bold">Todo List</h1>
			<ul className="mt-4 space-y-1">
				{todos.data.map((todo) => (
					<TodoItem key={todo.id} todo={todo} />
				))}
			</ul>
		</div>
	)
}
