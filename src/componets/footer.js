import { Flex, Text } from '@chakra-ui/react';

const Footer = () => {
	return (
		<Flex
			bg={'gray.600'}
			as='footer'
			justify='center'
			// align={'center'}
			position='fixed'
			h='8vh'
			w={'100vw'}
			py='3vh'
		>
			<Text fontSize='lg' fontWeight='bold'>
				RecycleBox ©
			</Text>
		</Flex>
	);
};

export default Footer;
