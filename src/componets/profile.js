import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Button, Text } from '@chakra-ui/react';

export function Profile() {
	const { address, isConnected } = useAccount();
	const { connect } = useConnect({
		connector: new InjectedConnector(),
	});
	const { disconnect } = useDisconnect();

	if (isConnected)
		return (
			<>
				<Text>Connected to {address}</Text>
				<Button onClick={() => disconnect()}>Disconnect</Button>
			</>
		);
	return (
		<>
			<Button onClick={() => connect()}>Connect Wallet</Button>;
		</>
	);
}
