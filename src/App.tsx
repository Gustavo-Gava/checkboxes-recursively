import { useState } from "react";
import "./App.css";
import { CheckboxAccordionGroup, Item } from "./components/CheckboxAccordionGroup";
import { CheckboxDataProvider } from "./components/context/CheckboxDataProvider";
import { SelectedItems } from "./components/SelectedItems";
import { mockedData } from "./components/const";

function getParentElements(items: Item[]): Item[] {
	const parentElements = items.map((item) => {
		return {
			...item,
			firstElement: true,
		};
	});

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

	const dataFormatted = getParentElements(mockedData);

	return (
		<>
			<CheckboxDataProvider>
				<div>
					<h2>Items rendered: </h2>
					<CheckboxAccordionGroup items={dataFormatted} onCheck={handleCheck} />
				</div>

				<SelectedItems />
			</CheckboxDataProvider>
		</>
	);
}

export default App;
