namespace ExpenseTracker.Application.DTOs;

public class AccountDto
{
    public int AccountId { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = default!;
    public string Type { get; set; } = default!;
    public decimal InitialBalance { get; set; }
    public decimal CurrentBalance { get; set; }
}
