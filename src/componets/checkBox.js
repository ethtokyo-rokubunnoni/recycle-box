import { useMulticall } from '@/helper/multicall';
import { Button, Checkbox, Stack } from '@chakra-ui/react';
import { Utils } from 'alchemy-sdk';
import { useState } from 'react';
// import { useConnect } from 'wagmi';

export function CheckBox({ tokenList }) {
	const checked = [];
	Object.keys(tokenList).map((keyname, i) => {
		let n = tokenList[keyname].tokens.length;
		checked.push(new Array(n).fill(false));
	});

	let recycleTokens = [];

	// const { connector } = useConnect();

	const recycle = () => {
		Object.keys(tokenList).map((keyname, i) => {
			tokenList[keyname].tokens.map((e, j) => {
				if (checked[i][j]) {
					recycleTokens.push(e);
				}
			});
		});
		useMulticall(recycleTokens);
		// console.log(recycleTokens);
	};

	return (
		<>
			{Object.keys(tokenList).map((keyname, i) => {
				let n = tokenList[keyname].tokens.length;
				const [checkedItems, setCheckedItems] = useState(new Array(n).fill(false));
				const allChecked = checkedItems.every(Boolean);
				const isIndeterminate = checkedItems.some(Boolean) && !allChecked;
				checked[i] = checkedItems;

				return (
					<>
						<Checkbox
							key={keyname}
							isChecked={allChecked}
							isIndeterminate={isIndeterminate}
							onChange={(e) =>
								setCheckedItems([e.target.checked, e.target.checked, e.target.checked])
							}
						>
							{keyname}
						</Checkbox>
						<Stack pl={6} mt={1} spacing={1}>
							{tokenList[keyname].tokens.map((e, j) => {
								return (
									<Checkbox
										key={e.symbol}
										isChecked={checkedItems[j]}
										onChange={(a) => {
											setCheckedItems((checkedItems) => {
												return checkedItems.map((item, k) => {
													return k === j ? a.target.checked : item;
												});
											});
										}}
									>
										{e.data.symbol} {Utils.formatUnits(e.balance.tokenBalance, e.data.decimals)}
									</Checkbox>
								);
							})}
						</Stack>
					</>
				);
			})}

			<Button onClick={() => recycle()}>Recycle</Button>
		</>
	);
}