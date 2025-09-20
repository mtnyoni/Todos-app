export function TodoListSkeleton() {
	return (
		<div className="mx-auto flex max-w-4xl flex-col gap-4 py-12">
			<h1 className="text-lg font-bold">Todo List</h1>
			<ul className="mt-2 space-y-2">
				{Array.from({ length: 3 }).map(() => (
					<li className="flex items-center gap-8 border-b px-4 py-4">
						<div className="size-[1.3rem] animate-pulse rounded-lg bg-muted" />
						<div className="flex-1 space-y-0.5">
							<div className="h-4 w-1/2 animate-pulse rounded-sm bg-muted" />
							<div className="h-4 w-full animate-pulse rounded-sm bg-muted" />
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
