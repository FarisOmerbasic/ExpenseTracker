using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly ExpenseService _service;
    private readonly ILogger<ExpensesController> _logger;

    public ExpensesController(ExpenseService service, ILogger<ExpensesController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ExpenseDto>> Get(int id, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"ExpensesController - Get invoked (id: {id})");
            var expense = await _service.GetAsync(id, ct);
            if (expense is null) return NotFound();
            return Ok(expense);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in ExpensesController.Get");
            throw;
        }
    }

    [HttpGet("user/{userId:int}")]
    public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetByUser(int userId, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"ExpensesController - GetByUser invoked (userId: {userId})");
            var result = await _service.GetByUserAsync(userId, ct);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in ExpensesController.GetByUser");
            throw;
        }
    }

    [HttpPost]
    public async Task<ActionResult<ExpenseDto>> Create(CreateExpenseDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug("ExpensesController - Create invoked");
            var created = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(Get), new { id = created.ExpenseId }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in ExpensesController.Create");
            throw;
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, CreateExpenseDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"ExpensesController - Update invoked (id: {id})");
            var ok = await _service.UpdateAsync(id, dto, ct);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in ExpensesController.Update");
            throw;
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"ExpensesController - Delete invoked (id: {id})");
            var ok = await _service.DeleteAsync(id, ct);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in ExpensesController.Delete");
            throw;
        }
    }
}
