using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Application.DTOs;

public class ChangePasswordDto
{
    [Required]
    public string CurrentPassword { get; set; } = default!;

    [Required]
    [StringLength(128, MinimumLength = 8)]
    public string NewPassword { get; set; } = default!;
}
