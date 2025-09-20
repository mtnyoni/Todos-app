import {
	ArrowUpDownIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	Rows4Icon,
	RowsIcon,
	Settings2Icon,
} from "lucide-react"
import { Popover } from "radix-ui"
import { useState } from "react"
import { SortingSelect } from "./sorting-select"

export function DisplayTodoPopover() {
	const [open, setOpen] = useState(false)

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<Popover.Trigger asChild>
				<button className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border bg-background px-5 text-foreground">
					<Settings2Icon className="size-3.5" />
					Display
					{!open ? (
						<ChevronDownIcon className="size-3.5" />
					) : (
						<ChevronUpIcon className="size-3.5" />
					)}
				</button>
			</Popover.Trigger>
			<Popover.Content className="mt-1 w-96 overflow-hidden rounded-xl border bg-background shadow-lg">
				<div>
					<div className="p-3">
						<div className="grid w-full grid-cols-2 gap-3">
							<div className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-lg hover:bg-muted">
								<RowsIcon className="size-5" /> Cards
							</div>
							<div className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-lg border bg-muted">
								<Rows4Icon className="size-5" />
								Rows
							</div>
						</div>
					</div>
					<div className="grid grid-cols-2 place-items-center border-t px-3 py-4">
						<div className="flex items-center gap-1">
							<ArrowUpDownIcon className="size-3.5" />
							Ordering
						</div>
						<SortingSelect />
					</div>
				</div>
			</Popover.Content>
		</Popover.Root>
	)
}
