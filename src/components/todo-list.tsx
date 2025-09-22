import { AddTodoDialog } from "@/components/add-todo-dialog"
import { DisplayTodoPopover } from "@/components/display/display-todo-popover"
import { ActiveFilters } from "@/components/filters/active-filters"
import { FilterTodoPopover } from "@/components/filters/filter-todo-popover"
import { SearchTodos } from "@/components/filters/search-todos"
import { TodoItem } from "@/components/todo-item"
import { TodoListSkeleton } from "@/components/todo-list-skeleton"
import { FilterContextProvider } from "@/contexts/filters-context"
import { todosQuery } from "@/queries/todos"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { EmptyTodos } from "./empty-todos"
import { useFilters } from "./filters/use-filters"

export function TodoList() {
	const { searchTerm, displayMode, filters } = useFilters()

	const todos = useQuery({
		...todosQuery.getAll(displayMode.sort, searchTerm, filters),
		placeholderData: keepPreviousData,
	})

	if (todos.isPending) {
		return <TodoListSkeleton />
	}

	if (todos.isError) {
		return <div>Error: {todos.error.message}</div>
	}

	return (
		<div className="sm:px-8 md:px-12 lg:p-0">
			<header className="border-b px-4 py-4">
				<div className="mx-auto flex max-w-5xl items-center justify-between">
					<h1 className="text-lg font-bold">Todo List</h1>
					<AddTodoDialog />
				</div>
			</header>
			<div className="mx-auto mt-4 max-w-5xl space-y-2 px-4 sm:mt-10 sm:px-0">
				<div>
					<div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
						<div className="space-x-3 whitespace-nowrap">
							<FilterContextProvider>
								<FilterTodoPopover
									isLoading={todos.isRefetching}
								/>
							</FilterContextProvider>
							<DisplayTodoPopover
								isLoading={todos.isRefetching}
							/>
						</div>
						<SearchTodos isLoading={todos.isRefetching} />
					</div>
					<ActiveFilters />
				</div>
				<ul
					data-mode={displayMode.mode}
					className="group mt-4 pb-4 data-[mode=cards]:space-y-2"
				>
					{todos.data.length > 0 ? (
						todos.data.map((todo) => (
							<TodoItem key={todo.id} todo={todo} />
						))
					) : (
						<EmptyTodos />
					)}
				</ul>
			</div>
		</div>
	)
}
