import { Button, Checkbox, Stack } from '@chakra-ui/react';
import { Utils } from 'alchemy-sdk';
import { useState } from 'react';
import { MakeTx } from './makeTx';
import { ethers } from 'ethers';
import { Multicall } from 'ethereum-multicall';
import { multicall } from '@/helper/multicall';
import { useAccount, useProvider } from 'wagmi';

const pooladdress = '0x21c01b97E86839E156505941AA08799625971140';
const approveABI = {
	name: 'approve',
	type: 'function',
	inputs: [
		{ name: '_spender', type: 'address' },
		{ name: '_value', type: 'uint256' },
	],
	outputs: [{ name: '', type: 'bool' }],
	constant: false,
	payable: false,
	stateMutability: 'nonpayable',
};

export function CheckBox({ tokenList }) {
	const checked = [];
	Object.keys(tokenList).map((keyname, i) => {
		let n = tokenList[keyname].tokens.length;
		checked.push(new Array(n).fill(false));
	});

	const [isRecycled, setIsRecycled] = useState(false);
	// const [recycleTokens, setRecycleTokens] = useState([]);
	const { address } = useAccount();
	const provider = useProvider();

	const checkAllowance = async (contractCallContext, tokens) => {
		let ifallowance = [];
		const _multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });
		const results = await _multicall.call(contractCallContext);
		let calls = results.results;
		let allowances = [];
		Object.keys(calls).map((keyname) => {
			allowances.push(calls[keyname].callsReturnContext[0].returnValues[0]);
		});
		tokens.map((e, i) => {
			let amount = Utils.formatUnits(e.balance.tokenBalance, e.data.decimals);
			let allowance = Utils.formatEther(parseInt(allowances[i].hex).toString());
			ifallowance.push(+allowance >= +amount);
		});
		return ifallowance;
	};

	const recycle = async () => {
		// if (!isRecycled) {
		// 	setIsRecycled(true);
		let _recycleTokens = [];

		Object.keys(tokenList).map((keyname, i) => {
			tokenList[keyname].tokens.map((e, j) => {
				if (checked[i][j]) {
					console.log(e);
					_recycleTokens.push(e);
				}
			});
		});
		// setRecycleTokens(_recycleTokens);

		const contractCallContext = multicall(_recycleTokens, address);
		const ifallowance = await checkAllowance(contractCallContext, _recycleTokens);
		console.log(ifallowance);

		let approveTxns = [];
		let depositAmounts = [];
		let depositTokens = [];

		_recycleTokens.map((e, i) => {
			let _amount = Utils.formatUnits(e.balance.tokenBalance);
			let amount = ethers.utils.parseEther(_amount);
			let tokenaddress = e.balance.contractAddress;
			depositAmounts.push(amount);
			depositTokens.push(tokenaddress);
			if (!ifallowance[i]) {
				let tx = {
					address: tokenaddress,
					abi: [approveABI],
					method: 'approve',
					args: [pooladdress, amount],
				};
				approveTxns.push(tx);
			}
		});

		console.log(approveTxns);
		console.log(depositAmounts);
		console.log(depositTokens);
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

			{/* {isRecycled ? (
				<>
					<MakeTx />
				</>
			) : ( */}
			<>
				<Button onClick={() => recycle()}>Recycle</Button>
			</>
			{/* )} */}
		</>
	);
}
