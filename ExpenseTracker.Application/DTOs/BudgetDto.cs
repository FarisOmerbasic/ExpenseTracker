namespace ExpenseTracker.Application.DTOs;

public class BudgetDto
{
    public int BudgetId { get; set; }
    public int UserId { get; set; }
    public int CategoryId { get; set; }
    public decimal Amount { get; set; }
}
