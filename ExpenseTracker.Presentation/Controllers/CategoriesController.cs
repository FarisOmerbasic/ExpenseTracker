using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Services;
using ExpenseTracker.Presentation.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly CategoryService _service;
    private readonly ILogger<CategoriesController> _logger;

    public CategoriesController(CategoryService service, ILogger<CategoriesController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryDto>> Get(int id, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"CategoriesController - Get invoked (id: {id})");
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            var category = await _service.GetAsync(id, ct);
            if (category is null) return NotFound();
            if (category.UserId != userId.Value) return Forbid();
            return Ok(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in CategoriesController.Get");
            throw;
        }
    }

    [HttpGet("user/{userId:int}")]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetByUser(int userId, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"CategoriesController - GetByUser invoked (userId: {userId})");
            var currentUserId = User.GetUserId();
            if (currentUserId is null) return Unauthorized();
            if (currentUserId.Value != userId) return Forbid();
            var result = await _service.GetByUserAsync(userId, ct);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in CategoriesController.GetByUser");
            throw;
        }
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create(CreateCategoryDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug("CategoriesController - Create invoked");
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            dto.UserId = userId.Value;
            var created = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(Get), new { id = created.CategoryId }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in CategoriesController.Create");
            throw;
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, CreateCategoryDto dto, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"CategoriesController - Update invoked (id: {id})");
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            var existing = await _service.GetAsync(id, ct);
            if (existing is null) return NotFound();
            if (existing.UserId != userId.Value) return Forbid();
            dto.UserId = userId.Value;
            var ok = await _service.UpdateAsync(id, dto, ct);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in CategoriesController.Update");
            throw;
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"CategoriesController - Delete invoked (id: {id})");
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            var existing = await _service.GetAsync(id, ct);
            if (existing is null) return NotFound();
            if (existing.UserId != userId.Value) return Forbid();
            var ok = await _service.DeleteAsync(id, ct);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in CategoriesController.Delete");
            throw;
        }
    }
}
