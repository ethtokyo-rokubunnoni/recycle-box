import { Flex, Spacer, Button, Image } from '@chakra-ui/react';

import Link from 'next/link';
import { Profile } from '@/componets/profile';

const Navbar = () => {
	return (
		<Flex as='nav' align='center' justify='space-between' padding='1.8rem'>
			<Link href='/'>
				<Image src='/assets/logo.png' alt='Logo' boxSize='60px' />
			</Link>
			<Spacer />
	      	<Link href="/docs">
        		<Button variant="ghost" minW="100px">Docs</Button>
      		</Link>
			<Profile />
		</Flex>
	);
};

export default Navbar;
