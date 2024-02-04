import { Item } from "../../CheckboxAccordionGroup";

interface SelectedItemProps {
	item: Item;
}

export const SelectedItem = ({ item }: SelectedItemProps) => {
	if (!item.checked) return <></>;

	return (
		<ul style={{ marginLeft: "20px" }}>
			<li>{item.label}</li>

			{item.children && (
				<>
					{item.children.map((child) => (
						<>{item.checked && <SelectedItem item={child} />}</>
					))}
				</>
			)}
		</ul>
	);
};
