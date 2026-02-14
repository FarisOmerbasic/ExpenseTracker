namespace ExpenseTracker.Application.DTOs;

public class ExpenseDto
{
    public int ExpenseId { get; set; }
    public decimal Amount { get; set; }
    public DateOnly Date { get; set; }
    public string? Description { get; set; }
    public int CategoryId { get; set; }
    public int PaymentMethodId { get; set; }
    public int? AccountId { get; set; }
    public int UserId { get; set; }
}
