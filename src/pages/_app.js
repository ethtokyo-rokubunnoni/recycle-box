import Layout from '@/componets/layout';
import { ChakraProvider } from '@chakra-ui/react';

import { WagmiConfig, createClient } from 'wagmi';
import { getDefaultProvider } from 'ethers';

const client = createClient({
	autoConnect: true,
	provider: getDefaultProvider(),
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
