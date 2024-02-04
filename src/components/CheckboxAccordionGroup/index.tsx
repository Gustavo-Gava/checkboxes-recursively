import { CheckboxAccordion } from "../CheckboxAccordion";
import { FirstElementProvider } from "../context/FirstElementProvider";

export type Item = {
	label: string;
	firstElement?: boolean;
	checked?: boolean;

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
}

export const CheckboxAccordionGroup = ({ items }: CheckboxAccordionGroupProps) => {
	console.log("items: ", items);

	return (
		<>
			{items.map((item) => (
				<FirstElementProvider firstElement={item}>
					<CheckboxAccordion item={item} />
				</FirstElementProvider>
			))}
		</>
	);
};
