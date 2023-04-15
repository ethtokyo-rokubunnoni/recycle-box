import { Utils } from 'alchemy-sdk';

export const multicall = (tokens, address) => {
	const pooladdress = '0x21c01b97E86839E156505941AA08799625971140';
	const contractCallContext = [];

	const allowanceABI = {
		constant: true,
		inputs: [
			{
				name: '_owner',
				type: 'address',
			},
			{
				name: '_spender',
				type: 'address',
			},
		],
		name: 'allowance',
		outputs: [
			{
				name: '',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	};

	tokens.map((e, i) => {
		let amount = Utils.formatUnits(e.balance.tokenBalance);
		let tokenaddress = e.balance.contractAddress;

		const allowanceABICall = {
			reference: `allowance`,
			methodName: 'allowance',
			methodParameters: [address, pooladdress],
		};
		let tx = {
			reference: `allowance${i}`,
			contractAddress: tokenaddress,
			abi: [allowanceABI],
			calls: [allowanceABICall],
		};

		contractCallContext.push(tx);
	});

	const depositABI = {
		inputs: [
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'deposit',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	};

	return contractCallContext;
};
