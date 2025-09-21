import {
	CalendarIcon,
	CheckCircle2Icon,
	Loader2Icon,
	XIcon,
} from "lucide-react"
import { parseAsString, useQueryStates } from "nuqs"
import { useEffect } from "react"

export function ActiveFilters() {
	const [{ status, date }, setValues] = useQueryStates({
		status: parseAsString,
		date: parseAsString,
	})

	useEffect(() => {
		const listener = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !e.shiftKey && !e.altKey && !e.metaKey) {
				e.preventDefault()
				setValues(null)
			}
		}

		window.addEventListener("keydown", listener)
		return () => window.removeEventListener("keydown", listener)
	}, [setValues])

	const dateSplits = date?.split(":")
	if (!status && !date) return null

	return (
		<div className="mt-3 flex h-9 flex-wrap items-center gap-3">
			{status && (
				<div className="flex items-center gap-1 rounded-lg border">
					<div className="flex h-9 items-center gap-1 pl-3">
						<Loader2Icon className="size-3" />
						Status
					</div>
					<span className="grid h-9 place-items-center border-l px-2 text-muted-foreground">
						is
					</span>
					<div className="flex h-9 items-center gap-1 border-l px-2 capitalize">
						<CheckCircle2Icon className="size-3" />
						{status}
					</div>
					<button
						onClick={() =>
							setValues((params) => ({ ...params, status: null }))
						}
						className="flex h-9 cursor-pointer items-center gap-1 rounded-r-[inherit] border-l px-2 capitalize hover:bg-muted"
					>
						<XIcon className="size-3" />
					</button>
				</div>
			)}
			{date && (
				<div className="flex items-center gap-1 rounded-lg border">
					<div className="flex h-9 items-center gap-1 pl-3">
						<CalendarIcon className="size-3" />
						Date
					</div>
					<span className="grid h-9 place-items-center border-l px-2 text-muted-foreground">
						{dateSplits?.at(0)}
					</span>
					<div className="flex h-9 items-center gap-1 border-l px-2">
						<CheckCircle2Icon className="size-3" />
						{dateSplits?.at(1)}
					</div>
					<button
						onClick={() =>
							setValues((params) => ({ ...params, date: null }))
						}
						className="flex h-9 cursor-pointer items-center gap-1 rounded-r-[inherit] border-l px-2 capitalize hover:bg-muted"
					>
						<XIcon className="size-3" />
					</button>
				</div>
			)}
			<button
				onClick={() => setValues(null)}
				className="ml-auto inline-flex h-9 space-x-2 text-muted-foreground"
			>
				<span> Clear filters</span>
				<kbd className="rounded border px-2 py-0.5 text-sm">Esc</kbd>
			</button>
		</div>
	)
}
