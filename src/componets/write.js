import { Button } from '@chakra-ui/react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

export const Write = ({ tx }) => {
	console.log(tx);
	const { config } = usePrepareContractWrite({
		address: tx.address,
		abi: tx.abi,
		functionName: tx.method,
		args: tx.args,
	});
	const { status, data, isLoading, isSuccess, write } = useContractWrite(config);

	return (
		<div>
			<Button onClick={() => write?.()}>{tx.method}</Button>
			{isLoading && <div>Check Wallet</div>}
			{isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
		</div>
	);
};
