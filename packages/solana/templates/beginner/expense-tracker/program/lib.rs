use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod expense_tracker {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let tracker = &mut ctx.accounts.tracker;
        tracker.owner = *ctx.accounts.user.key;
        tracker.expenses = Vec::new();
        msg!("Expense Tracker Initialized!");
        Ok(())
    }

    pub fn add_expense(ctx: Context<AddExpense>, id: u64, amount: u64, description: String) -> Result<()> {
        let tracker = &mut ctx.accounts.tracker;
        let expense = Expense {
            id,
            amount,
            description,
        };
        tracker.expenses.push(expense);
        msg!("Expense added: {} - Amount: {}", id, amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [b"tracker", user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + 32 + (4 + 50 * (8 + 8 + 4 + 20))
    )]
    pub tracker: Account<'info, ExpenseTracker>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddExpense<'info> {
    #[account(
        mut,
        seeds = [b"tracker", user.key().as_ref()],
        bump,
    )]
    pub tracker: Account<'info, ExpenseTracker>,
    pub user: Signer<'info>,
}

#[account]
pub struct ExpenseTracker {
    pub owner: Pubkey,
    pub expenses: Vec<Expense>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Expense {
    pub id: u64,
    pub amount: u64,
    pub description: String,
}
