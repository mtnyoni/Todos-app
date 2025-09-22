import { SORT_OPTIONS } from "@/components/display/sorting-select"
import { parseAsStringLiteral, useQueryState, useQueryStates } from "nuqs"
import { dateFilterParser } from "./date-filter/date-filter-codec"

export function useFilters() {
	const [searchTerm] = useQueryState("q")
	const [status] = useQueryState(
		"status",
		parseAsStringLiteral(["completed", "incomplete"])
	)

	const [date] = useQueryState("date", dateFilterParser)
	const [displayMode] = useQueryStates({
		sort: parseAsStringLiteral(SORT_OPTIONS).withDefault("dateCreated"),
		mode: parseAsStringLiteral(["cards", "rows"]).withDefault("rows"),
	})

	const filters = {
		status: !status ? undefined : status,
		date: !date ? undefined : date,
	}

	return {
		searchTerm: searchTerm ? searchTerm : undefined,
		displayMode,
		filters,
	}
}
