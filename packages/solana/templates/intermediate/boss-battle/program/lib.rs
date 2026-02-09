use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod boss_battle {
    use super::*;

    pub fn spawn_boss(ctx: Context<SpawnBoss>) -> Result<()> {
        let boss = &mut ctx.accounts.boss;
        if boss.health > 0 {
             return err!(ErrorCode::BossAlreadyExists);
        }
        boss.health = 1000;
        boss.total_damage_taken = 0;
        msg!("A generic Boss has appeared with 1000 HP!");
        Ok(())
    }

    pub fn attack_boss(ctx: Context<AttackBoss>) -> Result<()> {
        let boss = &mut ctx.accounts.boss;
        let player = &mut ctx.accounts.player_stats;

        if boss.health == 0 {
            return err!(ErrorCode::BossDefeated);
        }

        // Pseudo-damage logic, maybe random or fixed
        let damage = 10;
        
        if boss.health < damage {
            boss.health = 0;
            msg!("You dealt the killing blow!");
        } else {
            boss.health -= damage;
            msg!("You dealt {} damage! Boss HP: {}", damage, boss.health);
        }

        boss.total_damage_taken += damage;
        player.total_damage_dealt += damage;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SpawnBoss<'info> {
    #[account(
        init_if_needed,
        seeds = [b"boss"],
        bump,
        payer = user,
        space = 8 + 8 + 8
    )]
    pub boss: Account<'info, Boss>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AttackBoss<'info> {
    #[account(
        mut,
        seeds = [b"boss"],
        bump,
    )]
    pub boss: Account<'info, Boss>,
    #[account(
        init_if_needed,
        seeds = [b"player", user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + 8
    )]
    pub player_stats: Account<'info, PlayerStats>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Boss {
    pub health: u64,
    pub total_damage_taken: u64,
}

#[account]
pub struct PlayerStats {
    pub total_damage_dealt: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Boss is already alive.")]
    BossAlreadyExists,
    #[msg("Boss is already defeated.")]
    BossDefeated,
}
