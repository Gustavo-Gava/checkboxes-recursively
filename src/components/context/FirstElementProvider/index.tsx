import { ReactNode, createContext } from "react";
import { Item } from "../../CheckboxAccordionGroup";

interface FirstElementContextProps {
	firstElement: Item;
	children: ReactNode;
}

interface FirstElementContextData {
	firstElement: Item;
}

export const FirstElementContext = createContext({} as FirstElementContextData);

export const FirstElementProvider = ({ children, firstElement }: FirstElementContextProps) => {
	return (
		<FirstElementContext.Provider value={{ firstElement }}>{children}</FirstElementContext.Provider>
	);
};
