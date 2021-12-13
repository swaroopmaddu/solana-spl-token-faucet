import { Connection } from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';

export function GetProvider(wallet, network) {
    console.log(network);
    const opts = {
        preflightCommitment: 'processed',
    };
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
        connection, wallet, opts.preflightCommitment,
    );
    return [provider, connection];
}