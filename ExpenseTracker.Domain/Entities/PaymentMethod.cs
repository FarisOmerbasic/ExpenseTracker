namespace ExpenseTracker.Domain.Entities;

public class PaymentMethod
{
    public int PaymentMethodId { get; set; }
    public int UserId { get; set; }
    public required string Name { get; set; }
    public required string Type { get; set; }

    public User User { get; set; } = null!;
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();

}
