using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Services;
using ExpenseTracker.Presentation.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly UserService _service;
    private readonly ILogger<UsersController> _logger;

    public UsersController(UserService service, ILogger<UsersController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll(CancellationToken ct)
    {
        try
        {
            _logger.LogDebug("UsersController - GetAll invoked");
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            var user = await _service.GetAsync(userId.Value, ct);
            if (user is null) return NotFound();
            return Ok(new[] { user });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in UsersController.GetAll");
            throw;
        }
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDto>> Get(int id, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"UsersController - Get invoked (id: {id})");
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            if (userId.Value != id) return Forbid();
            var user = await _service.GetAsync(id, ct);
            if (user is null) return NotFound();
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in UsersController.Get");
            throw;
        }
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<UserDto>> Create(CreateUserDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug("UsersController - Create invoked");
            var created = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(Get), new { id = created.UserId }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in UsersController.Create");
            throw;
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, CreateUserDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"UsersController - Update invoked (id: {id})");
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            if (userId.Value != id) return Forbid();
            var ok = await _service.UpdateAsync(id, dto, ct);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in UsersController.Update");
            throw;
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"UsersController - Delete invoked (id: {id})");
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            if (userId.Value != id) return Forbid();
            var ok = await _service.DeleteAsync(id, ct);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in UsersController.Delete");
            throw;
        }
    }
}
