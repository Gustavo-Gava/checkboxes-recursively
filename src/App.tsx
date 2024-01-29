import { useState } from "react";
import "./App.css";
import { CheckboxAccordionGroup, Item } from "./components/CheckboxAccordionGroup";
import { CheckboxDataProvider } from "./components/context/CheckboxDataProvider";
import { SelectedItems } from "./components/SelectedItems";
import { mockedData } from "./components/const";
import { data } from "./components/const/data";
import { AccordionGroup } from "./components/AccordionGroup";

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

function App() {
	const [selectedItems, setSelectedItems] = useState<Item[]>([]);

	const handleCheck = (item: Item) => {
		// Check if the item is already in the state
		const isSelected = selectedItems.includes(item);

		// Update the state based on the current state of the item
		setSelectedItems((prevSelectedItems) =>
			isSelected
				? prevSelectedItems.filter((selectedItem) => selectedItem !== item)
				: [...prevSelectedItems, item]
		);
	};

	const dataFormatted = getParentElements(data.children);

	return (
		<>
			<CheckboxDataProvider>
				{dataFormatted.map((item) => (
					<AccordionGroup item={item} />
				))}

				<SelectedItems />
			</CheckboxDataProvider>
		</>
	);
}

export default App;
