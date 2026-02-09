use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod todo_app {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let list = &mut ctx.accounts.list;
        list.owner = *ctx.accounts.user.key;
        list.todos = Vec::new();
        msg!("Todo List Initialized!");
        Ok(())
    }

    pub fn add_todo(ctx: Context<AddTodo>, content: String) -> Result<()> {
        let list = &mut ctx.accounts.list;
        let todo = TodoItem {
            content,
            completed: false,
        };
        list.todos.push(todo);
        msg!("Todo added: {}", list.todos.last().unwrap().content);
        Ok(())
    }

    pub fn mark_completed(ctx: Context<MarkCompleted>, index: u32) -> Result<()> {
        let list = &mut ctx.accounts.list;
        if let Some(todo) = list.todos.get_mut(index as usize) {
            todo.completed = true;
            msg!("Todo at index {} marked as completed.", index);
        } else {
            msg!("Todo not found at index {}", index);
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [b"todo", user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + 32 + (4 + 20 * (4 + 50 + 1))
    )]
    pub list: Account<'info, TodoList>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddTodo<'info> {
    #[account(
        mut,
        seeds = [b"todo", user.key().as_ref()],
        bump,
    )]
    pub list: Account<'info, TodoList>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct MarkCompleted<'info> {
    #[account(
        mut,
        seeds = [b"todo", user.key().as_ref()],
        bump,
    )]
    pub list: Account<'info, TodoList>,
    pub user: Signer<'info>,
}

#[account]
pub struct TodoList {
    pub owner: Pubkey,
    pub todos: Vec<TodoItem>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TodoItem {
    pub content: String,
    pub completed: bool,
}
