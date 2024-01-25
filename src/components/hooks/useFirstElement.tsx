import { useContext } from "react";
import { FirstElementContext } from "../context/FirstElementProvider";

export const useFirstElement = () => {
	return useContext(FirstElementContext);
};
