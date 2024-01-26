import { Item } from "../CheckboxAccordionGroup";
import { useFirstElement } from "../hooks/useFirstElement";
import { useCheckboxData } from "../hooks/useCheckboxData";

interface CheckboxAccordionProps {
	item: Item;
	onClick: () => void;
}

const getIfIsChecked = (items: Item[], item: Item) => {
	if (item.firstElement) {
		return items.filter((metaItem) => metaItem.title === item.title).length > 0;
	}

	for (const metaItem of items) {
		if (metaItem.title === item.title) {
			return true;
		}

		if (metaItem.children) {
			if (getIfIsChecked(metaItem.children, item)) {
				return true;
			}
		}
	}

	return false;
};

const getIfItemIsInArray = (items: Item[], item: Item) => {
	if (!item?.children) {
		return false;
	}

	for (const metaItem of items) {
		if (metaItem.title === item.title) {
			return true;
		}

		if (metaItem.children) {
			if (getIfItemIsInArray(metaItem.children, item)) {
				return true;
			}
		}
	}

	return false;
};

const addItemWithHierarchy = (
	items: Item[],
	selectedItems: Item[],
	itemToBeAdded: Item
): Item[] => {
	const itemsCopy = JSON.parse(JSON.stringify(items));

	const getParentElement = (items: Item[]): Item | null => {
		if (!items.length) return null;

		for (const item of items) {
			if (item.title === itemToBeAdded.parentLabel) {
				return item;
			}

			if (item.children) {
				return getParentElement(item.children);
			}
		}
	};

	const parentElement = getParentElement(items);
	const parentElementOfSelectedItems = getParentElement(selectedItems);

	const listOfTitlesThatShouldNotBeRemoved = [] as string[];

	const formatItems = (items: Item[]) => {
		for (const item of items) {
			if (item?.children && item?.children.length) {
				const isItemInArray = getIfItemIsInArray(items, item);

				if (isItemInArray) {
					listOfTitlesThatShouldNotBeRemoved.push(item.title);
					formatItems(item.children);
				}
			}

			if (item?.children && item?.children.length) {
				formatItems(item.children);
			}
		}

		return items;
	};

	const removeAllItemsThatShouldBeRemoved = (items: Item[]): Item[] => {
		return items.reduce((result, item) => {
			("");
			if (listOfTitlesThatShouldNotBeRemoved.includes(item.title)) {
				const formattedChildren = removeAllItemsThatShouldBeRemoved(item.children || []);
				result.push({ ...item, children: formattedChildren });
			} else {
				const formattedChildren = removeAllItemsThatShouldBeRemoved(item.children || []);
				result = result.concat(formattedChildren);
			}

			return result;
		}, []);
	};

	formatItems(itemsCopy);

	const formattedItems = removeAllItemsThatShouldBeRemoved(itemsCopy);

	const findParentElementAndAddNewItem = (items: Item[]): Item[] => {
		for (const item of items) {
			if (item.title === parentElement.title) {
				if (parentElementOfSelectedItems?.children) {
					item.children = [...parentElementOfSelectedItems.children, itemToBeAdded];
					return items;
				}

				item.children = [itemToBeAdded];
				return items;
			}

			if (item.children) {
				findParentElementAndAddNewItem(item.children);
			}
		}

		return items;
	};

	findParentElementAndAddNewItem(formattedItems);

	console.log("formattedItems: ", formattedItems);
	return formattedItems;
};

export const CheckboxAccordion = ({ item, onClick }: CheckboxAccordionProps) => {
	const { dataSelected, setDataSelected } = useCheckboxData();
	const { firstElement } = useFirstElement();

	const isChecked = getIfIsChecked(dataSelected, item);

	const handleOnClick = () => {
		if (isChecked) {
			removeItem();

			return;
		}

		addItem();
	};

	const addItem = () => {
		if (item.firstElement) {
			setDataSelected((prevValue) => {
				return [...prevValue, item];
			});

			return;
		}

		if (firstElement.children === undefined) return;

		const newFirstElement = addItemWithHierarchy([firstElement], dataSelected, item);
		// const newFirstElement = {
		// 	...firstElement,
		// 	children: newFirstElementChildren,
		// };

		console.log("New first element: ", newFirstElement);

		const dataSelectedWithoutFirstElement = dataSelected.filter(
			(metaItem) => metaItem.title !== firstElement.title
		);

		setDataSelected([...newFirstElement, ...dataSelectedWithoutFirstElement]);
	};

	const removeItem = () => {
		if (item.firstElement) {
			const newDataSelected = dataSelected.filter((metaItem) => metaItem.title !== item.title);

			setDataSelected(newDataSelected);

			return;
		}
	};

	return (
		<>
			<div>
				<label>{item.title}</label>
				<input type="checkbox" checked={isChecked} onChange={handleOnClick} />
			</div>

			{item?.children && (
				<div style={{ marginLeft: "20px" }}>
					{item.children.map((child) => (
						<CheckboxAccordion item={child} onClick={onClick} />
					))}
				</div>
			)}
		</>
	);
};
