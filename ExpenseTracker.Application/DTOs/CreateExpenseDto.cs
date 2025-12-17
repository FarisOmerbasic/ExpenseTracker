namespace ExpenseTracker.Application.DTOs;

public class CreateExpenseDto {

    public int UserId {get; set;}
    public int CategoryId { get; set; }
    public int PaymentMethodId {get; set;}
    public decimal Amount { get; set; }
    public DateOnly Date { get; set; }
    public string? Description { get; set; }
}