import * as Select from "@radix-ui/react-select"
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	SortDescIcon,
} from "lucide-react"
import { parseAsStringLiteral, useQueryState } from "nuqs"
import { useState } from "react"

export const SORT_OPTIONS = ["dateCreated", "status"] as const
export function SortingSelect() {
	const [open, setOpen] = useState(false)
	const [sort, setSort] = useQueryState(
		"sort",
		parseAsStringLiteral(SORT_OPTIONS).withDefault("dateCreated")
	)

	return (
		<Select.Root
			value={sort}
			open={open}
			onOpenChange={setOpen}
			onValueChange={(value) =>
				setSort(value as (typeof SORT_OPTIONS)[number])
			}
		>
			<Select.Trigger className="inline-flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-input px-3 py-1">
				<Select.Value placeholder="Sort by" />
				<Select.Icon>
					{!open ? (
						<ChevronDownIcon className="size-3.5" />
					) : (
						<ChevronUpIcon className="size-3.5" />
					)}
				</Select.Icon>
			</Select.Trigger>

			<Select.Portal>
				<Select.Content
					position="popper"
					sideOffset={4}
					className="z-20 rounded-xl border bg-background p-3 shadow-lg sm:w-52"
				>
					<Select.Viewport>
						<Select.Item
							value="status"
							className="flex h-8 cursor-pointer items-center justify-between rounded px-2 select-none hover:bg-muted"
						>
							<Select.ItemText>
								<div className="flex items-center gap-2">
									<SortDescIcon className="size-3.5" />
									Status
								</div>
							</Select.ItemText>

							<Select.ItemIndicator>
								<CheckIcon className="size-3.5" />
							</Select.ItemIndicator>
						</Select.Item>

						<Select.Item
							value="dateCreated"
							className="flex h-8 cursor-pointer items-center justify-between rounded px-2 select-none hover:bg-muted"
						>
							<Select.ItemText>
								<div className="flex items-center gap-2">
									<SortDescIcon className="size-3.5" />
									<span>Date created</span>
								</div>
							</Select.ItemText>
							<Select.ItemIndicator>
								<CheckIcon className="size-3.5" />
							</Select.ItemIndicator>
						</Select.Item>
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	)
}
