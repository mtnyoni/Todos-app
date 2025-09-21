import { cn } from "@/lib/utils"
import { useFieldContext } from "./context"

export function DescriptionField() {
	const field = useFieldContext<string>()

	return (
		<div aria-describedby="description">
			<textarea
				rows={2}
				placeholder="Description"
				value={field.state.value}
				onChange={(e) => field.setValue(e.target.value)}
				className={cn(
					"w-full border-b p-3 outline-none focus-visible:border-primary",
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
