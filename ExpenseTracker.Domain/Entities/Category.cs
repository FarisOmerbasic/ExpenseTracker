namespace ExpenseTracker.Domain.Entities;

public class Category
{
    public int CategoryId { get; set; }
    public int UserId { get; set; }
    public required string Name { get; set; }
    public int SortOrder { get; set; }

    public User User { get; set; } = null!;
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
}
