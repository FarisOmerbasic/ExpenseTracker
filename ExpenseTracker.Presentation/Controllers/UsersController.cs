using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Services;
using ExpenseTracker.Presentation.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController(UserService service) : ControllerBase
{
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDto>> Get(int id, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();
        if (userId.Value != id) return Forbid();
        var user = await service.GetAsync(id, ct);
        if (user is null) return NotFound();
        return Ok(user);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, CreateUserDto dto, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();
        if (userId.Value != id) return Forbid();
        var ok = await service.UpdateAsync(id, dto, ct);
        if (!ok) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();
        if (userId.Value != id) return Forbid();
        var ok = await service.DeleteAsync(id, ct);
        if (!ok) return NotFound();
        return NoContent();
    }
}
