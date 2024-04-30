import * as anchor from "@coral-xyz/anchor";
import { Program, BN, EventParser, BorshCoder, AnchorProvider, Provider } from "@coral-xyz/anchor";
import { Farm, IDL } from "../target/types/farm";
import { Keypair, PublicKey, Connection, SYSVAR_RENT_PUBKEY, SystemProgram, Transaction } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";
import * as spl from "@solana/spl-token";

export namespace types {
    export class RewardConfig {
        constructor(
            public mint: PublicKey,
            public startTime: number,
            public endTime: number,
            public weeklyRewards: BN
        ) {}
    }

    export class LockConfig {
        constructor(
            public lockWeeks: number, // max length 255
            public multiplier: number //100 based
        ) {}
    }

    export class NftConfig {
        constructor(
            public mint: PublicKey,
            public multiplier: number //100 based
        ) {}
    }

    export class PoolArg {
        constructor(
            public poolType: number,
            public startTime: number,
            public endTime: number,
            public rewardConfigs: Array<RewardConfig>,
            public lockConfigs: Array<LockConfig>,
            public nftConfigs: Array<NftConfig> = []
        ) {}
    }
    export class DepositionArg {
        constructor(
            public amount: BN,
            public lockWeeks: number
        ) {}
    }
}

export class FarmClient {
    public connection: Connection;
    public program: Program<Farm>;
    public eventParser: EventParser;
    public endpoint: string;

    public static programId: string = "78p3Yb9qwYRCDnYr4wAEHrtaP6hFDBUcoxEv7ZMJYa75";

    public static fromEndpoint(endpoint: string) {
        const provider = new AnchorProvider(new Connection(endpoint), null, AnchorProvider.defaultOptions());
        const program = new Program(IDL, new PublicKey(FarmClient.programId), provider);
        return new FarmClient(program);
    }

    constructor(program: Program<Farm>) {
        this.connection = program["_provider"].connection;
        this.program = program;
        this.eventParser = new EventParser(this.program.programId, new BorshCoder(this.program.idl));
        this.endpoint = this.connection["_rpcEndpoint"];
    }

    findPDA(seeds: (Buffer | Uint8Array)[]) {
        return PublicKey.findProgramAddressSync(seeds, this.program.programId)[0];
    }

    findPoolAccountPDA(mint?: PublicKey) {
        if (mint) return this.findPDA([Buffer.from("Pool"), mint.toBuffer()]);
        return this.findPDA([Buffer.from("Pool")]);
    }

    async queryPoolAccount(mint?: PublicKey) {
        const pda = this.findPoolAccountPDA(mint);
        return await this.program.account.poolAccount.fetchNullable(pda);
    }

    findFarmAccountPDA() {
        return this.findPDA([Buffer.from("Farm")]);
    }

    async queryFarmAccount() {
        return await this.program.account.farmAccount.fetchNullable(this.findFarmAccountPDA());
    }

    findVaultAccountPDA(mint?: PublicKey) {
        if (mint) return this.findPDA([Buffer.from("Vault"), mint.toBuffer()]);
        return this.findPDA([Buffer.from("Vault")]);
    }

    async queryVaultAccount(mint?: PublicKey) {
        const pda = this.findVaultAccountPDA(mint);
        if (mint) {
            try {
                return await spl.getAccount(this.connection, pda);
            } catch (e) {
                return null;
            }
        }
        return await this.connection.getBalanceAndContext(pda);
    }

    async queryAllPools() {
        let farm = await this.queryFarmAccount();
        let items = [];
        for (let pool of farm.pools) {
            items.push(await this.queryPoolAccount(pool.equals(PublicKey.default) ? null : pool));
        }
        return items;
    }

    findDepositionAccountPDA(user: PublicKey, mint?: PublicKey) {
        if (mint) return this.findPDA([Buffer.from("Deposition"), mint.toBuffer(), user.toBuffer()]);
        return this.findPDA([Buffer.from("Deposition"), user.toBuffer()]);
    }

    async queryDepositionAccount(user: PublicKey, mint?: PublicKey) {
        const pda = this.findDepositionAccountPDA(user, mint);
        return await this.program.account.depositionAccount.fetchNullable(pda);
    }

