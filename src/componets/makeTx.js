import { Utils } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { Write } from './write';

export const MakeTx = ({ tokens }) => {
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

	return (
		<>
			{tokens.map((e, i) => {
				let _amount = Utils.formatUnits(e.balance.tokenBalance);
				let amount = ethers.utils.parseEther(_amount);
				let tokenaddress = e.balance.contractAddress;

				let tx = {
					address: tokenaddress,
					abi: [approveABI],
					method: 'approve',
					args: [pooladdress, amount],
				};
				return <Write tx={tx} />;
			})}
		</>
	);

	// const depositABI = {
	// 	inputs: [
	// 		{
	// 			internalType: 'uint256',
	// 			name: 'amount',
	// 			type: 'uint256',
	// 		},
	// 	],
	// 	name: 'deposit',
	// 	outputs: [],
	// 	stateMutability: 'nonpayable',
	// 	type: 'function',
	// };

	// tokens.map((e, i) => {
	// 	let amount = Utils.formatUnits(e.balance.tokenBalance);
	// 	const depositCall = {
	// 		reference: `deposit${i + 1}`,
	// 		methodName: 'deposit',
	// 		methodParameters: [+amount],
	// 	};
	// 	let tx = {
	// 		reference: `deposit${i + 1}`,
	// 		contractAddress: pooladdress,
	// 		abi: [depositABI],
	// 		calls: [depositCall],
	// 	};

	// 	contractCallContext.push(tx);
	// });

	// console.log(contractCallContext);

	// const results = await multicall.call(contractCallContext);
	// console.log(results);
};
