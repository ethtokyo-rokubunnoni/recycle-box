import { Flex } from '@chakra-ui/react';

export default function Layout({ children }) {
	return (
		<>
			{/* <Navbar /> */}
			<Flex w={'100vw'} px={'10vw'} py={'10vh'} justify={'center'}>
				{children}
			</Flex>
			{/* <Footer /> */}
		</>
	);
}
