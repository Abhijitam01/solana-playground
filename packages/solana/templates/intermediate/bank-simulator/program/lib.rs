use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod bank_simulator {
    use super::*;

    pub fn open_account(ctx: Context<OpenAccount>, title: String) -> Result<()> {
        let bank_account = &mut ctx.accounts.bank_account;
        bank_account.owner = *ctx.accounts.user.key;
        bank_account.balance = 0;
        bank_account.title = title;
        msg!("Bank account opened: {}", bank_account.title);
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let bank_account = &mut ctx.accounts.bank_account;
        bank_account.balance += amount;
        msg!("Deposited: {}. New Balance: {}", amount, bank_account.balance);
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let bank_account = &mut ctx.accounts.bank_account;
        if bank_account.balance < amount {
            return err!(ErrorCode::InsufficientFunds);
        }
        bank_account.balance -= amount;
        msg!("Withdrew: {}. New Balance: {}", amount, bank_account.balance);
        Ok(())
    }

    pub fn transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
        let from_account = &mut ctx.accounts.from_account;
        let to_account = &mut ctx.accounts.to_account;

        if from_account.balance < amount {
            return err!(ErrorCode::InsufficientFunds);
        }

        from_account.balance -= amount;
        to_account.balance += amount;
        
        msg!("Transferred: {} from {} to {}", amount, from_account.title, to_account.title);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct OpenAccount<'info> {
    #[account(
        init,
        seeds = [b"bank", user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + 32 + 8 + (4 + 20)
    )]
    pub bank_account: Account<'info, BankAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(
        mut,
        seeds = [b"bank", user.key().as_ref()],
        bump,
    )]
    pub bank_account: Account<'info, BankAccount>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [b"bank", user.key().as_ref()],
        bump,
    )]
    pub bank_account: Account<'info, BankAccount>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut, has_one = owner)]
    pub from_account: Account<'info, BankAccount>,
    #[account(mut)]
    pub to_account: Account<'info, BankAccount>,
    pub owner: Signer<'info>,
}

#[account]
pub struct BankAccount {
    pub owner: Pubkey,
    pub balance: u64,
    pub title: String,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds.")]
    InsufficientFunds,
}
