namespace ExpenseTracker.Application.DTOs;

public class PaymentMethodDto
{
    public int PaymentMethodId { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = default!;
    public string Type { get; set; } = default!;
}
