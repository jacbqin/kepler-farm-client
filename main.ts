import { FarmClient, types } from "./sdk/sdk";
import * as bs58 from "bs58";
import { privateKey } from "./key.json";
import * as tokens from "./tokens.json";
import { Keypair, PublicKey, Transaction, sendAndConfirmTransaction, Connection } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { createTransferInstruction, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

let client = FarmClient.fromEndpoint("https://api.devnet.solana.com");
let user = Keypair.fromSecretKey(bs58.decode(privateKey));

async function main() {
    console.log("user", user.publicKey.toBase58());
    await createVault(kepl);
    await createVault(gkepl);
    await createVault(wif);
    await createTokenPool(wif);
    await withdrawToken(wif, 100000);
    await claimRewards(wif);
}

const kepl = new PublicKey(tokens.kepl);
const gkepl = new PublicKey(tokens.gkepl);
const wif = new PublicKey(tokens.wif);

const logTs = function (tag: string, ts: string) {
    console.log(tag, `https://explorer.solana.com/tx/${ts}?cluster=devnet`);
};

//Ceate vault
// Vault is used to store user depoisted tokens or reward tokens
// Only white user has permission to create token pool.
const createVault = async (mint: PublicKey) => {
    let vaultAccount = await client.queryVaultAccount(mint);
    if (!vaultAccount) {
        logTs("initialzie token vault: ", await client.createTokenVault(user, mint));
        let pda = client.findVaultAccountPDA(mint);
        logTs("deposit token vault", await transferTokenToTokenAccount(client.connection, user, pda, mint, 1e17));
    }
};

//Create token deposit pool
//Only white user has permission to create token pool.
const createTokenPool = async (depositMint: PublicKey) => {
    let startTime = Math.trunc(Date.now() / 1000);
    let endTime = Math.trunc(Date.now() / 1000 + 3600 * 24 * 720);
    let rewardConfigs = [new types.RewardConfig(kepl, startTime, endTime, new BN(300000e6)), new types.RewardConfig(gkepl, startTime, endTime, new BN(100000e6))];
    let lcokConfigs = [new types.LockConfig(1, 5), new types.LockConfig(4, 10), new types.LockConfig(12, 15), new types.LockConfig(24, 20), new types.LockConfig(52, 30)];

    if (!(await client.queryPoolAccount(depositMint))) {
        logTs("create wif pool:", await client.createTokenPool(user, depositMint, new types.PoolArg(1, startTime, endTime, rewardConfigs, lcokConfigs)));
    }
};

//depost token
const depositToken = async (mint: PublicKey, amount: number) => {
    logTs("deposit token", await client.depositToken(user, mint, new types.DepositionArg(new BN(amount), 1)));
    let account = await client.queryDepositionAccount(user.publicKey, mint);
    console.log("token deposition account", account);
};

//withdraw token
const withdrawToken = async (mint: PublicKey, amount: number) => {
    logTs("withdraw sol", await client.withdrawToken(user, mint, new types.DepositionArg(new BN(amount), 1)));
    let account = await client.queryDepositionAccount(user.publicKey, mint);
    console.log("token deposition account", JSON.stringify(account));
};

//claim rewards
const claimRewards = async (depositMint: PublicKey) => {
    logTs("claim", await client.claim(user, depositMint));
};

export async function transferTokenToTokenAccount(connection: Connection, user: Keypair, to: PublicKey, mint: PublicKey, amount: number) {
    const sourceAccount = getAssociatedTokenAddressSync(mint, user.publicKey);
    const tx = new Transaction().add(createTransferInstruction(sourceAccount, to, user.publicKey, amount));
    return await sendAndConfirmTransaction(connection, tx, [user], { skipPreflight: false });
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
