import { GetProvider } from './utils';
import { BN, Program, web3 } from '@project-serum/anchor';
import idl from '../Utils/monkey_token.json';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
const { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const { SystemProgram } = web3;

// Faucet for solana airdrop
export async function airdrop(wallet, network) {
    const [provider, connection] = GetProvider(wallet, network);
    try {
        const txId = await connection.requestAirdrop(provider.wallet.publicKey, LAMPORTS_PER_SOL);
        return txId;
    } catch (e) {
        throw e;
    }
}

// Airdrop monkey tokens 
export async function airdropSplTokens(amount, mintPda, mintPdaBump, wallet, network, programID) {
    let signature = '';
    try {
        const [provider, connection] = GetProvider(wallet, network);

        console.log("mintPda: ", mintPda);
        console.log("mintPdaBump: ", mintPdaBump);
        console.log("programId: ", programID);
        
        const program = new Program(idl, programID, provider);
        console.log("Program ID: ", program.programId.toBase58());
        let amountToAirdrop = new BN(amount * 1000000);

        console.log(`Airdrop ${amountToAirdrop} tokens to ${provider.wallet.publicKey}`);
        alert('Airdrop '+amountToAirdrop +' tokens to '+provider.wallet.publicKey);
        
        let associatedTokenAccount = await Token.getAssociatedTokenAddress( ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mintPda, provider.wallet.publicKey, );


        signature = await program.rpc.airdrop( mintPdaBump, amountToAirdrop, {
                accounts: {
                    payer: provider.wallet.publicKey,
                    mint: mintPda,
                    destination: associatedTokenAccount,
                    rent: web3.SYSVAR_RENT_PUBKEY,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
                },
                signers: [],
            }
        );
        await connection.confirmTransaction(signature, 'processed');
            console.log('success Airdrop successful!'+signature);
        } catch (err) {
            console.log('Error Airdrop failed!');
            console.log(err);
            throw err;
        }
}

