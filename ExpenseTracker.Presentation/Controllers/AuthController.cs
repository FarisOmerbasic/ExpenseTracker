using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace ExpenseTracker.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _service;
    private readonly ILogger<AuthController> _logger;
    private readonly IHostEnvironment _env;

    public AuthController(AuthService service, ILogger<AuthController> logger, IHostEnvironment env)
    {
        _service = service;
        _logger = logger;
        _env = env;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(CreateUserDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug("AuthController - Register invoked");
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }
            var result = await _service.RegisterAsync(dto, ct);
            if (result is null) return Conflict(new { message = "Email is already in use." });
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in AuthController.Register");
            throw;
        }
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginRequestDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug("AuthController - Login invoked");
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }
            var result = await _service.LoginAsync(dto, ct);
            if (result is null) return Unauthorized();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in AuthController.Login");
            throw;
        }
    }

    [AllowAnonymous]
    [HttpPost("password-reset/request")]
    public async Task<ActionResult> RequestPasswordReset(PasswordResetRequestDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug("AuthController - Password reset request invoked");
            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                return BadRequest(new { message = "Email is required." });
            }

            var result = await _service.RequestPasswordResetAsync(dto, ct);
            var message = new { message = "If the email exists, a reset link has been sent." };

            if (_env.IsDevelopment() && result is not null)
            {
                return Accepted(new { message.message, result.Token, result.ExpiresAtUtc });
            }

            return Accepted(message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in AuthController.RequestPasswordReset");
            throw;
        }
    }

    [AllowAnonymous]
    [HttpPost("password-reset/confirm")]
    public async Task<ActionResult> ConfirmPasswordReset(PasswordResetConfirmDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug("AuthController - Password reset confirm invoked");
            if (string.IsNullOrWhiteSpace(dto.Token) || string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                return BadRequest(new { message = "Token and new password are required." });
            }
            if (dto.NewPassword.Length < 8)
            {
                return BadRequest(new { message = "Password must be at least 8 characters long." });
            }

            var ok = await _service.ResetPasswordAsync(dto, ct);
            if (!ok) return BadRequest(new { message = "Invalid or expired reset token." });
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in AuthController.ConfirmPasswordReset");
            throw;
        }
    }
}
