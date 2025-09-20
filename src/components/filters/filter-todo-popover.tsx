import { FilterContext } from "@/contexts/filters-context"
import { AlignCenterIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { useQueryState } from "nuqs"
import { Popover } from "radix-ui"
import { useContext, useEffect, useState } from "react"
import { DateFilter } from "./date-filter"

export function FilterTodoPopover() {
	const [open, setOpen] = useState(false)
	const { filter, setFilter } = useContext(FilterContext)

	const [status, setStatus] = useQueryState("status", { defaultValue: "" })
	const [date] = useQueryState("date")

	useEffect(() => {
		if (!open) {
			setFilter("")
		}
	}, [open, setFilter])

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<Popover.Trigger asChild>
				<button className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border bg-background px-5 text-foreground">
					<AlignCenterIcon className="size-3.5" />
					Filter
					{status === "" && date === "" ? (
						<>
							{!open ? (
								<ChevronDownIcon className="size-3.5" />
							) : (
								<ChevronUpIcon className="size-3.5" />
							)}
						</>
					) : (
						<span className="grid size-5 place-items-center rounded-full bg-primary text-sm text-primary-foreground tabular-nums">
							{status && date ? "2" : (status || date) && "1"}
						</span>
					)}
				</button>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content className="mt-1 w-40 rounded-xl border bg-background p-3 shadow-lg">
					{filter === "" && (
						<>
							<button
								onClick={() => {
									setFilter("status")
								}}
								className="block w-full cursor-pointer rounded-lg px-2 py-1 text-left hover:bg-muted"
							>
								Status
							</button>
							<button
								onClick={() => {
									setFilter("date")
								}}
								className="block w-full cursor-pointer rounded-lg px-2 py-1 text-left hover:bg-muted"
							>
								Date
							</button>
						</>
					)}

					{filter === "status" && (
						<>
							<button
								onClick={() => {
									setStatus("completed")
									setFilter("")
									setOpen(false)
								}}
								className="block w-full cursor-pointer rounded-lg px-2 py-1 text-left hover:bg-muted"
							>
								Completed
							</button>
							<button
								onClick={() => {
									setStatus("incomplete")
									setFilter("")
									setOpen(false)
								}}
								className="block w-full cursor-pointer rounded-lg px-2 py-1 text-left hover:bg-muted"
							>
								In-complete
							</button>
						</>
					)}

					{filter === "date" && (
						<DateFilter closePopover={() => setOpen(false)} />
					)}
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	)
}
