namespace ExpenseTracker.Application.DTOs;

public class UserDto
{
    public int UserId { get; set; }
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string CurrencyPreference { get; set; } = default!;
}
