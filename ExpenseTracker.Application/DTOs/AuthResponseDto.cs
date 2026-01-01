namespace ExpenseTracker.Application.DTOs;

public class AuthResponseDto
{
    public string AccessToken { get; set; } = default!;
    public DateTime ExpiresAtUtc { get; set; }
    public UserDto User { get; set; } = default!;
}
