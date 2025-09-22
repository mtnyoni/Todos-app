import { FilterContext } from "@/contexts/filters-context"
import { cn } from "@/lib/utils"
import { formatDate } from "date-fns"
import { useQueryState } from "nuqs"
import { useContext, useEffect, useState } from "react"
import { dateFilterParser } from "./date-filter-codec"

export function DateFilter({
	closePopover,
}: {
	readonly closePopover: () => void
}) {
	const { setFilter } = useContext(FilterContext)
	const [date, setDate] = useQueryState("date", dateFilterParser)
	const [period, setPeriod] = useState<">" | "<" | "=" | undefined>(
		date?.period
	)

	useEffect(() => {
		if (date?.period !== undefined && period !== date.period) {
			setPeriod(date.period)
		}
	}, [date?.period])

	console.log(period, date?.period)
	return (
		<div className="space-y-2">
			<div className="flex flex-1 items-center gap-1">
				<button
					onClick={() => setPeriod(">")}
					className={cn(
						"inline-flex w-full cursor-pointer items-center justify-center rounded-lg border px-2 py-1 text-left hover:bg-muted",
						period === ">" ? "ring ring-primary" : ""
					)}
				>
					&gt;
				</button>
				<button
					data-active={period === "="}
					onClick={() => setPeriod("=")}
					className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg border px-2 py-1 text-left hover:bg-muted data-[active=true]:ring data-[active=true]:ring-primary"
				>
					=
				</button>
				<button
					data-active={period === "<"}
					onClick={() => setPeriod("<")}
					className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg border px-2 py-1 text-left hover:bg-muted data-[active=true]:ring data-[active=true]:ring-primary"
				>
					&lt;
				</button>
			</div>
			<input
				type="date"
				value={date ? formatDate(date.date, "yyyy-MM-dd") : ""}
				onChange={(e) => {
					if (period) {
						setDate({
							date: new Date(e.target.value),
							period,
						})
						setFilter(undefined)
						closePopover()
					}
				}}
				className="block w-full cursor-pointer rounded-lg border px-2 py-1 text-left hover:bg-muted"
			/>
		</div>
	)
}
