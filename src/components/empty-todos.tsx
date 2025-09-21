export function EmptyTodos() {
	const items = Array.from({ length: 3 }, (_, index) => index + 1)

	return (
		<li className="relative flex flex-col items-center justify-center gap-3 rounded-3xl border py-10">
			<div className="relative space-y-2">
				{items.map((item) => (
					<div
						key={item}
						className="flex w-fit items-center gap-2 rounded-xl border px-4 py-2"
					>
						<div className="size-3 rounded-lg bg-muted" />
						<div className="h-3 w-20 rounded-lg bg-muted" />
						<div className="h-3 w-10 rounded-lg bg-muted" />
					</div>
				))}

				<div className="mt-4 grid place-items-center space-y-1">
					<h2 className="text-lg font-bold">No Todos</h2>
					<p className="text-sm text-muted-foreground">
						Add a new todo to get started.
					</p>
				</div>
			</div>
		</li>
	)
}
