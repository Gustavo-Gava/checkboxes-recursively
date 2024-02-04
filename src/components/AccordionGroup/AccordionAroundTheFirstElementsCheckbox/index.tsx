import { useState } from "react";
import { CheckboxAccordionGroup, Item } from "../../CheckboxAccordionGroup";

interface Props {
	label: string;
	children: Item[];
}

export const AccordionAroundTheFirstElementsCheckbox = ({ label, children }: Props) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
			<button onClick={() => setIsOpen(!isOpen)}>{label}</button>

			{isOpen && <CheckboxAccordionGroup items={children} />}
		</div>
	);
};
