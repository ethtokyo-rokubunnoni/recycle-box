import Head from 'next/head';
import { TitleBar, UserInfo, Flex, Box, Grid, Stack, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { Profile } from '@/componets/profile';

export default function Home() {
	return (
		<>			
			<Head>
				<title>Recycle</title>
				<meta name='description' content='Generated by create next app' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Flex
				align={'center'}
				justify={'center'}
				bg={useColorModeValue('gray.50', 'gray.800')}
				h='100vh'
				w='100vw'
			>
				<Box textAlign="center" maxW='xl' mt='10%' >
					<Grid h="160vh">
						<Stack spacing={8}  w={['90vh', 450, 550]} py={12} px={6} align={'center'}>
							<Stack pt={50} align={'center'}>
								<Heading fontSize={'4xl'}>Clean out your wallet!</Heading>
								<Text
									fontSize={'lg'}
									color={useColorModeValue('gray.500', 'gray.600')}
								>
								</Text>
							</Stack>
						</Stack>
					</Grid>
				</Box>
			</Flex>
		</>
	);
}
