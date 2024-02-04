import { ReactNode, createContext, useMemo } from "react";
import { Item } from "../../CheckboxAccordionGroup";
import { useCheckboxData } from "../../hooks/useCheckboxData";

interface FirstElementContextProps {
	firstElement: Item;
	children: ReactNode;
}

interface FirstElementContextData {
	firstElement: Item;
}

export const FirstElementContext = createContext({} as FirstElementContextData);

const getFirstElementOfDataSelected = (firstElement: Item, dataSelected: Item[]) => {
	let newFirstElement = firstElement;

	dataSelected.forEach((item) => {
		item?.children.forEach((child) => {
			if (child.label === firstElement.label) {
				newFirstElement = child;
			}
		});
	});

	return newFirstElement;
};

export const FirstElementProvider = ({ children, firstElement }: FirstElementContextProps) => {
	const { dataSelected } = useCheckboxData();

	const firstElementOfSelectedData = useMemo(() => {
		return getFirstElementOfDataSelected(firstElement, dataSelected);
	}, []);

	// console.log("first element of selected data: ", firstElementOfSelectedData);

	// console.log("selected data: ", dataSelected);

	return (
		<FirstElementContext.Provider value={{ firstElement: firstElementOfSelectedData }}>
			{children}
		</FirstElementContext.Provider>
	);
};
