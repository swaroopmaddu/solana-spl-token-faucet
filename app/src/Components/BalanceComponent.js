
import { Box, Button, Typography } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect } from 'react';
import { GetProvider } from '../Utils/utils';
import { mktMintPk } from '../Utils/config';

const BalanceComponent = (props) => {
    const wallet = useWallet();
    const [solBalance, setSolBalance] = React.useState(null); 
    const [mktBalance, setMktBalance] = React.useState(null);
    const [provider, connection] = GetProvider(wallet, props.network);
    
    const networkMap = {
        'https://api.devnet.solana.com': 'DEVNET',
        'https://api.testnet.solana.com': 'TESTNET',
        'http://127.0.0.1:8899': 'LOCALNET'
    }

    async function checkBalance() {
        var sol = 0;
        try {
            sol = await connection.getBalance(provider.wallet.publicKey);
        } catch (err) {
            console.log(err);
            sol = 0;
        }
        setSolBalance(Math.round(((sol / 1000000000) * 100) / 100));
    }

    // Get monkey tokens balance
    async function getBalance(mintPda) {
        let balance = 0;
        try {
            const parsedTokenAccountsByOwner = await connection.getParsedTokenAccountsByOwner(provider.wallet.publicKey, { mint: mktMintPk });
            balance = 1.0 * parsedTokenAccountsByOwner.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        } catch (err) {
            console.log(err);
            balance = 0;
        }
        setMktBalance(balance);
    }

    useEffect(() => {
        checkBalance();
        getBalance(mktMintPk);
        console.log(props.refresh);
    }, [props.refresh]);

    return (
        <Box sx={{my:4}} display={'flex'} flexDirection={'column'}>
            {
                solBalance && 
                <Box sx={{ my: 4 }}>
                    <Typography sx={{ my: 2 }} variant="h6">Network: {networkMap[props.network]}</Typography>
                    <Typography variant="h6">Solana Balance: {solBalance} SOL</Typography>
                    <Typography variant="h6">Monkey Token Balance: {mktBalance} MKT</Typography>
                </Box>
            }
        </Box>
    );
};

export default BalanceComponent;