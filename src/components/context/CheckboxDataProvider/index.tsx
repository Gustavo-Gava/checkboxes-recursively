import { PropsWithChildren, createContext, useState } from "react";
import { Item } from "../../CheckboxAccordionGroup";
import { mockedData } from "../../const";
import { data } from "../../const/data.ts";

export interface CheckboxDataProviderProps {
	dataSelected: Item[];
	setDataSelected: React.Dispatch<React.SetStateAction<Item[]>>;

	items: Item[];
}

export const CheckboxDataContext = createContext({} as CheckboxDataProviderProps);

export const CheckboxDataProvider = ({ children }: PropsWithChildren) => {
	const [dataSelected, setDataSelected] = useState([] as Item[]);

	console.log("Data: ", dataSelected);

	return (
		<CheckboxDataContext.Provider value={{ dataSelected, setDataSelected, items: mockedData }}>
			{children}
		</CheckboxDataContext.Provider>
	);
};
