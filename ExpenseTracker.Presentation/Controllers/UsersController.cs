using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
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
            var users = await _service.GetAllAsync(ct);
            return Ok(users);
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
