import { Text } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { API_KEY } from '@/data/constants';
import { CheckBox } from './checkBox';
import { useEffect } from 'react';

export function Balances({ isConnected, onCheckedTokensChange }) {
	const { address } = useAccount();
	const [results, setResults] = useState([]);
	const [hasQueried, setHasQueried] = useState(false);
	const [tokenDataObjects, setTokenDataObjects] = useState([]);
	const [balance, setBalance] = useState('0');

	const pooltokens = ['LINK', 'ETH', 'MATIC'];
	const pools = {
		listName: 'POOLS',
		tokens: [],
	};
	const others = {
		listName: 'OTHERS',
		tokens: [],
	};
	const showBalances = async () => {
		const config = {
			apiKey: API_KEY,
			network: Network.MATIC_MUMBAI,
		};

		const alchemy = new Alchemy(config);

		const balanceobj = await alchemy.core.getBalance(address);
		let res = Utils.formatEther(parseInt(balanceobj._hex).toString());
		if (res.length > 4) res = (+res).toFixed(3);
		setBalance(res);

		// const matic_address = '0x0000000000000000000000000000000000001010';
		// console.log(await alchemy.core.getTokenMetadata(matic_address));

		const data = await alchemy.core.getTokenBalances(address);

		setResults(data);

		let _tokenData = [];

		for (let i = 0; i < data.tokenBalances.length; i++) {
			let _data = data.tokenBalances[i];
			const tokenData = await alchemy.core.getTokenMetadata(_data.contractAddress);
			_tokenData.push(tokenData);
		}

		setTokenDataObjects(_tokenData);
		setHasQueried(true);
	};
	let y;

	useEffect(() => {
		if (isConnected) {
			showBalances();
		} else {
			setHasQueried(false);
		}
	}, [isConnected]);

	return (
		<>
			{hasQueried ? (
				<>
					<Text fontSize='24px' fontWeight='bold' mb={4}>
						Balance : {balance} MATIC
					</Text>
					{results.tokenBalances.map((e, i) => {
						let x = { data: tokenDataObjects[i], balance: e };
						if (pooltokens.includes(tokenDataObjects[i].symbol)) {
							pools.tokens.push(x);
						} else {
							others.tokens.push(x);
						}
						y = { pools, others };
					})}
					<CheckBox tokenList={y} onCheckedTokensChange={onCheckedTokensChange} />
				</>
			) : (
				<Text>Connect wallet to show Token Balances</Text>
			)}
		</>
	);
}
