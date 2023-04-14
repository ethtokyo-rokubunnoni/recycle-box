import { Box, Button, Flex, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { API_KEY } from '@/data/constants';

export function Balances() {
	const { address, isConnected } = useAccount();
	const [results, setResults] = useState([]);
	const [hasQueried, setHasQueried] = useState(false);
	const [tokenDataObjects, setTokenDataObjects] = useState([]);
	const [balance, setBalance] = useState('0');

	const tokens = ['LINK'];

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
		// console.log(data.tokenBalances);
		data.tokenBalances.map((e, i) => {
			// console.log(e);
		});

		// const tokenDataPromises = [];

		for (let i = 0; i < data.tokenBalances.length; i++) {
			const tokenData = await alchemy.core.getTokenMetadata(data.tokenBalances[i].contractAddress);
			tokenDataObjects.push(tokenData);
			if (tokens.includes(tokenData.symbol)) {
				console.log('yay');
			}
			// console.log(tokenData);
		}

		// setTokenDataObjects(await Promise.all(tokenDataPromises));
		setHasQueried(true);
	};

	if (!isConnected) {
		return <Text>Connect wallet to show balances</Text>;
	}

	return (
		<>
			{hasQueried ? (
				<>
					<Text>Balance : {balance} ETH</Text>
					<SimpleGrid columns={4} spacing={24}>
						{results.tokenBalances.map((e, i) => {
							return (
								<Flex flexDir={'column'} color='white' w={'20vw'} key={i}>
									<Box>
										<b>Symbol:</b> ${tokenDataObjects[i].symbol}&nbsp;
									</Box>
									<Box>
										<b>Balance:</b>&nbsp;
										{Utils.formatUnits(e.tokenBalance, tokenDataObjects[i].decimals)}
									</Box>
									<Image src={tokenDataObjects[i].logo} />
								</Flex>
							);
						})}
					</SimpleGrid>
				</>
			) : (
				<>
					<Button onClick={showBalances}>Show balances</Button>
				</>
			)}
		</>
	);
}
