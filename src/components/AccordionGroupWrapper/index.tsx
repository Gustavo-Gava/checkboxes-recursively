import { AccordionGroup } from "../AccordionGroup";
import { data } from "../const/data";
import { useCheckboxData } from "../hooks/useCheckboxData";

function getParentElements(items: Item[]): Item[] {
	const parentElements = items.map((item) => {
		if (!item?.children) {
			return item;
		}

		const childrenFormatted = item.children.map((child) => {
			const childOfChildrenFormatted = child.children.map((grandchild) => {
				return {
					...grandchild,
					firstElement: true,
				};
			});

			return {
				...child,
				children: childOfChildrenFormatted,
			};
		});

		return {
			...item,
			children: childrenFormatted,
		};
	});

	console.log("data initil: ", items);
	console.log("formatted data: ", parentElements);

	return parentElements;
}

export const AccordionGroupWrapper = () => {
	const { dataSelected } = useCheckboxData();

	const dataFormatted = getParentElements(dataSelected);

	return (
		<>
			{dataFormatted.map((item) => (
				<AccordionGroup item={item} />
			))}
		</>
	);
};
