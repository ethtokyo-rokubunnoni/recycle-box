import { Button, Stack } from '@chakra-ui/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function Profile() {
	const { address, connector, isConnected } = useAccount();
	// const { data: ensAvatar } = useEnsAvatar({ address });
	const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
	const { disconnect } = useDisconnect();

	if (isConnected) {
		return (
			<>
				<div>
					<div>{address}</div>
					<div>Connected to {connector.name}</div>
					<Button onClick={disconnect}>Disconnect</Button>
				</div>
			</>
		);
	}

	return (
		<div>
			<Stack>
				{connectors.map((connector) => (
					<Button
						disabled={!connector.ready}
						key={connector.id}
						onClick={() => connect({ connector })}
					>
						{connector.name}
						{isLoading && connector.id === pendingConnector?.id && ' (connecting)'}
					</Button>
				))}
			</Stack>

			{error && <div>{error.message}</div>}
		</div>
	);
}
