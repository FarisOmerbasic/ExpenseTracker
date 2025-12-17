namespace ExpenseTracker.Domain.Entities;

public class Budget
{
    public int BudgetId {get; set;}
    public int UserId {get; set;}
    public int CategoryId {get; set;}
    public decimal Amount {get; set;}

    public User User {get; set;} = null!;
    public Category Category { get; set;} = null!;
}