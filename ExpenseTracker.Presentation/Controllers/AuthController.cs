using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AuthService service, IHostEnvironment env) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(CreateUserDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { message = "Email and password are required." });

        var result = await service.RegisterAsync(dto, ct);
        if (result is null) return Conflict(new { message = "Email is already in use." });
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginRequestDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { message = "Email and password are required." });

        var result = await service.LoginAsync(dto, ct);
        if (result is null) return Unauthorized();
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("password-reset/request")]
    public async Task<ActionResult> RequestPasswordReset(PasswordResetRequestDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.Email))
            return BadRequest(new { message = "Email is required." });

        var result = await service.RequestPasswordResetAsync(dto, ct);
        var message = new { message = "If the email exists, a reset link has been sent." };

        if (env.IsDevelopment() && result is not null)
            return Accepted(new { message.message, result.Token, result.ExpiresAtUtc });

        return Accepted(message);
    }

    [AllowAnonymous]
    [HttpPost("password-reset/confirm")]
    public async Task<ActionResult> ConfirmPasswordReset(PasswordResetConfirmDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.Token) || string.IsNullOrWhiteSpace(dto.NewPassword))
            return BadRequest(new { message = "Token and new password are required." });

        if (dto.NewPassword.Length < 8)
            return BadRequest(new { message = "Password must be at least 8 characters long." });

        var ok = await service.ResetPasswordAsync(dto, ct);
        if (!ok) return BadRequest(new { message = "Invalid or expired reset token." });
        return NoContent();
    }
}