    async initializeFarm(signer: Keypair, operator: PublicKey) {
        const method = this.program.methods.initializeFarm(operator).accounts({
            signer: signer.publicKey,
            farmAccount: this.findFarmAccountPDA(),
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        return await this.executeTransaction(signer, await method.transaction());
    }

    async addOperator(signer: Keypair, operator: PublicKey) {
        const method = this.program.methods.addOperator(operator).accounts({
            signer: signer.publicKey,
            farmAccount: this.findFarmAccountPDA(),
            systemProgram: SystemProgram.programId,
        });
        return await this.executeTransaction(signer, await method.transaction());
    }

    async removeOperator(admin: Keypair, operator: PublicKey) {
        const method = this.program.methods.removeOperator(operator).accounts({
            signer: admin.publicKey,
            farmAccount: this.findFarmAccountPDA(),
            systemProgram: SystemProgram.programId,
        });
        return await this.executeTransaction(admin, await method.transaction());
    }

    async createTokenVault(signer: Keypair, mint: PublicKey) {
        const method = this.program.methods.createTokenVault().accounts({
            signer: signer.publicKey,
            farmAccount: this.findFarmAccountPDA(),
            vaultAccount: this.findVaultAccountPDA(mint),
            tokenMint: mint,
            rent: SYSVAR_RENT_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        });
        return this.executeTransaction(signer, await method.transaction());
    }

    async emergencyWithdrawToken(signer: Keypair, mint: PublicKey, to: PublicKey, amount: BN) {
        const method = this.program.methods.emergencyWithdrawToken(amount).accounts({
            signer: signer.publicKey,
            farmAccount: this.findFarmAccountPDA(),
            tokenMint: mint,
            vaultTokenAccount: this.findVaultAccountPDA(mint),
            userTokenAccount: spl.getAssociatedTokenAddressSync(mint, to),
            recipientAccount: to,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
        });
        return this.executeTransaction(signer, await method.transaction());
    }

    async emergencyWithdrawSol(user: Keypair, to: PublicKey, amount: BN) {
        const method = this.program.methods.emergencyWithdrawSol(amount).accounts({
            signer: user.publicKey,
            solVaultAccount: this.findVaultAccountPDA(),
            farmAccount: this.findFarmAccountPDA(),
            recipientAccount: to,
            systemProgram: SystemProgram.programId,
        });
        const t = new anchor.web3.Transaction().add(await method.transaction());
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [user], { skipPreflight: true });
    }

    async createTokenPool(user: Keypair, mint: PublicKey, arg: types.PoolArg) {
        const method = this.program.methods.createTokenPool(arg).accounts({
            signer: user.publicKey,
            farmAccount: this.findFarmAccountPDA(),
            poolAccount: this.findPoolAccountPDA(mint),
            tokenMint: mint,
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        return this.executeTransaction(user, await method.transaction());
    }

    async createSolPool(user: Keypair, arg: types.PoolArg) {
        const method = this.program.methods.createSolPool(arg).accounts({
            signer: user.publicKey,
            farmAccount: this.findFarmAccountPDA(),
            poolAccount: this.findPoolAccountPDA(),
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        return this.executeTransaction(user, await method.transaction());
    }

    async depositToken(user: Keypair, mint: PublicKey, arg: types.DepositionArg) {
        const method = this.program.methods.depositToken(arg).accounts({
            signer: user.publicKey,
            tokenMint: mint,
            poolAccount: this.findPoolAccountPDA(mint),
            vaultTokenAccount: this.findVaultAccountPDA(mint),
            depositionAccount: this.findDepositionAccountPDA(user.publicKey, mint),
            userTokenAccount: await spl.getAssociatedTokenAddress(mint, user.publicKey),
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        return this.executeTransaction(user, await method.transaction());
    }

    async depositSol(user: Keypair, arg: types.DepositionArg) {
        const method = this.program.methods.depositSol(arg).accounts({
            signer: user.publicKey,
            poolAccount: this.findPoolAccountPDA(),
            solVaultAccount: this.findVaultAccountPDA(),
            depositionAccount: this.findDepositionAccountPDA(user.publicKey),
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        // return method.signers([user]).rpc();
        return this.executeTransaction(user, await method.transaction());
    }

    async withdrawSol(user: Keypair, arg: types.DepositionArg) {
        const method = this.program.methods.withdrawSol(arg).accounts({
            signer: user.publicKey,
            poolAccount: this.findPoolAccountPDA(),
            solVaultAccount: this.findVaultAccountPDA(),
            depositionAccount: this.findDepositionAccountPDA(user.publicKey),
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        return this.executeTransaction(user, await method.transaction());
    }

    async withdrawToken(signer: Keypair, mint: PublicKey, arg: types.DepositionArg) {
        const method = this.program.methods.withdrawToken(arg).accounts({
            signer: signer.publicKey,
            tokenMint: mint,
            poolAccount: this.findPoolAccountPDA(mint),
            vaultTokenAccount: this.findVaultAccountPDA(mint),
            depositionAccount: this.findDepositionAccountPDA(signer.publicKey, mint),
            userTokenAccount: await spl.getAssociatedTokenAddress(mint, signer.publicKey),
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        // return method.signers([user]).rpc();
        return this.executeTransaction(signer, await method.transaction());
    }

    refreshRewardsMethod(signer: Keypair, depositMint: PublicKey) {
        return this.program.methods.refreshRewards().accounts({
            signer: signer.publicKey,
            tokenMint: depositMint,
            poolAccount: this.findPoolAccountPDA(depositMint),
            depositionAccount: this.findDepositionAccountPDA(signer.publicKey, depositMint),
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
        });
    }

    async claim(signer: Keypair, depositMint: PublicKey) {
        let tx = new Transaction().add(await this.refreshRewardsMethod(signer, depositMint).transaction());
        let pool = await this.queryPoolAccount(depositMint);
        for (let c of pool.rewardConfigs) {
            let rewardMint = c.mint;
            let method = this.program.methods.claim().accounts({
                signer: signer.publicKey,
                depositTokenMint: depositMint,
                poolAccount: this.findPoolAccountPDA(depositMint),
                depositionAccount: this.findDepositionAccountPDA(signer.publicKey, depositMint),
                rewardMint: rewardMint,
                vaultTokenAccount: this.findVaultAccountPDA(rewardMint),
                userRewardTokenAccount: getAssociatedTokenAddressSync(rewardMint, signer.publicKey),
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            });
            tx.add(await method.transaction());
        }
        return this.executeTransaction(signer, tx);
    }

    async executeTransaction(user: Keypair, transaction: anchor.web3.Transaction) {
        const t = new anchor.web3.Transaction().add(transaction);
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [user], { skipPreflight: true });
    }
}
