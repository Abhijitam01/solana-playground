use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod zero_copy_accounts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let heavy_account = &mut ctx.accounts.heavy_account.load_init()?;
        heavy_account.data[0] = 1;
        heavy_account.counter = 0;
        msg!("Zero Copy Account Initialized!");
        Ok(())
    }

    pub fn update_large_data(ctx: Context<UpdateData>, index: u32, value: u64) -> Result<()> {
        let heavy_account = &mut ctx.accounts.heavy_account.load_mut()?;
        if index as usize >= heavy_account.data.len() {
             return err!(ErrorCode::IndexOutOfBounds);
        }
        heavy_account.data[index as usize] = value;
        heavy_account.counter += 1;
        msg!("Updated data at index {} with value {}", index, value);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [b"heavy"],
        bump,
        payer = user,
        space = 8 + std::mem::size_of::<HeavyAccount>()
    )]
    pub heavy_account: AccountLoader<'info, HeavyAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateData<'info> {
    #[account(
        mut,
        seeds = [b"heavy"],
        bump,
    )]
    pub heavy_account: AccountLoader<'info, HeavyAccount>,
    pub user: Signer<'info>,
}

#[account(zero_copy)]
#[repr(C)]
pub struct HeavyAccount {
    pub counter: u64,
    pub data: [u64; 1000], // Large array
}

#[error_code]
pub enum ErrorCode {
    #[msg("Index out of bounds.")]
    IndexOutOfBounds,
}
