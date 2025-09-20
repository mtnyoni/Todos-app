import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Select } from "radix-ui"
import { useState } from "react"

export function SortingSelect() {
	const [open, setOpen] = useState(false)

	return (
		<Select.Root open={open} onOpenChange={setOpen}>
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
				<Select.Content>
					<Select.Viewport>
						<Select.Item value="testing">
							<Select.ItemText />
							<Select.ItemIndicator />
						</Select.Item>

						<Select.Group>
							<Select.Label />
							<Select.Item value="value">
								<Select.ItemText />
								<Select.ItemIndicator />
							</Select.Item>
						</Select.Group>

						<Select.Separator />
					</Select.Viewport>

					<Select.Arrow />
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	)
}
