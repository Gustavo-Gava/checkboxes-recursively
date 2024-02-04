import { ReactNode, createContext, useState } from "react";
import { Item } from "../../CheckboxAccordionGroup";
import { mockedData } from "../../const";

export interface CheckboxDataProviderProps {
	dataSelected: Item[];
	setDataSelected: React.Dispatch<React.SetStateAction<Item[]>>;

	items: Item[];
}

interface CheckboxProps {
	data: Item[];
	children: ReactNode;
}

export const CheckboxDataContext = createContext({} as CheckboxDataProviderProps);

export const CheckboxDataProvider = ({ children, data }: CheckboxProps) => {
	const newData = data.flatMap((item) => item.children);
	const dataFormatted = newData.flatMap((item) => item.children);
	const [dataSelected, setDataSelected] = useState(dataFormatted);

	return (
		<CheckboxDataContext.Provider value={{ dataSelected, setDataSelected, items: mockedData }}>
			{children}
		</CheckboxDataContext.Provider>
	);
};
