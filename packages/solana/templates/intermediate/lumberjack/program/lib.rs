use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod lumberjack {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let player = &mut ctx.accounts.player;
        player.wood = 0;
        player.energy = 10;
        player.last_login = Clock::get()?.unix_timestamp;
        msg!("Welcome Lumberjack! You have 10 energy.");
        Ok(())
    }

    pub fn chop_tree(ctx: Context<ChopTree>) -> Result<()> {
        let player = &mut ctx.accounts.player;
        let clock = Clock::get()?;
        
        // Regenerate energy if enough time passed (e.g., 1 energy per minute)
        let time_diff = clock.unix_timestamp - player.last_login;
        let energy_to_add = time_diff / 60;
        if energy_to_add > 0 {
            player.energy = (player.energy + energy_to_add as u64).min(10);
            player.last_login = clock.unix_timestamp;
        }

        if player.energy == 0 {
            return err!(ErrorCode::NotEnoughEnergy);
        }

        player.energy -= 1;
        player.wood += 1;
        msg!("Chopped a tree! Wood: {}, Energy: {}", player.wood, player.energy);
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
        space = 8 + 8 + 8 + 8
    )]
    pub player: Account<'info, PlayerData>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ChopTree<'info> {
    #[account(
        mut,
        seeds = [b"player", user.key().as_ref()],
        bump,
    )]
    pub player: Account<'info, PlayerData>,
    pub user: Signer<'info>,
}

#[account]
pub struct PlayerData {
    pub wood: u64,
    pub energy: u64,
    pub last_login: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Not enough energy to chop trees.")]
    NotEnoughEnergy,
}
