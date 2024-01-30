import { Item } from "../CheckboxAccordionGroup";
import { useFirstElement } from "../hooks/useFirstElement";
import { useCheckboxData } from "../hooks/useCheckboxData";
import { useState } from "react";

interface CheckboxAccordionProps {
	item: Item;
	onClick: () => void;
}

const getIfIsChecked = (items: Item[], item: Item) => {
	if (item.firstElement) {
		return items.filter((metaItem) => metaItem.label === item.label).length > 0;
	}

	for (const metaItem of items) {
		if (metaItem.attributeId !== undefined && metaItem.attributeId === item.attributeId) {
			return true;
		}

		if (metaItem.attributeId === item.attributeId && metaItem.label === item.label) {
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
	if (!items?.length) return false;

	for (const metaItem of items) {
		if (metaItem.attributeId !== undefined && metaItem.attributeId === item.attributeId) {
			return true;
		}

		if (metaItem.attributeId === item.attributeId && metaItem.label === item.label) {
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

const formatItemHierarchy = (item: Item, itemToBeFound: Item) => {
	if (Object.keys(item).length === 0) return;

	const newItem = item;

	if (item?.children === undefined) {
		if (item.attributeId === itemToBeFound.attributeId) {
			return item;
		}
	}

	for (const metaItem of item?.children) {
		if (metaItem?.children === undefined) {
			if (metaItem.attributeId === itemToBeFound.attributeId) {
				newItem.children = [metaItem];
			}
		}

		const isItemInArray = getIfItemIsInArray(metaItem?.children, itemToBeFound);

		if (isItemInArray) {
			newItem.children = [metaItem];
		}
	}

	return newItem;
};

const getItemHierarchy = (items: Item[], item: Item) => {
	let itemHierarchy = {};

	if (items === undefined) return;

	for (const metaItem of items) {
		if (metaItem?.children === undefined) {
			if (metaItem.attributeId === item.attributeId) {
				itemHierarchy = metaItem;
			}
		}

		const isItemInArray = getIfItemIsInArray(metaItem?.children, item);

		if (isItemInArray) {
			itemHierarchy = metaItem;
		}
	}

	const formattedItemHierarchy = formatItemHierarchy(itemHierarchy, item);

	return formattedItemHierarchy;
};

const getIfItemIsInChildrenArray = (items: Item[], item: Item) => {
	if (!items) {
		return false;
	}

	const isItemInArray = items.some((metaItem) => metaItem.parentId === item.parentId);

	return isItemInArray;
};

const getFirstElement = (items: Item[], label: string) => {
	return items.find((item) => item.label === label);
};

const removeDuplicatedItems = (array1, array2) => {
	const array1String = array1.map((item) => JSON.stringify(item));
	const array2String = array2.map((item) => JSON.stringify(item));
	const result = new Set([...array1String, ...array2String]);

	// Convert the Set back into an array
	return Array.from(result).map((item) => JSON.parse(item));
};

function groupChildrenByLabel(items: Item[]): Item[] {
	const groupedItems: { [label: string]: Item[] } = {};

	items.forEach((item) => {
		if (!groupedItems[item.label]) {
			groupedItems[item.label] = [];
		}
		groupedItems[item.label].push(...item.children);
	});

	return Object.keys(groupedItems).map((label) => ({
		label: label,
		children: groupedItems[label],
	}));
}

const addItemWithHierarchy = (
	items: Item[],
	selectedItems: Item[],
	itemToBeAdded: Item
): Item[] => {
	const itemsCopy = JSON.parse(JSON.stringify(items));
	const firstElementLabel = items?.[0].label;

	const getParentElement = (items: Item[], itemToFound: Item): Item | undefined => {
		if (!items.length) return;

		for (const item of items) {
			const isItemInArray = getIfItemIsInChildrenArray(item.children, itemToFound);

			if (isItemInArray) {
				return item;
			}

			if (item?.children && item.children?.length > 0) {
				const parentElement = getParentElement(item.children, itemToFound);

				if (parentElement) {
					return parentElement;
				}
			}
		}
	};

	const parentElement = getParentElement(items, itemToBeAdded);
	const parentElementOfSelectedItems = getParentElement(selectedItems, itemToBeAdded);

	const firstElementOfSelectedItems = getFirstElement(selectedItems, firstElementLabel);
	const itemToBeAddedHierarchy = getItemHierarchy(itemsCopy?.[0].children, itemToBeAdded);

	console.log("item to be added hierarchy: ", itemToBeAddedHierarchy);
	console.log("First element of selected items: ", firstElementOfSelectedItems?.children);

	const formattedItems = [
		{ label: firstElementLabel, children: [itemToBeAddedHierarchy], firstElement: true },
	];

	const newItems = [] as Item[];

	const arr1 = [{ label: "a" }, { label: "b" }, { label: "c" }];
	const arr2 = [{ label: "c" }, { label: "d" }, { label: "e" }];
	const result = removeDuplicatedItems(arr1, arr2);

	const findParentElementAndAddNewItem = (items: Item[]): void => {
		for (const item of items) {
			if (item.label === parentElement?.label) {
				console.log("parent element of selected: ", parentElementOfSelectedItems);
				console.log("item: ", item);

				if (parentElementOfSelectedItems?.children) {
					item.children = [...parentElementOfSelectedItems.children, itemToBeAdded];
					break;
				}

				item.children = [itemToBeAdded];
				break;
			}

			if (item.children) {
				return findParentElementAndAddNewItem(item.children);
			}
		}
	};

	findParentElementAndAddNewItem(formattedItems);

	const mergeObjects = (items: Item[], label: string): void => {
		for (const item of items) {
			if (item?.label === label) {
				const newChildren = [...item?.children, { ...parentElement, children: [itemToBeAdded] }];
				const groupedChildren = groupChildrenByLabel(newChildren);
				item.children = groupedChildren;
				return;
			}

			item.children = [...item?.children, itemToBeAdded];
			item.children = removeDuplicatedItems(item.children, itemToBeAdded);

			if (item?.children) {
				return mergeObjects(item.children, item?.label);
			}

			return;
		}
	};

	if (firstElementOfSelectedItems?.children) {
		mergeObjects(firstElementOfSelectedItems.children, itemToBeAddedHierarchy.label);
		return [firstElementOfSelectedItems];
	}

	return formattedItems;
};

export const CheckboxAccordion = ({ item, onClick }: CheckboxAccordionProps) => {
	const [isOpen, setIsOpen] = useState(false);

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

		const dataSelectedWithoutFirstElement = dataSelected.filter(
			(metaItem) => metaItem.label !== firstElement.label
		);

		setDataSelected([...newFirstElement, ...dataSelectedWithoutFirstElement]);
	};

	const removeItem = () => {
		if (item.firstElement) {
			const newDataSelected = dataSelected.filter((metaItem) => metaItem.label !== item.label);

			setDataSelected(newDataSelected);

			return;
		}
	};

	return (
		<>
			<div onClick={() => setIsOpen(!isOpen)}>
				<label>{item.label}</label>
				<input type="checkbox" checked={isChecked} onChange={handleOnClick} />
			</div>

			{isOpen && item?.children && (
				<div style={{ marginLeft: "20px" }}>
					{item.children.map((child) => (
						<CheckboxAccordion item={child} onClick={onClick} />
					))}
				</div>
			)}
		</>
	);
};
