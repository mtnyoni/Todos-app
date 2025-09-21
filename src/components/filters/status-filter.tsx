import { FilterContext } from "@/contexts/filters-context"
import { CheckIcon, CircleCheckIcon, CircleXIcon } from "lucide-react"
import { parseAsStringLiteral, useQueryState } from "nuqs"
import { useContext } from "react"

export function StatusFilter({ closePopover }: { closePopover: () => void }) {
	const { setFilter } = useContext(FilterContext)
	const [status, setStatus] = useQueryState(
		"status",
		parseAsStringLiteral(["completed", "incomplete"])
	)

	return (
		<>
			<button
				onClick={() => {
					setStatus("completed")
					setFilter(undefined)
					closePopover()
				}}
				className="inline-flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-muted"
			>
				<CircleCheckIcon className="size-4 text-muted-foreground" />
				Completed
				{status === "completed" && (
					<CheckIcon className="ml-auto size-4 text-muted-foreground" />
				)}
			</button>
			<button
				onClick={() => {
					setStatus("incomplete")
					setFilter(undefined)
					closePopover()
				}}
				className="inline-flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-muted"
			>
				<CircleXIcon className="size-4 text-muted-foreground" />
				Incomplete
				{status === "incomplete" && (
					<CheckIcon className="ml-auto size-4 text-muted-foreground" />
				)}
			</button>
		</>
	)
}
