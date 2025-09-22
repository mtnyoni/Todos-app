import { dateFilterSchema } from "@/components/filters/date-filter/date-filter-codec"
import {
	endOfDay,
	isAfter,
	isBefore,
	isWithinInterval,
	startOfDay,
} from "date-fns"
import { z } from "zod"

export const uuidSchema = z.uuid()
export type UUID = z.infer<typeof uuidSchema>
export const createID = (): UUID => {
	return crypto.randomUUID()
}

export const todoSchema = z.object({
	id: uuidSchema,
	task: z.string().min(2, { message: "Title must be at least 2 characters" }),
	description: z
		.string()
		.min(5, { message: "Description must be at least 5 characters" })
		.max(255, {
			error: "Description must be between 5 and 255 characters",
		}),
	isCompleted: z.boolean(),
	createdAt: z.date(),
})

let todos: z.infer<typeof todoSchema>[] = []

export const filtersSchema = z.object({
	status: z.optional(z.enum(["completed", "incomplete"])),
	date: z.optional(dateFilterSchema),
})

export const displayOrderSchema = z.enum(["dateCreated", "status"])

function applyDateFilter(
	filter: z.infer<typeof dateFilterSchema>,
	todos: z.infer<typeof todoSchema>[]
) {
	switch (filter.period) {
		case "=":
			return todos.filter((todo) =>
				isWithinInterval(todo.createdAt, {
					start: startOfDay(filter.date),
					end: endOfDay(filter.date),
				})
			)

		case ">":
			return todos.filter((todo) => isAfter(todo.createdAt, filter.date))

		case "<":
			return todos.filter((todo) => isBefore(todo.createdAt, filter.date))

		default:
			return todos
	}
}

export async function getTodos(
	displayOrder: z.infer<typeof displayOrderSchema>,
	search?: string,
	filters?: z.infer<typeof filtersSchema>
) {
	await new Promise((resolve) => setTimeout(resolve, 2_000))

	if (search?.trim()) {
		return todos.filter((todo) =>
			todo.task.toLowerCase().includes(search.toLowerCase())
		)
	}

	if (filters) {
		if (filters.status) {
			if (filters.status == "completed") {
				return todos.filter((todo) => todo.isCompleted)
			} else if (filters.status == "incomplete") {
				return todos.filter((todo) => !todo.isCompleted)
			}
		}

		if (filters.date) {
			return applyDateFilter(filters.date, todos)
		}
	}

	if (displayOrder === "status") {
		return todos.sort(
			(a, b) => Number(a.isCompleted) - Number(b.isCompleted)
		)
	}

	return todos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export const addTodoSchema = todoSchema.pick({
	task: true,
	description: true,
})

export async function addTodo(newTodoData: z.infer<typeof addTodoSchema>) {
	await new Promise((resolve) => setTimeout(resolve, 2_000))

	const parsed = addTodoSchema.safeParse(newTodoData)
	if (!parsed.success) {
		throw new Error("Task and description are required")
	}

	const { task, description } = parsed.data
	const newTodo = {
		id: createID(),
		task,
		description,
		isCompleted: false,
		createdAt: new Date(),
	}

	todos = [newTodo, ...todos]
	return todos.find((todo) => todo.id === newTodo.id)!
}

export const updateTodoSchema = todoSchema.pick({
	task: true,
	description: true,
	isCompleted: true,
})

export async function updateTodo(
	id: string,
	{ task, description, isCompleted }: z.infer<typeof updateTodoSchema>
) {
	await new Promise((resolve) => setTimeout(resolve, 2_000))

	const todo = todos.find((todo) => todo.id === id)
	if (!todo) return Promise.reject(new Error("Todo not found"))

	todo.task = task
	todo.isCompleted = isCompleted

	todos = todos.map((todo) => {
		if (todo.id === id) {
			return {
				...todo,
				task,
				description,
				isCompleted,
			}
		}
		return todo
	})

	return todos.find((todo) => todo.id === id)!
}

export async function deleteTodo(id: string) {
	await new Promise((resolve) => setTimeout(resolve, 2_000))

	const todoIndex = todos.findIndex((todo) => todo.id === id)
	if (todoIndex === -1) {
		throw new Error("Todo not found")
	}

	const deletedTodo = todos[todoIndex]
	todos.splice(todoIndex, 1)
	return deletedTodo
}

export async function updateTodoStatus(id: string, isCompleted: boolean) {
	await new Promise((resolve) => setTimeout(resolve, 2_000))

	const todo = todos.find((todo) => todo.id === id)
	if (!todo) return Promise.reject(new Error("Todo not found"))

	todo.isCompleted = isCompleted

	todos = todos.map((todo) => {
		if (todo.id === id) {
			return {
				...todo,
				isCompleted,
			}
		}
		return todo
	})

	return todos.find((todo) => todo.id === id)!
}
