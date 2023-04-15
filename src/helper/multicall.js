import { Multicall } from 'ethereum-multicall';
import { Utils } from 'alchemy-sdk';
// import getDefaultProvider from 'ethers';

export const multicall = (tokens) => {
	// const provider = await getDefaultProvider();

	// const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });
	const pooladdress = '0x21c01b97E86839E156505941AA08799625971140';
	const contractCallContext = [];

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

	tokens.map((e, i) => {
		let amount = Utils.formatUnits(e.balance.tokenBalance);
		let tokenaddress = e.balance.contractAddress;

		const approveCall = {
			reference: `approve${i + 1}`,
			methodName: 'approve',
			methodParameters: [pooladdress, +amount],
		};
		let tx = {
			reference: `approve${i + 1}`,
			contractAddress: tokenaddress,
			abi: [approveABI],
			calls: [approveCall],
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

	tokens.map((e, i) => {
		let amount = Utils.formatUnits(e.balance.tokenBalance);
		const depositCall = {
			reference: `deposit${i + 1}`,
			methodName: 'deposit',
			methodParameters: [+amount],
		};
		let tx = {
			reference: `deposit${i + 1}`,
			contractAddress: pooladdress,
			abi: [depositABI],
			calls: [depositCall],
		};

		contractCallContext.push(tx);
	});

	console.log(contractCallContext);

	// const results = await multicall.call(contractCallContext);
	// console.log(results);
};
