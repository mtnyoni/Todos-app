import { FilterContext } from "@/contexts/filters-context"
import { useQueryState } from "nuqs"
import { useContext, useState } from "react"

export function DateFilter({
	closePopover,
}: {
	readonly closePopover: () => void
}) {
	const { setFilter } = useContext(FilterContext)
	const [period, setPeriod] = useState<">" | "<" | "=" | "">("")
	const [date, setDate] = useQueryState("date")

	return (
		<div className="space-y-2">
			<div className="flex flex-1 items-center gap-1">
				<button
					data-active={period == ">"}
					onClick={() => setPeriod(">")}
					className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg border px-2 py-1 text-left hover:bg-muted data-[active=true]:ring data-[active=true]:ring-primary"
				>
					&gt;
				</button>
				<button
					data-active={period == "="}
					onClick={() => setPeriod("=")}
					className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg border px-2 py-1 text-left hover:bg-muted data-[active=true]:ring data-[active=true]:ring-primary"
				>
					=
				</button>
				<button
					data-active={period == "<"}
					onClick={() => setPeriod("<")}
					className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg border px-2 py-1 text-left hover:bg-muted data-[active=true]:ring data-[active=true]:ring-primary"
				>
					&lt;
				</button>
			</div>
			<input
				type="date"
				value={date || new Date().toString()}
				onChange={(e) => {
					if (period && period !== "") {
						setDate(`${period}:${e.target.value}`)
						setFilter(undefined)
						closePopover()
					} else {
						setDate(e.target.value)
					}
				}}
				className="block w-full cursor-pointer rounded-lg border px-2 py-1 text-left hover:bg-muted"
			/>
		</div>
	)
}
