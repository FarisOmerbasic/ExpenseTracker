namespace ExpenseTracker.Domain.Entities;

public class User
{
    public int UserId {get; set;}
    public required string Name { get; set;}
    public required string Email { get; set;}
    public required string PasswordHash { get; set;}
    public required string CurrencyPreference { get; set;}

    public ICollection<Account> Accounts { get; set; } = new List<Account>();
    public ICollection<Category> Categories { get; set; } = new List<Category>();
    public ICollection<PaymentMethod> PaymentMethods { get; set; } = new List<PaymentMethod>();
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
}
