use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod battle_coins {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let player = &mut ctx.accounts.player;
        player.coins = 100; // Start with 100 coins
        msg!("Welcome to Battle Coins! You start with 100 coins.");
        Ok(())
    }

    pub fn battle(ctx: Context<Battle>, bet_amount: u64) -> Result<()> {
        let player = &mut ctx.accounts.player;

        if player.coins < bet_amount {
            return err!(ErrorCode::NotEnoughCoins);
        }

        // Simple pseudo-randomness using clock slot
        let clock = Clock::get()?;
        let is_won = clock.slot % 2 == 0; // 50/50 chance

        if is_won {
            player.coins += bet_amount;
            msg!("You won! Coins: {}", player.coins);
        } else {
            player.coins -= bet_amount;
            msg!("You lost! Coins: {}", player.coins);
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [b"player", user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + 8
    )]
    pub player: Account<'info, PlayerStats>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Battle<'info> {
    #[account(
        mut,
        seeds = [b"player", user.key().as_ref()],
        bump,
    )]
    pub player: Account<'info, PlayerStats>,
    pub user: Signer<'info>,
}

#[account]
pub struct PlayerStats {
    pub coins: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Not enough coins to place bet.")]
    NotEnoughCoins,
}
