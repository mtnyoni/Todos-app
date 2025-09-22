import { displayOrderSchema, filtersSchema, getTodos } from "@/api/todos"
import { queryOptions } from "@tanstack/react-query"
import type z from "zod"

export const todosQuery = {
	all: (
		displayOrder: z.infer<typeof displayOrderSchema>,
		search?: string,
		filters?: z.infer<typeof filtersSchema>
	) => ["all", displayOrder, search, filters] as const,

	getAll: (
		displayOrder: z.infer<typeof displayOrderSchema>,
		search?: string,
		filters?: z.infer<typeof filtersSchema>
	) =>
		queryOptions({
			queryKey: todosQuery.all(displayOrder, search, filters),
			queryFn: async () => getTodos(displayOrder, search, filters),
		}),
}
