import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { TodoList } from "./components/todo-list.tsx"
import { Toaster } from "./components/ui/sonner.tsx"
import "./index.css"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<NuqsAdapter>
				<TodoList />
			</NuqsAdapter>
			<Toaster />
		</QueryClientProvider>
	</StrictMode>
)
