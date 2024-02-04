import { Item } from "../CheckboxAccordionGroup";
import { useFirstElement } from "../hooks/useFirstElement";
import { useCheckboxData } from "../hooks/useCheckboxData";
import { useState } from "react";

interface CheckboxAccordionProps {
	item: Item;
}

const getIfIsChecked = (items: Item[], item: Item) => {
	if (item.firstElement) {
		return items.filter((metaItem) => metaItem.label === item.label && metaItem.checked).length > 0;
	}

	for (const metaItem of items) {
		if (metaItem.attributeId !== undefined && metaItem.attributeId === item.attributeId) {
			return !!metaItem.checked;
		}

		if (metaItem.attributeId === item.attributeId && metaItem.label === item.label) {
			return !!metaItem.checked;
		}

		if (metaItem.children) {
			if (getIfIsChecked(metaItem.children, item)) {
				return !!metaItem.checked;
			}
		}
	}

	return false;
};

const changeCheckedProperty = (items: Item[], item: Item) => {
	items.forEach((metaItem) => {
		if (metaItem.attributeId === item.attributeId) {
			metaItem.checked = true;

			if (metaItem.label === item.label) {
				metaItem.checked = true;
			}
		}

		if (getIfItemIsInArray(metaItem?.children, item)) {
			metaItem.checked = true;
			changeCheckedProperty(metaItem?.children, item);
		}

		if (metaItem.children) {
			changeCheckedProperty(metaItem.children, item);
		}
	});
};

const getItemsWithCheckedPropertyChanged = (items: Item[], item: Item) => {
	const itemsCopy = JSON.parse(JSON.stringify(items));

	changeCheckedProperty(itemsCopy, item);

	return itemsCopy;
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
	if (!array1?.length) {
		return array2;
	}

	if (!array2?.length) {
		return array1;
	}

	const array1String = array1?.map((item) => JSON.stringify(item));
	const array2String = array2?.map((item) => JSON.stringify(item));
	const result = new Set([...array1String, ...array2String]);

	// Convert the Set back into an array
	return Array.from(result).map((item) => JSON.parse(item));
};

function groupChildrenByLabel(items: Item[]): Item[] {
	const groupedItems: { [label: string]: Item[] } = {};

	console.log("group children by label: ", items);

	items?.forEach((item) => {
		if (!groupedItems[item.label]) {
			groupedItems[item.label] = [];
		}

		groupedItems[item.label].push(...item?.children);
	});

	return Object.keys(groupedItems).map((label) => ({
		label: label,
		children: groupedItems[label],
	}));
}

// const addItemWithHierarchy = (
// 	items: Item[],
// 	selectedItems: Item[],
// 	itemToBeAdded: Item
// ): Item[] => {
// 	const itemsCopy = JSON.parse(JSON.stringify(items));
// 	const firstElementLabel = items?.[0].label;

// 	const getParentElement = (items: Item[], itemToFound: Item): Item | undefined => {
// 		if (!items.length) return;

// 		for (const item of items) {
// 			const isItemInArray = getIfItemIsInChildrenArray(item.children, itemToFound);

// 			if (isItemInArray) {
// 				return item;
// 			}

// 			if (item?.children && item.children?.length > 0) {
// 				const parentElement = getParentElement(item.children, itemToFound);

// 				if (parentElement) {
// 					return parentElement;
// 				}
// 			}
// 		}
// 	};

// 	const parentElement = getParentElement(items, itemToBeAdded);
// 	const parentElementOfSelectedItems = getParentElement(selectedItems, itemToBeAdded);

// 	const firstElementOfSelectedItems = getFirstElement(selectedItems, firstElementLabel);
// 	const itemToBeAddedHierarchy = getItemHierarchy(itemsCopy?.[0].children, itemToBeAdded);

// 	const formattedItems = [
// 		{ label: firstElementLabel, children: [itemToBeAddedHierarchy], firstElement: true },
// 	];

// 	const findParentElementAndAddNewItem = (items: Item[]): void => {
// 		for (const item of items) {
// 			if (item.label === parentElement?.label) {
// 				console.log("parent element of selected: ", parentElementOfSelectedItems);
// 				console.log("item: ", item);

// 				if (parentElementOfSelectedItems?.children) {
// 					item.children = [...parentElementOfSelectedItems.children, itemToBeAdded];
// 					break;
// 				}

// 				item.children = [itemToBeAdded];
// 				break;
// 			}

// 			if (item.children) {
// 				return findParentElementAndAddNewItem(item.children);
// 			}
// 		}
// 	};

// 	findParentElementAndAddNewItem(formattedItems);

// 	const mergeObjects = (items: Item[], label: string): void => {
// 		for (const item of items) {
// 			if (item?.label === label) {
// 				if (getIfItemIsInChildrenArray(parentElement?.children, item)) {
// 					if (parentElementOfSelectedItems?.children) {
// 						console.log("entered parent element.children");
// 						item.children = [...parentElementOfSelectedItems.children, itemToBeAdded];
// 						return;
// 					}

// 					item.children = [itemToBeAdded];
// 					return;
// 				}

// 				const newChildren = [...item?.children, { ...parentElement, children: [itemToBeAdded] }];
// 				const groupedChildren = groupChildrenByLabel(newChildren);
// 				item.children = groupedChildren;
// 				return;
// 			}

// 			const childIsLastElement = item?.children?.find((child) => child.attributeId);

// 			if (!childIsLastElement) {
// 				item.children = [...item?.children, itemToBeAdded];
// 				item.children = removeDuplicatedItems(item.children, itemToBeAdded.children);
// 			}

// 			console.log("item.children: ", item);

// 			if (item?.children) {
// 				return mergeObjects(item.children, item?.label);
// 			}

// 			return;
// 		}
// 	};

// 	if (firstElementOfSelectedItems?.children) {
// 		const childIsLastElement = firstElementOfSelectedItems?.children?.[0]?.children?.find(
// 			(child) => child.attributeId
// 		);

// 		console.log("is child last element: ", childIsLastElement);

// 		if (!childIsLastElement) {
// 			console.log("entered here");
// 			mergeObjects(firstElementOfSelectedItems.children, itemToBeAddedHierarchy?.label);
// 			return [firstElementOfSelectedItems];
// 		}
// 	}

// 	return formattedItems;
// };

const addItemWithHierarchy = (items: Item[], itemToBeAdded: Item) => {
	const newItems = getItemsWithCheckedPropertyChanged(items, itemToBeAdded);

	console.log("new items: ", newItems);

	return newItems;
};

export const CheckboxAccordion = ({ item }: CheckboxAccordionProps) => {
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

		const newDataSelected = addItemWithHierarchy(dataSelected, item);

		// const dataSelectedWithoutFirstElement = dataSelected.filter(
		// 	(metaItem) => metaItem.label !== firstElement.label
		// );

		setDataSelected(newDataSelected);
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
						<CheckboxAccordion item={child} />
					))}
				</div>
			)}
		</>
	);
};
