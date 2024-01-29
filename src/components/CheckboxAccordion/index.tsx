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
		if (metaItem.label === item.label) {
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
	// if (!item?.children) {
	// 	return false;
	// }

	for (const metaItem of items) {
		if (metaItem.label === item.label) {
			return true;
		}

		if (metaItem?.children) {
			if (getIfItemIsInArray(metaItem.children, metaItem)) {
				return true;
			}
		}

		if (metaItem?.attributeId !== undefined && metaItem?.attributeId === item?.attributeId) {
			return true;
		}

		// in this scenario, the item is a parent
		// so, both the attributeId are undefined, but the label need to be the same
		if (metaItem?.attributeId === item?.attributeId && metaItem?.label === item?.label) {
			return true;
		}

		if (metaItem.children) {
			if (getIfItemIsInArray(metaItem.children, metaItem)) {
				return true;
			}
		}

		return false;
	}

	return false;
};

const getIfItemIsInChildrenArray = (items: Item[], item: Item) => {
	if (!items) {
		return false;
	}

	return items.some((metaItem) => {
		if (metaItem?.attributeId !== undefined && metaItem?.attributeId === item?.attributeId) {
			return true;
		}

		// in this scenario, the item is a parent
		// so, both the attributeId are undefined, but the label need to be the same
		if (metaItem?.attributeId === item?.attributeId && metaItem?.label === item?.label) {
			return true;
		}

		return false;
	});
};

const addItemWithHierarchy = (
	items: Item[],
	selectedItems: Item[],
	itemToBeAdded: Item
): Item[] => {
	const itemsCopy = JSON.parse(JSON.stringify(items));

	const getParentElement = (items: Item[], itemToFound: Item, type?: string): Item | undefined => {
		console.log(`items of ${type}`, items);
		if (!items.length) return;

		for (const item of items) {
			if (type === "selectedItems") {
				console.log("rendre");
			}
			const isItemInArray = getIfItemIsInChildrenArray(item.children, itemToFound);

			if (isItemInArray) {
				console.log("item being returned: ", item);
				return item;
			}

			if (item.children) {
				return getParentElement(item.children, itemToFound);
				if (foundInChild) {
					return foundInChild;
				}
			}
		}
	};

	const parentElement = getParentElement(items, itemToBeAdded);
	const parentElementOfSelectedItems = getParentElement(
		selectedItems,
		itemToBeAdded,
		"selectedItems"
	);

	console.log("Parent element of selected items: ", parentElementOfSelectedItems);

	const listOflabelsThatShouldNotBeRemoved = [] as string[];

	const formatItems = (items: Item[]) => {
		for (const item of items) {
			if (item?.children && item?.children.length) {
				const isItemInArray = getIfItemIsInArray(items, item);

				if (isItemInArray) {
					listOflabelsThatShouldNotBeRemoved.push(item.label);
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
		return items.reduce((result: Item[], item) => {
			if (listOflabelsThatShouldNotBeRemoved.includes(item.label)) {
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

	console.log("parentElement: ", parentElement);
	console.log("list of labels: ", listOflabelsThatShouldNotBeRemoved);

	const findParentElementAndAddNewItem = (items: Item[]): Item[] => {
		for (const item of items) {
			if (item.label === parentElement?.label) {
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
			console.log("is first element");
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
			<div onClick={() => setIsOpen(!false)}>
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
