import { FilterContext } from "@/contexts/filters-context"
import { cn } from "@/lib/utils"
import {
	AlignCenterIcon,
	CalendarIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	CircleDotDashedIcon,
	Loader2Icon,
} from "lucide-react"
import { motion } from "motion/react"
import { parseAsString, useQueryStates } from "nuqs"
import { Popover } from "radix-ui"
import { useContext, useEffect, useState } from "react"
import { DateFilter } from "./date-filter"
import { StatusFilter } from "./status-filter"

export function FilterTodoPopover({
	isLoading,
}: {
	readonly isLoading: boolean
}) {
	const variants = {
		initial: {
			height: 0,
			opacity: 0,
		},
		animate: {
			height: "auto",
			opacity: 1,
		},
	}

	const [open, setOpen] = useState(false)
	const { filter, setFilter } = useContext(FilterContext)

	const [{ status, date }] = useQueryStates({
		status: parseAsString,
		date: parseAsString,
	})

	useEffect(() => {
		if (!open) {
			setFilter(undefined)
		}
	}, [open, setFilter])

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<Popover.Trigger asChild>
				<button
					className={cn(
						"inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border bg-background px-5 text-foreground",
						open && "ring-2 ring-primary/50"
					)}
				>
					{(status || date) && isLoading ? (
						<Loader2Icon className="size-3.5 animate-spin text-primary" />
					) : (
						<AlignCenterIcon className="size-3.5" />
					)}
					Filter
					{!status && !date ? (
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
				<Popover.Content asChild>
					<motion.div
						initial="initial"
						animate="animate"
						variants={variants}
						className="mt-1 w-44 rounded-xl border bg-background p-2 shadow-lg"
					>
						{!filter && (
							<>
								<button
									onClick={() => {
										setFilter("status")
									}}
									className="inline-flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-1 text-left hover:bg-muted"
								>
									<CircleDotDashedIcon className="size-4 text-muted-foreground" />
									Status
								</button>
								<button
									onClick={() => {
										setFilter("date")
									}}
									className="inline-flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-1 text-left hover:bg-muted"
								>
									<CalendarIcon className="size-4 text-muted-foreground" />
									Date
								</button>
							</>
						)}

						{filter === "status" && (
							<StatusFilter closePopover={() => setOpen(false)} />
						)}

						{filter === "date" && (
							<DateFilter closePopover={() => setOpen(false)} />
						)}
					</motion.div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	)
}
