using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Application.DTOs;

public class PasswordResetRequestDto
{
    [Required]
    [EmailAddress]
    [StringLength(320)]
    public string Email { get; set; } = default!;
}
