using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Application.DTOs;

public class PasswordResetConfirmDto
{
    [Required]
    public string Token { get; set; } = default!;

    [Required]
    [StringLength(128, MinimumLength = 8)]
    public string NewPassword { get; set; } = default!;
}
