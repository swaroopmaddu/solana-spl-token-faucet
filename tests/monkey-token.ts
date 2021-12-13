import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
const assert = require("assert");
const { SystemProgram } = anchor.web3;
const { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID, } = require("@solana/spl-token");
import { MonkeyToken } from "../target/types/monkey_token";

describe("monkey-token", () => {
  
  // This will always use the key on ~/.config/solana/id.json
  anchor.setProvider(anchor.Provider.env());

  // 
  const program = anchor.workspace.MonkeyToken as Program<MonkeyToken>;
  

  async function airdropTokens( amount, mintPda, mintPdaBump, associatedTokenAccount ) {
    let amountToAirdrop = new anchor.BN(amount * 1000000);

    await program.rpc.airdrop(mintPdaBump, amountToAirdrop, {
      accounts: {
        payer: program.provider.wallet.publicKey,
        mint: mintPda,
        destination: associatedTokenAccount,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      },
      signers: [],
    });
  }

  async function getBalance(mintPda) {
    const parsedTokenAccountsByOwner =
      await program.provider.connection.getParsedTokenAccountsByOwner(
        program.provider.wallet.publicKey,
        { mint: mintPda }
      );
    let balance =
      parsedTokenAccountsByOwner.value[0].account.data.parsed.info.tokenAmount
        .uiAmount;
    return balance;
  }

  it("Airdrop tokens 2 times and check token account", async () => {
    // Get the PDA that is the mint for the faucet
    const [mintPda, mintPdaBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(anchor.utils.bytes.utf8.encode("faucet-mint"))],
        program.programId
      );

    console.log("Program ID: ", program.programId.toBase58());
    console.log("mintPda: ", mintPda.toBase58());
    console.log("mintPdaBump: ", mintPdaBump);
    console.log(program.provider.wallet.publicKey.toBase58());


    let associatedTokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mintPda,
      program.provider.wallet.publicKey
    );


    //get balance
    let balance = await getBalance(mintPda);


    // FIRST AIRDROP
    const firstAirdropAmount = 100;
    await airdropTokens(
      firstAirdropAmount,
      mintPda,
      mintPdaBump,
      associatedTokenAccount
    );

    // Check that the balance is as expected
    let balancefA = await getBalance(mintPda);

    assert.ok(balance+firstAirdropAmount==balancefA);

    // SECOND AIRDROP
    const secondAirdropAmount = 200;
    await airdropTokens( secondAirdropAmount, mintPda, mintPdaBump, associatedTokenAccount );

    // Check that the balance is as expected
    let balancesA = await getBalance(mintPda);
    assert.ok(balancefA + secondAirdropAmount == balancesA);
  });
});
