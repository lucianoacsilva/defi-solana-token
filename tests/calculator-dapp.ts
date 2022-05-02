import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CalculatorDapp } from "../target/types/calculator_dapp";
import assert from "assert";

const {
  SystemProgram
} = anchor.web3;


describe("calculator-dapp", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const calculator = anchor.web3.Keypair.generate();

  const program = anchor.workspace.CalculatorDapp as Program<CalculatorDapp>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.create("Welcome to Solana Calculator!", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [calculator]
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);

    assert.ok(account.greeting === "Welcome to Solana Calculator!");
    console.log("Your transaction signature", tx);
  });

  it('Add two numbers', async () => {
    const tx = await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);

    assert.ok(account.result.eq(new anchor.BN(5)));

  });

  it('Subtract two numbers', async () => {
    const tx = await program.rpc.subtract(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);

    assert.ok(account.result.eq(new anchor.BN(-1)));

  });

  it('Multiply two numbers', async () => {
    const tx = await program.rpc.multiply(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);

    assert.ok(account.result.eq(new anchor.BN(6)));
  });

  it('Divide two numbers', async () => {
    const tx = await program.rpc.divide(new anchor.BN(5), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);

    assert.ok(account.result.eq(new anchor.BN(2)));
    assert.ok(account.remainder.eq(new anchor.BN(1)));
  });

  it('Divide two numbers (first is less than second)', async () => {
    const tx = await program.rpc.divide(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);

    assert.ok(account.result.eq(new anchor.BN(0)));
    assert.ok(account.remainder.eq(new anchor.BN(2)));
  });

  it('Divide two numbers (second is zero)', async () => {
    const tx = await program.rpc.divide(new anchor.BN(2), new anchor.BN(0), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
  });
});
