use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod tiny_adventure {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.game_data_account.position = 0;
        msg!("Game initialized! Current position: 0");
        Ok(())
    }

    pub fn move_left(ctx: Context<MoveLeft>) -> Result<()> {
        let game_data = &mut ctx.accounts.game_data_account;
        if game_data.position > 0 {
            game_data.position -= 1;
            msg!("Moved left! Position: {}", game_data.position);
        } else {
            msg!("Cannot move left! Position: {}", game_data.position);
        }
        Ok(())
    }

    pub fn move_right(ctx: Context<MoveRight>) -> Result<()> {
        let game_data = &mut ctx.accounts.game_data_account;
        if game_data.position < 3 {
            game_data.position += 1;
            msg!("Moved right! Position: {}", game_data.position);
        } else {
            msg!("Cannot move right! Position: {}", game_data.position);
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [b"level1"],
        bump,
        payer = user,
        space = 8 + 1
    )]
    pub game_data_account: Account<'info, GameDataAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MoveLeft<'info> {
    #[account(mut)]
    pub game_data_account: Account<'info, GameDataAccount>,
}

#[derive(Accounts)]
pub struct MoveRight<'info> {
    #[account(mut)]
    pub game_data_account: Account<'info, GameDataAccount>,
}

#[account]
pub struct GameDataAccount {
    pub position: u8,
}
