import React, { createContext } from "react"

type Filter = "status" | "date" | undefined
type FilterContextType = {
	filter: Filter
	setFilter: React.Dispatch<React.SetStateAction<Filter>>
}

const FilterContext = createContext<FilterContextType>({
	filter: undefined,
	setFilter: () => {},
})

const FilterContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [filter, setFilter] = React.useState<Filter>(undefined)

	return (
		<FilterContext.Provider value={{ filter, setFilter }}>
			{children}
		</FilterContext.Provider>
	)
}

export { FilterContext, FilterContextProvider }
