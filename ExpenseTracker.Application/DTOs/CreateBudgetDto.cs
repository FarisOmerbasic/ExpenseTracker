namespace ExpenseTracker.Application.DTOs;

public class CreateBudgetDto
{
    public int UserId { get; set; }
    public int? CategoryId { get; set; }
    public string? Name { get; set; }
    public decimal Amount { get; set; }
}
