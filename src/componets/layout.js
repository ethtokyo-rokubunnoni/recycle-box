import { Flex } from '@chakra-ui/react';
import Navbar from './navbar';
import Footer from './footer';

export default function Layout({ children }) {
	return (
		<>
			{ <Navbar /> }
			<Flex w={'100vw'} px={'10vw'} py={'10vh'} justifyContent={'space-between'} alignItems={'center'}>
				{children}
			</Flex>
			{ <Footer /> }
		</>
	);
}
