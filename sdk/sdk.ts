import * as anchor from "@coral-xyz/anchor";
import { Program, BN, EventParser, BorshCoder, AnchorProvider } from "@coral-xyz/anchor";
import { Farm, IDL } from "../target/types/farm";
import { Keypair, PublicKey, Connection, SYSVAR_RENT_PUBKEY, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";
import * as spl from "@solana/spl-token";
import { Metaplex } from "@metaplex-foundation/js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

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

    export class CollectionConfig {
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
            public collectionConfigs: Array<CollectionConfig>
        ) {}
    }
    export class DepositionArg {
        constructor(
            public amount: BN,
            public lockWeeks: number
        ) {}
    }
    export class WithdrawArg {
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
    public metaplex: Metaplex;

    public static programId: string = "6zNoAggVx4C3H5rTS5ecfZQfkEtWwXch4qs7Zhz8vTYf";

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
        this.metaplex = Metaplex.make(this.connection);
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

    findMetadataPDA(mint: PublicKey) {
        return this.metaplex.nfts().pdas().metadata({ mint });
    }

    async queryMetadata(pda: PublicKey) {
        const accInfo = await this.connection.getAccountInfo(pda);
        return accInfo && Metadata.deserialize(accInfo.data, 0)[0];
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

    async calculatePendingReward(user: PublicKey, mint?: PublicKey) {
        const pool = await this.queryPoolAccount(mint);
        const deposition = await this.queryDepositionAccount(user, mint);
        const lastTime = deposition.lastCalculateTime;
        const fixedRewards = {};
        const flexibleRewards = {};
        for (let i of deposition.fixed.rewards) {
            fixedRewards[i.mint.toBase58()] = i.amount;
        }
        for (let i of deposition.flexible.rewards) {
            flexibleRewards[i.mint.toBase58()] = i.amount;
        }
        if (lastTime > 0) {
            const now = Math.trunc(Date.now() / 1000);
            for (let config of pool.rewardConfigs) {
                const mint = config.mint.toBase58();
                const oneWeek = new BN(3600 * 24 * 7);
                const weeklyRewards = config.weeklyRewards;
                const poolWeight = pool.weight;
                const from = Math.max(lastTime, config.startTime);
                const to = Math.min(now, config.endTime);
                if (to > from) {
                    fixedRewards[mint] = new BN(from - to)
                        .mul(weeklyRewards)
                        .mul(deposition.fixed.weight)
                        .div(oneWeek)
                        .div(poolWeight)
                        .add(fixedRewards[mint] || new BN(0));

                    flexibleRewards[mint] = new BN(from - to)
                        .mul(weeklyRewards)
                        .mul(deposition.flexible.weight)
                        .div(oneWeek)
                        .div(poolWeight)
                        .add(flexibleRewards[mint] || new BN(0));
                }
            }
        }
        return { fixedRewards, flexibleRewards };
    }

    async initializeFarm(signer: Keypair, preWithdrawFeeRate: number) {
        const method = this.program.methods.initializeFarm(preWithdrawFeeRate).accounts({
            signer: signer.publicKey,
            farmAccount: this.findFarmAccountPDA(),
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        return await this.executeTransaction(signer, await method.transaction());
    }

    async updateFarm(signer: Keypair, preWithdrawFeeRate: number) {
        const method = this.program.methods.updateFarm(preWithdrawFeeRate).accounts({
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

    async updateTokenPool(user: Keypair, mint: PublicKey, arg: types.PoolArg) {
        const method = this.program.methods.updateTokenPool(arg).accounts({
            signer: user.publicKey,
            farmAccount: this.findFarmAccountPDA(),
            poolAccount: this.findPoolAccountPDA(mint),
            tokenMint: mint,
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

    async updateSolPool(user: Keypair, arg: types.PoolArg) {
        const method = this.program.methods.updateSolPool(arg).accounts({
            signer: user.publicKey,
            farmAccount: this.findFarmAccountPDA(),
            poolAccount: this.findPoolAccountPDA(),
            systemProgram: SystemProgram.programId,
        });
        return this.executeTransaction(user, await method.transaction());
    }

    async depositToken(user: Keypair, mint: PublicKey, arg: types.DepositionArg) {
        const method = this.program.methods.depositToken(arg).accounts({
            signer: user.publicKey,
            tokenMint: mint,
            farmAccount: this.findFarmAccountPDA(),
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

    async stakeNFT(user: Keypair, depositTokenMint: PublicKey, nftMint: PublicKey) {
        let metdataPDA = this.findMetadataPDA(nftMint);
        const method = this.program.methods.stakeNft().accounts({
            signer: user.publicKey,
            depositTokenMint,
            nftMint,
            nftMetadataAccount: metdataPDA,
            vaultNftAccount: this.findVaultAccountPDA(nftMint),
            userNftAccount: await spl.getAssociatedTokenAddress(nftMint, user.publicKey),
            poolAccount: this.findPoolAccountPDA(depositTokenMint),
            depositionAccount: this.findDepositionAccountPDA(user.publicKey, depositTokenMint),
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        // return method.signers([user]).rpc();
        return this.executeTransaction(user, await method.transaction());
    }

    async withdrawNFT(user: Keypair, depositTokenMint: PublicKey, nftMint: PublicKey) {
        let metdataPDA = this.findMetadataPDA(nftMint);
        const method = this.program.methods.withdrawNft().accounts({
            signer: user.publicKey,
            depositTokenMint,
            nftMint,
            nftMetadataAccount: metdataPDA,
            vaultNftAccount: this.findVaultAccountPDA(nftMint),
            userNftAccount: await spl.getAssociatedTokenAddress(nftMint, user.publicKey),
            poolAccount: this.findPoolAccountPDA(depositTokenMint),
            depositionAccount: this.findDepositionAccountPDA(user.publicKey, depositTokenMint),
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        return method.signers([user]).rpc();
        // return this.executeTransaction(user, await method.transaction());
    }

    async depositSol(user: Keypair, arg: types.DepositionArg) {
        const method = this.program.methods.depositSol(arg).accounts({
            signer: user.publicKey,
            farmAccount: this.findFarmAccountPDA(),
            poolAccount: this.findPoolAccountPDA(),
            solVaultAccount: this.findVaultAccountPDA(),
            depositionAccount: this.findDepositionAccountPDA(user.publicKey),
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        // return method.signers([user]).rpc();
        return this.executeTransaction(user, await method.transaction());
    }

    async withdrawSol(user: Keypair, arg: types.WithdrawArg) {
        const method = this.program.methods.withdrawSol(arg).accounts({
            signer: user.publicKey,
            farmAccount: this.findFarmAccountPDA(),
            poolAccount: this.findPoolAccountPDA(),
            solVaultAccount: this.findVaultAccountPDA(),
            depositionAccount: this.findDepositionAccountPDA(user.publicKey),
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        return this.executeTransaction(user, await method.transaction());
    }

    async withdrawToken(signer: Keypair, mint: PublicKey, arg: types.WithdrawArg) {
        const method = this.program.methods.withdrawToken(arg).accounts({
            signer: signer.publicKey,
            farmAccount: this.findFarmAccountPDA(),
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

    private async executeTransaction(signer: Keypair, ...transactions: (Transaction | TransactionInstruction)[]) {
        let tx = new Transaction();
        for (let i of transactions) {
            tx.add(i);
        }
        return await anchor.web3.sendAndConfirmTransaction(this.connection, tx, [signer], { skipPreflight: true });
    }
}
