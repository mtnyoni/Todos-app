export function TodoListSkeleton() {
	return (
		<div className="p-4 sm:px-8 md:px-12 lg:p-0">
			<header className="border-b py-4">
				<div className="mx-auto flex max-w-5xl items-center justify-between">
					<h1 className="text-lg font-bold">Todo List</h1>
					<div className="h-10 w-28 rounded-lg bg-muted" />
				</div>
			</header>
			<div className="mx-auto mt-10 max-w-5xl space-y-2">
				<div className="mb-3 flex items-center gap-3">
					<div className="h-10 w-28 rounded-lg bg-muted" />
					<div className="h-10 w-28 rounded-lg bg-muted" />
					<div className="ml-auto h-10 w-72 rounded-lg bg-muted" />
				</div>
				<ul className="mt-5 border-t">
					{Array.from({ length: 3 }).map((_, i) => (
						<li
							key={`${i}`}
							className="flex items-center gap-8 border-b px-4 py-4"
						>
							<div className="size-[1.3rem] animate-pulse rounded-lg bg-muted" />
							<div className="flex-1 space-y-0.5">
								<div className="h-4 w-1/2 animate-pulse rounded-sm bg-muted" />
								<div className="h-4 w-full animate-pulse rounded-sm bg-muted" />
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
