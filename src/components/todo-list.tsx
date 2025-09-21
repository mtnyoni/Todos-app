import { getTodos } from "@/api/todos"
import { AddTodoDialog } from "@/components/add-todo-dialog"
import { DisplayTodoPopover } from "@/components/display/display-todo-popover"
import { ActiveFilters } from "@/components/filters/active-filters"
import { FilterTodoPopover } from "@/components/filters/filter-todo-popover"
import { SearchTodos } from "@/components/filters/search-todos"
import { TodoItem } from "@/components/todo-item"
import { TodoListSkeleton } from "@/components/todo-list-skeleton"
import { FilterContextProvider } from "@/contexts/filters-context"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { EmptyTodos } from "./empty-todos"
import { useFilters } from "./filters/use-filters"

export function TodoList() {
	const { searchTerm, displayMode, filters } = useFilters()

	const todosQuery = useQuery({
		queryKey: [
			"todos",
			searchTerm,
			filters.status,
			filters.date,
			displayMode.sort,
		],
		queryFn: async () =>
			await getTodos(
				displayMode.sort,
				searchTerm ? searchTerm : undefined,
				filters
			),
		placeholderData: keepPreviousData,
	})

	if (todosQuery.isPending) {
		return <TodoListSkeleton />
	}

	if (todosQuery.isError) {
		return <div>Error: {todosQuery.error.message}</div>
	}

	return (
		<div className="sm:px-8 md:px-12 lg:p-0">
			<header className="border-b px-4 py-4">
				<div className="mx-auto flex max-w-5xl items-center justify-between">
					<h1 className="text-lg font-bold">Todo List</h1>
					<AddTodoDialog />
				</div>
			</header>
			<div className="mx-auto mt-2 max-w-5xl space-y-2 px-4 sm:mt-10">
				<div>
					<div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
						<div className="space-x-3 whitespace-nowrap">
							<FilterContextProvider>
								<FilterTodoPopover
									isLoading={todosQuery.isRefetching}
								/>
							</FilterContextProvider>
							<DisplayTodoPopover
								isLoading={todosQuery.isRefetching}
							/>
						</div>
						<SearchTodos isLoading={todosQuery.isRefetching} />
					</div>
					<ActiveFilters />
				</div>
				<ul
					data-mode={displayMode.mode}
					className="group mt-5 data-[mode=cards]:space-y-2"
				>
					{todosQuery.data.length > 0 ? (
						todosQuery.data.map((todo) => (
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
