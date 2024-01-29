import { useState } from "react";
import { CheckboxAccordionGroup, Item } from "../../CheckboxAccordionGroup";
import { useCheckboxData } from "../../hooks/useCheckboxData";

interface Props {
	label: string;
	children: Item[];
}

export const AccordionAroundTheFirstElementsCheckbox = ({ label, children }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const { dataSelected, setDataSelected } = useCheckboxData();

	const handleCheck = (item: Item) => {
		// Check if the item is already in the state
		const isSelected = dataSelected.includes(item);

		// Update the state based on the current state of the item
		setDataSelected((prevSelectedItems) =>
			isSelected
				? prevSelectedItems.filter((selectedItem) => selectedItem !== item)
				: [...prevSelectedItems, item]
		);
	};

	return (
		<div>
			<button onClick={() => setIsOpen(!isOpen)}>{label}</button>

			{isOpen && <CheckboxAccordionGroup items={children} onCheck={handleCheck} />}
		</div>
	);
};
