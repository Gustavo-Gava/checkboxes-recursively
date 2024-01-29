import { useState } from "react";
import { CheckboxAccordion } from "../CheckboxAccordion";

export type Item = {
	title: string;

	children?: Item[];
};

interface CheckboxAccordionGroupProps {
	items: Item[];

	onCheck: (item: Item) => void;
}

export const CheckboxSelectedItems = ({ items, onCheck }: CheckboxAccordionGroupProps) => {
	const handleCheck = (item: Item) => {
		// Check if the parent items are not already in the state
		const isParentSelected = items.some((parent) => selectedItems?.includes(parent));

		if (!isParentSelected) {
			// Add the parent items to the state
			let parent = item;
			while (parent) {
				onCheck(parent);
				parent = items.find((i) => i.children && i.children?.includes(parent)) || null;
			}
		}

		// Add or remove the current item based on its current state
		onCheck(item);
	};

	return (
		<>
			{selectedItems.map((item, index) => (
				<>
					<CheckboxAccordion title={item.label} onClick={() => handleCheck(item)} />

					{item.children && <CheckboxAccordionGroup items={item.children} onCheck={onCheck} />}
				</>
			))}
		</>
	);
};
