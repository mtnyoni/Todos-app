import { getTodos } from "@/api/routes"
import { AddTodoDialog } from "@/components/add-todo-dialog"
import { DisplayTodoPopover } from "@/components/display/display-todo-popover"
import { ActiveFilters } from "@/components/filters/active-filters"
import { FilterTodoPopover } from "@/components/filters/filter-todo-popover"
import { SearchTodos } from "@/components/filters/search-todos"
import { TodoItem } from "@/components/todo-item"
import { TodoListSkeleton } from "@/components/todo-list-skeleton"
import { FilterContextProvider } from "@/contexts/filters-context"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useQueryState } from "nuqs"

export function TodoList() {
	const [searchTerm] = useQueryState("q", {
		defaultValue: "",
	})

	const todos = useQuery({
		queryKey: ["todos", searchTerm],
		queryFn: async () => await getTodos(searchTerm),
		placeholderData: keepPreviousData,
	})

	if (todos.isPending) {
		return <TodoListSkeleton />
	}

	if (todos.isError) {
		return <div>Error: {todos.error.message}</div>
	}

	return (
		<div className="p-4 sm:px-8 md:px-12 lg:p-0">
			<header className="border-b py-4">
				<div className="mx-auto flex max-w-5xl items-center justify-between">
					<h1 className="text-lg font-bold">Todo List</h1>
					<AddTodoDialog />
				</div>
			</header>
			<div className="mx-auto mt-2 max-w-5xl space-y-2 sm:mt-10">
				<div>
					<div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
						<div className="space-x-3">
							<FilterContextProvider>
								<FilterTodoPopover />
							</FilterContextProvider>
							<DisplayTodoPopover />
						</div>
						<SearchTodos isLoading={todos.isRefetching} />
					</div>
					<ActiveFilters />
				</div>
				<ul className="mt-5 border-t">
					{todos.data.map((todo) => (
						<TodoItem key={todo.id} todo={todo} />
					))}
				</ul>
			</div>
		</div>
	)
}
