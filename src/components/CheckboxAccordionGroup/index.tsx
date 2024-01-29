import { CheckboxAccordion } from "../CheckboxAccordion";
import { FirstElementProvider } from "../context/FirstElementProvider";

export type Item = {
	label: string;
	firstElement?: boolean;

	// when is last child:
	parentLabel?: string;
	parentId: number;
	attributeId: number;
	surveyAttributeId: number;

	// when is not last child:
	children?: Item[];
};

interface CheckboxAccordionGroupProps {
	items: Item[];

	onCheck: (item: Item) => void;
}

export const CheckboxAccordionGroup = ({ items, onCheck }: CheckboxAccordionGroupProps) => {
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
			{items.map((item) => (
				<FirstElementProvider firstElement={item}>
					<CheckboxAccordion item={item} onClick={() => handleCheck(item)} />
				</FirstElementProvider>
			))}
		</>
	);
};
