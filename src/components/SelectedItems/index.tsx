import { useCheckboxData } from "../hooks/useCheckboxData";
import { SelectedItem } from "./SelectedItem";

export const SelectedItems = () => {
	const { dataSelected } = useCheckboxData();

	return (
		<div>
			<h2>Selected Items</h2>
			<ul>
				{dataSelected.map((item) => (
					<SelectedItem item={item} />
				))}
			</ul>
		</div>
	);
};
