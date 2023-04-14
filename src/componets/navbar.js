import { Flex, Spacer, Button, Image, Box } from '@chakra-ui/react';

import Link from 'next/link';
import { Profile } from '@/componets/profile';

const Navbar = () => {
	return (
		<Flex as='nav' align='center' justify='space-between' padding='1rem'>
			<Link href='/'>
				<Image src='/assets/logo.png' alt='Logo' boxSize='40px' />
			</Link>
			<Spacer />
			{/*<Link href="/">
        <Button variant="ghost">Home</Button>
      </Link>
      <Link href="/about">
        <Button variant="ghost">About</Button>
      </Link>
      <Link href="/contact">
        <Button variant="ghost">Contact</Button>
      </Link>*/}
			<Profile />
		</Flex>
	);
};

export default Navbar;
