using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BudgetsController : ControllerBase
{
    private readonly BudgetService _service;
    private readonly ILogger<BudgetsController> _logger;

    public BudgetsController(BudgetService service, ILogger<BudgetsController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BudgetDto>> Get(int id, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"BudgetsController - Get invoked (id: {id})");
            var budget = await _service.GetAsync(id, ct);
            if (budget is null) return NotFound();
            return Ok(budget);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in BudgetsController.Get");
            throw;
        }
    }

    [HttpGet("user/{userId:int}")]
    public async Task<ActionResult<IEnumerable<BudgetDto>>> GetByUser(int userId, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"BudgetsController - GetByUser invoked (userId: {userId})");
            var result = await _service.GetByUserAsync(userId, ct);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in BudgetsController.GetByUser");
            throw;
        }
    }

    [HttpPost]
    public async Task<ActionResult<BudgetDto>> Create(CreateBudgetDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug("BudgetsController - Create invoked");
            var created = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(Get), new { id = created.BudgetId }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in BudgetsController.Create");
            throw;
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, CreateBudgetDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"BudgetsController - Update invoked (id: {id})");
            var ok = await _service.UpdateAsync(id, dto, ct);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in BudgetsController.Update");
            throw;
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"BudgetsController - Delete invoked (id: {id})");
            var ok = await _service.DeleteAsync(id, ct);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in BudgetsController.Delete");
            throw;
        }
    }
}
