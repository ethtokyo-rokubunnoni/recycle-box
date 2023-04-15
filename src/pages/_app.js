import Layout from '@/componets/layout';
import { ChakraProvider } from '@chakra-ui/react';
import { polygon, polygonMumbai, goerli } from 'wagmi/chains';

import { WagmiConfig, createClient, configureChains } from 'wagmi';
// import { getDefaultProvider } from 'ethers';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
// import { InjectedConnector } from 'wagmi/connectors/injected';

const { chains, provider, webSocketProvider } = configureChains(
	[polygonMumbai],
	[alchemyProvider({ apiKey: '', priority: 1 }), publicProvider({ priority: 0 })]
);

const client = createClient({
	autoConnect: false,
	connectors: [new MetaMaskConnector({ chains })],
	// connectors: [new InjectedConnector({ chains })],
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
