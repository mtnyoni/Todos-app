import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import {
	ArrowUpDownIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	Loader2Icon,
	Settings2Icon,
} from "lucide-react"
import { motion } from "motion/react"
import { useQueryState } from "nuqs"
import { Popover } from "radix-ui"
import { useState } from "react"
import { CardsOrRowsDisplay } from "./card-or-rows-display"
import { SortingSelect } from "./sorting-select"

export function DisplayTodoPopover({
	isLoading,
}: {
	readonly isLoading: boolean
}) {
	const variants = {
		initial: {
			height: 0,
		},
		animate: {
			height: "auto",
		},
	}

	const isMobile = useMediaQuery("(max-width: 40rem)")
	const [sort] = useQueryState("sort")
	const [open, setOpen] = useState(false)

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<Popover.Trigger asChild>
				<button
					disabled={isLoading && !!sort}
					className={cn(
						"inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border bg-background px-5 text-foreground",
						open && "ring-2 ring-primary/50"
					)}
				>
					{isLoading && sort ? (
						<Loader2Icon className="size-3.5 animate-spin text-primary" />
					) : (
						<Settings2Icon className="size-3.5" />
					)}
					Display
					{!open ? (
						<ChevronDownIcon className="size-3.5" />
					) : (
						<ChevronUpIcon className="size-3.5" />
					)}
				</button>
			</Popover.Trigger>
			<Popover.Content asChild>
				<motion.div
					initial={variants.initial}
					animate={variants.animate}
					variants={variants}
					className={cn(
						"z-10 mt-1 w-96 overflow-hidden rounded-xl border bg-background shadow-lg",
						isMobile && "max-w-screen"
					)}
				>
					<CardsOrRowsDisplay />
					<div className="grid grid-cols-2 place-items-center border-t px-3 py-4">
						<div className="flex items-center gap-1">
							<ArrowUpDownIcon className="size-3.5" />
							Ordering
						</div>
						<SortingSelect />
					</div>
				</motion.div>
			</Popover.Content>
		</Popover.Root>
	)
}
