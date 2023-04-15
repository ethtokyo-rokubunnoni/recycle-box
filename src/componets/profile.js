import { Button, Stack, Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';

function truncateAddress(address, startLength = 6, endLength = 4) {
	return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

export function Profile() {
	const { address, connector, isConnected } = useAccount();
	// const { data: ensName } = useEnsName({ address });
	const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
	const { disconnect } = useDisconnect();

	const buttonText = isConnected
		? // ensName
		  // 	? `${truncateAddress(ensName)} (${truncateAddress(address)})`
		  // 	:
		  truncateAddress(address)
		: 'Wallet Connect';

	const handleConnectClick = () => {
		if (!isConnected) {
			connect({ connector: connectors[0] }); // Assuming MetaMask is the first connector in the list
		}
	};

	if (isConnected) {
		return (
			<div>
				<Stack>
					<Menu>
						<MenuButton as={Button} bg={'blue.400'} color={'white'} _hover={{ bg: 'blue.500' }}>
							{buttonText}
						</MenuButton>
						<MenuList>
							<MenuItem onClick={disconnect}>Disconnect</MenuItem>
						</MenuList>
					</Menu>
				</Stack>
				{error && <div>{error.message}</div>}
			</div>
		);
	} else {
		return (
			<div>
				<Stack>
					<Button
						bg={'blue.400'}
						color={'white'}
						_hover={{ bg: 'blue.500' }}
						onClick={handleConnectClick}
					>
						{buttonText}
					</Button>
				</Stack>
				{error && <div>{error.message}</div>}
			</div>
		);
	}
}
