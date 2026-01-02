namespace ExpenseTracker.Infrastructure.Security;

public sealed class JwtOptions
{
    public string Issuer { get; set; } = "ExpenseTracker";
    public string Audience { get; set; } = "ExpenseTracker";
    public string SigningKey { get; set; } = string.Empty;
    public int ExpiresMinutes { get; set; } = 60;
    public int PasswordResetExpiresMinutes { get; set; } = 15;
}
