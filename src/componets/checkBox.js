import { Button, Checkbox, Stack } from '@chakra-ui/react';
import { Utils } from 'alchemy-sdk';
import { useState } from 'react';
import { MakeTx } from './makeTx';

export function CheckBox({ tokenList }) {
	const checked = [];
	Object.keys(tokenList).map((keyname, i) => {
		let n = tokenList[keyname].tokens.length;
		checked.push(new Array(n).fill(false));
	});

	const [isRecycled, setIsRecycled] = useState(false);
	const [recycleTokens, setRecycleTokens] = useState([]);

	const recycle = () => {
		if (!isRecycled) {
			setIsRecycled(true);
			let _recycleTokens = [];

			Object.keys(tokenList).map((keyname, i) => {
				tokenList[keyname].tokens.map((e, j) => {
					if (checked[i][j]) {
						_recycleTokens.push(e);
					}
				});
			});
			setRecycleTokens(_recycleTokens);
		}
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
							onChange={(e) => {
								setCheckedItems(new Array(n).fill(e.target.checked));
							}}
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

			{isRecycled ? (
				<>
					<MakeTx tokens={recycleTokens} />
				</>
			) : (
				<>
					<Button disabled={isRecycled} onClick={() => recycle()}>
						Recycle
					</Button>
				</>
			)}
		</>
	);
}
