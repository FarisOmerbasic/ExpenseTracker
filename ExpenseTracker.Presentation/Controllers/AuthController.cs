using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _service;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AuthService service, ILogger<AuthController> logger)
    {
        _service = service;
        _logger = logger;
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
}
