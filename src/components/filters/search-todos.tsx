import { debounce } from "@tanstack/react-pacer"
import { Loader2Icon, SearchIcon, XIcon } from "lucide-react"
import { useQueryState } from "nuqs"
import type React from "react"
import { useState } from "react"

export function SearchTodos({ isLoading }: { readonly isLoading: boolean }) {
	const [search, setSearch] = useState("")
	const [searchTerm, setSearchTerm] = useQueryState("q")

	const debouncedNavigate = debounce(
		(search: string | null) => setSearchTerm(search),
		{
			wait: 500,
		}
	)

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setSearch(e.target.value)
		debouncedNavigate(e.target.value)
	}

	// useEffect(() => {
	// 	setSearch(searchTerm)
	// }, [searchTerm])

	return (
		<div className="flex h-10 w-full items-center rounded-lg border border-input focus-within:ring-2 focus-within:ring-primary/50 sm:w-72">
			<div className="pl-5">
				{isLoading && searchTerm ? (
					<Loader2Icon className="size-4 animate-spin text-primary" />
				) : (
					<SearchIcon className="size-4 text-muted-foreground" />
				)}
			</div>
			<input
				value={search ?? ""}
				className="h-10 w-full px-4 placeholder-muted-foreground outline-none placeholder:text-sm"
				placeholder="Search by title..."
				onChange={handleInputChange}
			/>
			{searchTerm && (
				<button
					className="grid h-10 place-items-center rounded-[inherit] pr-5"
					onClick={() => {
						setSearchTerm(null)
						setSearch("")
					}}
				>
					<XIcon className="size-4 cursor-pointer" />
				</button>
			)}
		</div>
	)
}
