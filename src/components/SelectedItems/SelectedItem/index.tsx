import { Item } from "../../CheckboxAccordionGroup";

interface SelectedItemProps {
	item: Item;
}

export const SelectedItem = ({ item }: SelectedItemProps) => {
	return (
		<div style={{ marginLeft: "20px" }}>
			<li>{item.title}</li>

			{item.children && (
				<>
					{item.children.map((child) => (
						<SelectedItem key={child.title} item={child} />
					))}
				</>
			)}
		</div>
	);
};
