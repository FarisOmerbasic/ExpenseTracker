using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Services;

public class CategoryService
{
    private readonly ICategoryRepository _categories;

    public CategoryService(ICategoryRepository categories)
    {
        _categories = categories;
    }

    public async Task<IReadOnlyList<CategoryDto>> GetByUserAsync(int userId, CancellationToken ct = default)
    {
        var items = await _categories.GetByUserAsync(userId, ct);
        return items
            .Select(c => new CategoryDto
            {
                CategoryId = c.CategoryId,
                UserId = c.UserId,
                Name = c.Name,
                SortOrder = c.SortOrder
            })
            .ToList();
    }

    public async Task<CategoryDto?> GetAsync(int id, CancellationToken ct = default)
    {
        var entity = await _categories.GetAsync(id, ct);
        return entity is null
            ? null
            : new CategoryDto
            {
                CategoryId = entity.CategoryId,
                UserId = entity.UserId,
                Name = entity.Name,
                SortOrder = entity.SortOrder
            };
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto, CancellationToken ct = default)
    {
        var entity = new Category
        {
            UserId = dto.UserId,
            Name = dto.Name,
            SortOrder = dto.SortOrder
        };

        await _categories.AddAsync(entity, ct);

        return new CategoryDto
        {
            CategoryId = entity.CategoryId,
            UserId = entity.UserId,
            Name = entity.Name,
            SortOrder = entity.SortOrder
        };
    }

    public async Task<bool> UpdateAsync(int id, CreateCategoryDto dto, CancellationToken ct = default)
    {
        var existing = await _categories.GetAsync(id, ct);
        if (existing is null) return false;

        existing.UserId = dto.UserId;
        existing.Name = dto.Name;
        existing.SortOrder = dto.SortOrder;

        await _categories.UpdateAsync(existing, ct);
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var existing = await _categories.GetAsync(id, ct);
        if (existing is null) return false;

        await _categories.DeleteAsync(existing, ct);
        return true;
    }
}
