export const mockedData = [
	{ title: "Item 1" },
	{
		title: "Item 2",

		children: [
			{ title: "Item 2.1", parentLabel: "Item 2" },
			{
				title: "Item 2.2",
				parentLabel: "Item 2",
				children: [
					{
						title: "Item 2.1.1",
						parentLabel: "Item 2.2",
						children: [
							{ title: "Item 2.1.1.1", parentLabel: "Item 2.1.1" },
							{
								title: "Item 2.1.1.2",
								parentLabel: "Item 2.1.1",
								children: [
									{ title: "Item 2.1.1.2.1", parentLabel: "Item 2.1.1.2" },
									{ title: "Item 2.1.1.2.2", parentLabel: "Item 2.1.1.2" },
								],
							},
						],
					},
				],
			},
		],
	},
	{
		title: "Item 3",
	},
];
