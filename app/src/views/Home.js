import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Card, Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { airdrop, airdropSplTokens} from '../Utils/airdrop';
import { useSnackbar } from 'notistack';
import { GetProvider } from '../Utils/utils';
import BalanceComponent from '../Components/BalanceComponent';
import { mktMintPk, mktMintPkBump } from '../Utils/config';

const Home = () => {

        // wallet
        const wallet = useWallet();

        const theme = createTheme();
        const { enqueueSnackbar } = useSnackbar();

        useEffect(() => {
            console.log(wallet.connected);
        }, [wallet]);

        const [network, setNetwork] = useState('https://api.devnet.solana.com');
        const [refresh, setRefresh] = useState(true);

        const handleChange = (event) => {
            setNetwork(event.target.value);
            setRefresh(Math.random());
        };
        const [provider, connection] = GetProvider(wallet, network);
        const publicKey = provider.wallet.publicKey;
        

        async function onClick(event) {
            
            try{
                const result = await airdrop(wallet, network);
                setRefresh(!refresh);
                enqueueSnackbar("Airdrop successful.", { variant: 'success', autoHideDuration: 3000, });
            }catch(e){
                enqueueSnackbar("Airdrop Failed : " + e.message, { variant: 'error', autoHideDuration: 3000 });
   
            }
        }

        async function dropMonkey(event) {
            try {
                const result = await airdropSplTokens(1000, mktMintPk, mktMintPkBump ,wallet, network);
                setRefresh(!refresh);
                enqueueSnackbar("Airdrop successful.", { variant: 'success', autoHideDuration: 3000, });
            } catch (e) {
                enqueueSnackbar("Airdrop Failed : " + e.message, { variant: 'error', autoHideDuration: 3000 });

            } 

        }

        return(
                <ThemeProvider theme={theme}>
                    <Grid container  sx={{ height: "100vh" }}>
                        <Grid item xs={false} my={10} sm={4} md={10} component={Paper} sx={{ backgroundSize: "cover", backgroundPosition: "center", }} >
                            <Box sx={{ my: 8, mx: 4, display: "flex", flexDirection: "column", alignItems: "center", }} >
                                <Typography variant="h4" component="h1" sx={{ fontWeight: "fontWeightBold", color:"#3f51b5;" }}>
                                Solana airdrop Faucet and Monkey Token
                                </Typography>
                                <Card sx={{ minWidth: 700,minHeight:500,border:1,borderColor:'#3f51b5', marginTop:5,padding:4 }}>
                                        <Typography sx={{ fontSize: 18,fontWeight:800,color:'black' }} color="text.secondary" gutterBottom>
                                            NETWORK SELECTION
                                        </Typography>
                                        <Select fullWidth label="Select Network" name="network" id="network" value={network} onChange={handleChange}>
                                            <MenuItem value={'https://api.devnet.solana.com'}> <em>DEVNET</em> </MenuItem>
                                            <MenuItem value={'http://127.0.0.1:8899'}> <em>LOCALNET</em> </MenuItem>
                                            <MenuItem value={'https://api.testnet.solana.com'}> <em>TESTNET</em> </MenuItem>
                                        </Select>
                                <br/>
                                    <Typography sx={{marginTop:2,fontSize: 18,fontWeight:800,color:'black' }} gutterBottom>
                                        SOL AIRDROP
                                    </Typography>
                                    <Typography sx={{fontSize: 13,}} color="text.secondary" gutterBottom>
                                        Receive 1 SOL 
                                    </Typography>
                                    <Button fullWidth variant="outlined" onClick={onClick} disabled={!publicKey} >GET 1 SOL</Button>
                                    <Typography sx={{marginTop:2,fontSize: 18,fontWeight:800,color:'black' }} color="text.secondary" gutterBottom>
                                        Monkey Tocken AIRDROP
                                        </Typography>
                                        <Typography sx={{fontSize: 13,}} color="text.secondary" gutterBottom>
                                        Receive dummy SPL tokens, always coming from the same mint.                          
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={8}>
                                            <TextField fullWidth type="number" id="outlined-basic"  variant="outlined"  />
                                            </Grid>
                                            <Grid item xs={4}>
                                            <Button fullWidth size="large" onClick={dropMonkey} variant="outlined" disabled={!publicKey}>GET DUMMY</Button>
                                            </Grid>
                                        </Grid>
                                </Card>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={2} component={Paper} elevation={6} square>
                            <Box sx={{ my: 8, mx: 4, display: "flex", flexDirection: "column", alignItems: "center", }} >
                                <WalletModalProvider>
                                    <WalletMultiButton />
                                </WalletModalProvider>
                            </Box>
                                <Box sx={{ my: 8, mx: 4, alignItems: "center" }} >
                                {wallet.connected && <BalanceComponent network={network} refresh={refresh} />}
                            </Box>
                        </Grid>
                    </Grid>
                </ThemeProvider>
                );
        }

export default Home;
