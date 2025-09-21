import { Rows4Icon, RowsIcon } from "lucide-react"
import { useQueryState } from "nuqs"

export function CardsOrRowsDisplay() {
	const [displayMode, setDisplayMode] = useQueryState("mode", {
		defaultValue: "rows",
	})

	return (
		<div className="p-3">
			<div className="grid w-full grid-cols-2 gap-3">
				<button
					data-active={displayMode === "cards"}
					onClick={() => setDisplayMode("cards")}
					className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-lg data-[active=true]:border data-[active=true]:bg-muted"
				>
					<RowsIcon className="size-5" /> Cards
				</button>
				<button
					data-active={displayMode === "rows"}
					onClick={() => setDisplayMode("rows")}
					className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-lg data-[active=true]:border data-[active=true]:bg-muted"
				>
					<Rows4Icon className="size-5" />
					Rows
				</button>
			</div>
		</div>
	)
}
