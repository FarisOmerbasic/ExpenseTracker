using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Services;
using ExpenseTracker.Presentation.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentMethodsController(PaymentMethodService service) : ControllerBase
{
    [HttpGet("{id:int}")]
    public async Task<ActionResult<PaymentMethodDto>> Get(int id, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();
        var method = await service.GetAsync(id, ct);
        if (method is null) return NotFound();
        if (method.UserId != userId.Value) return Forbid();
        return Ok(method);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PaymentMethodDto>>> GetMine(CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();
        return Ok(await service.GetByUserAsync(userId.Value, ct));
    }

    [HttpPost]
    public async Task<ActionResult<PaymentMethodDto>> Create(CreatePaymentMethodDto dto, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();
        dto.UserId = userId.Value;
        var created = await service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(Get), new { id = created.PaymentMethodId }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, CreatePaymentMethodDto dto, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();
        var existing = await service.GetAsync(id, ct);
        if (existing is null) return NotFound();
        if (existing.UserId != userId.Value) return Forbid();
        dto.UserId = userId.Value;
        var ok = await service.UpdateAsync(id, dto, ct);
        if (!ok) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();
        var existing = await service.GetAsync(id, ct);
        if (existing is null) return NotFound();
        if (existing.UserId != userId.Value) return Forbid();
        var ok = await service.DeleteAsync(id, ct);
        if (!ok) return NotFound();
        return NoContent();
    }
}
