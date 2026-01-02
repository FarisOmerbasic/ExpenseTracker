namespace ExpenseTracker.Application.DTOs;

public class PasswordResetTokenResult
{
    public string Token { get; set; } = default!;
    public DateTime ExpiresAtUtc { get; set; }
}
