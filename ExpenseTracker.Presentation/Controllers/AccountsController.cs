using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly AccountService _service;
    private readonly ILogger<AccountsController> _logger;

    public AccountsController(AccountService service, ILogger<AccountsController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AccountDto>> Get(int id, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"AccountsController - Get invoked (id: {id})");
            var account = await _service.GetAsync(id, ct);
            if (account is null) return NotFound();
            return Ok(account);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in AccountsController.Get");
            throw;
        }
    }

    [HttpGet("user/{userId:int}")]
    public async Task<ActionResult<IEnumerable<AccountDto>>> GetByUser(int userId, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"AccountsController - GetByUser invoked (userId: {userId})");
            var result = await _service.GetByUserAsync(userId, ct);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in AccountsController.GetByUser");
            throw;
        }
    }

    [HttpPost]
    public async Task<ActionResult<AccountDto>> Create(CreateAccountDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug("AccountsController - Create invoked");
            var created = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(Get), new { id = created.AccountId }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in AccountsController.Create");
            throw;
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, CreateAccountDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"AccountsController - Update invoked (id: {id})");
            var ok = await _service.UpdateAsync(id, dto, ct);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in AccountsController.Update");
            throw;
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"AccountsController - Delete invoked (id: {id})");
            var ok = await _service.DeleteAsync(id, ct);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in AccountsController.Delete");
            throw;
        }
    }
}
