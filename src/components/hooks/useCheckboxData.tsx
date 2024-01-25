import { useContext } from "react";
import { CheckboxDataContext } from "../context/CheckboxDataProvider";

export const useCheckboxData = () => {
	return useContext(CheckboxDataContext);
};
