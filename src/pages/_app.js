import Layout from '@/componets/layout';
import { ChakraProvider } from '@chakra-ui/react';

import { WagmiConfig, createClient, configureChains, polygon, polygonMumbai, goerli } from 'wagmi';
// import { getDefaultProvider } from 'ethers';
// import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

const { chains, provider, webSocketProvider } = configureChains(
	[goerli],
	[
		// alchemyProvider({ apiKey: 'apikey', priority: 1 }),
		publicProvider({ priority: 0 }),
	]
);

const client = createClient({
	autoConnect: false,
	connectors: [new MetaMaskConnector({ chains })],
	provider,
	webSocketProvider,
});

export default function App({ Component, pageProps }) {
	return (
		<>
			<ChakraProvider>
				<WagmiConfig client={client}>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</WagmiConfig>
			</ChakraProvider>
		</>
	);
}
