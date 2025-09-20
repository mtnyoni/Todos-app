import React, { createContext } from "react"

type FilterContextType = {
	filter: string
	setFilter: React.Dispatch<React.SetStateAction<string>>
}

export const FilterContext = createContext<FilterContextType>({
	filter: "",
	setFilter: () => {},
})

export const FilterContextProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [filter, setFilter] = React.useState<string>("")

	return (
		<FilterContext.Provider value={{ filter, setFilter }}>
			{children}
		</FilterContext.Provider>
	)
}
