import { Flex } from '@chakra-ui/react';
import Navbar from './navbar';
import Footer from './footer';

export default function Layout({ children }) {
	return (
		<>
			<Navbar />
			<Flex
				w={'100vw'}
				h={'80vh'}
				justifyContent={'space-between'}
				alignItems={'center'}
				py={'10vh'}
			>
				{children}
			</Flex>
			{/* <Footer /> */}
		</>
	);
}
