import { cn } from "@/lib/utils"
import { useFieldContext } from "./context"

export function TextField() {
	const field = useFieldContext<string>()

	return (
		<div>
			<input
				placeholder="Title"
				value={field.state.value}
				onChange={(e) => field.setValue(e.target.value)}
				className={cn(
					"h-16 w-full border-b p-3 text-xl font-semibold outline-none focus-visible:border-primary",
					!field.state.meta.isValid && "border-b-3 border-red-500/50"
				)}
			/>
			{!field.state.meta.isValid && (
				<p className="mt-1 text-sm text-red-500">
					{field.state.meta.errors.at(0)?.message}
				</p>
			)}
		</div>
	)
}
