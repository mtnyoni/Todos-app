import { z } from "zod"

export const todoSchema = z.object({
	id: z.uuid(),
	task: z.string(),
	description: z.string(),
	isCompleted: z.boolean(),
	createdAt: z.date(),
})

let todos: z.infer<typeof todoSchema>[] = [
	{
		id: "1",
		task: "Buy groceries",
		description: "Buy milk, eggs, and bread",
		isCompleted: false,
		createdAt: new Date(),
	},
	{
		id: "2",
		task: "Finish homework",
		description: "Finish math homework",
		isCompleted: true,
		createdAt: new Date(),
	},
	{
		id: "3",
		task: "Go for a run",
		description: "Go for a 30-minute run",
		isCompleted: false,
		createdAt: new Date(),
	},
]

export const uuidSchema = z.uuid()
export type UUID = z.infer<typeof uuidSchema>
export const createID = (): UUID => {
	return crypto.randomUUID()
}

export async function getTodos(search?: string) {
	await new Promise((resolve) => setTimeout(resolve, 2_000))
	if (search?.trim()) {
		return todos.filter((todo) =>
			todo.task.toLowerCase().includes(search.toLowerCase())
		)
	}

	return todos
}

export const addTodoSchema = todoSchema.omit({
	id: true,
	createdAt: true,
	isCompleted: true,
})

export async function addTodo(newTodoData: z.infer<typeof addTodoSchema>) {
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
	await new Promise((resolve) => setTimeout(resolve, 2_000))
	return todos.find((todo) => todo.id === newTodo.id)!
}

export const updateTodoSchema = z.object({
	task: z.string().min(2).max(100),
	description: z.string().min(2).max(100),
	isCompleted: z.boolean(),
})

export async function updateTodo(
	id: string,
	{ task, description, isCompleted }: z.infer<typeof updateTodoSchema>
) {
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

	await new Promise((resolve) => setTimeout(resolve, 2_000))
	return todos.find((todo) => todo.id === id)!
}

export async function deleteTodo(id: string) {
	const todo = todos.find((todo) => todo.id === id)
	if (!todo) {
		throw new Error("Todo not found")
	}

	todos = todos.filter((todo) => todo.id !== id)
	await new Promise((resolve) => setTimeout(resolve, 2_000))
}
