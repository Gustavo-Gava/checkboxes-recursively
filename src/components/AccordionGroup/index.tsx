import { useState } from "react";
import { Item } from "../CheckboxAccordionGroup";
import { AccordionAroundTheFirstElementsCheckbox } from "./AccordionAroundTheFirstElementsCheckbox";

type ItemGroup = {
	label: string;
	children: Item[];
};

interface AccordionGroupProps {
	item: {
		label: string;
		children: Item[];
	};
}

export const AccordionGroup = ({ item }: AccordionGroupProps) => {
	const [isOpen, setIsOpen] = useState(false);

	console.log("Item Children: ", item.children);

	return (
		<div>
			<button onClick={() => setIsOpen(!isOpen)}>
				<p>{item.label}</p>
			</button>

			{isOpen && (
				<>
					{item.children.map((item) => (
						<AccordionAroundTheFirstElementsCheckbox label={item.label} children={item.children} />
					))}
				</>
			)}
		</div>
	);
};
