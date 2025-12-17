namespace ExpenseTracker.Application.DTOs;

public class CreatePaymentMethodDto
{
    public int UserId { get; set; }
    public string Name { get; set; } = default!;
    public string Type { get; set; } = default!;
}
