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

const checkAllChildren = (items: Item[], checkedValue: boolean) => {
	items.forEach((item) => {
		item.checked = checkedValue;

		if (item.children) {
			checkAllChildren(item.children, checkedValue);
		}
	});
};

const changeCheckedProperty = (items: Item[], item: Item, checkedValue: boolean) => {
	items.forEach((metaItem) => {
		if (metaItem.attributeId !== undefined && metaItem.attributeId === item.attributeId) {
			metaItem.checked = checkedValue;

			if (metaItem.children) {
				checkAllChildren(metaItem.children, checkedValue);
			}
		}

		if (metaItem.attributeId === undefined && metaItem.label === item.label) {
			metaItem.checked = checkedValue;

			if (metaItem.children) {
				checkAllChildren(metaItem.children, checkedValue);
			}
		}

		if (getIfItemIsInArray(metaItem?.children, item)) {
			metaItem.checked = checkedValue;
			changeCheckedProperty(metaItem?.children, item, checkedValue);
		}

		if (metaItem.children) {
			changeCheckedProperty(metaItem.children, item, checkedValue);
		}
	});
};

const getItemsWithCheckedPropertyChanged = (items: Item[], item: Item, isAdding: boolean) => {
	const itemsCopy = JSON.parse(JSON.stringify(items));

	changeCheckedProperty(itemsCopy, item, isAdding);

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
	const newItems = getItemsWithCheckedPropertyChanged(items, itemToBeAdded, true);

	return newItems;
};

const removeItemWithHierarchy = (items: Item[], itemToBeRemoved: Item) => {
	const newItems = getItemsWithCheckedPropertyChanged(items, itemToBeRemoved, false);

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
		if (firstElement.children === undefined) return;

		console.log("item: ", item);
		console.log("data selected: ", dataSelected);

		const newDataSelected = addItemWithHierarchy(dataSelected, item);
		setDataSelected(newDataSelected);
	};

	const removeItem = () => {
		if (item.firstElement) {
			const newDataSelected = dataSelected.filter((metaItem) => metaItem.label !== item.label);

			setDataSelected(newDataSelected);

			return;
		}

		if (firstElement.children === undefined) return;

		const newDataSelected = removeItemWithHierarchy(dataSelected, item);

		setDataSelected(newDataSelected);
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
						<CheckboxAccordion key={child.label} item={child} />
					))}
				</div>
			)}
		</>
	);
};
