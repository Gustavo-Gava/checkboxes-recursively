import { useState } from "react";
import { Item } from "./CheckboxAccordionGroup";

interface Props {
	data: Item[];
}

export const BasicExample = ({ data }: Props) => {
	const [isChecked, setIsChecked] = useState(false);

	function handleChange() {
		// I've created many complex functions to handle the state of the checkboxes
		// but it wouldn't be helpful to show them here
		setIsChecked(!isChecked);
	}

	return (
		<div>
			{data.map((item) => (
				<>
					<div style={{ marginLeft: "20px" }}>
						<label>{item.label}</label>

						<input type="checkbox" checked={isChecked} onChange={handleChange} />

						{item.children && <BasicExample data={item.children} />}
					</div>
				</>
			))}
		</div>
	);
};
