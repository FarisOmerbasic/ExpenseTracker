using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentMethodsController : ControllerBase
{
    private readonly PaymentMethodService _service;
    private readonly ILogger<PaymentMethodsController> _logger;

    public PaymentMethodsController(PaymentMethodService service, ILogger<PaymentMethodsController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PaymentMethodDto>> Get(int id, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"PaymentMethodsController - Get invoked (id: {id})");
            var method = await _service.GetAsync(id, ct);
            if (method is null) return NotFound();
            return Ok(method);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in PaymentMethodsController.Get");
            throw;
        }
    }

    [HttpGet("user/{userId:int}")]
    public async Task<ActionResult<IEnumerable<PaymentMethodDto>>> GetByUser(int userId, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"PaymentMethodsController - GetByUser invoked (userId: {userId})");
            var result = await _service.GetByUserAsync(userId, ct);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in PaymentMethodsController.GetByUser");
            throw;
        }
    }

    [HttpPost]
    public async Task<ActionResult<PaymentMethodDto>> Create(CreatePaymentMethodDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug("PaymentMethodsController - Create invoked");
            var created = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(Get), new { id = created.PaymentMethodId }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in PaymentMethodsController.Create");
            throw;
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, CreatePaymentMethodDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"PaymentMethodsController - Update invoked (id: {id})");
            var ok = await _service.UpdateAsync(id, dto, ct);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in PaymentMethodsController.Update");
            throw;
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"PaymentMethodsController - Delete invoked (id: {id})");
            var ok = await _service.DeleteAsync(id, ct);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in PaymentMethodsController.Delete");
            throw;
        }
    }
}
