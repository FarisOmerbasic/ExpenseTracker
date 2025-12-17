using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Services;

public class UserService
{
    private readonly IUserRepository _users;

    public UserService(IUserRepository users)
    {
        _users = users;
    }

    public async Task<IReadOnlyList<UserDto>> GetAllAsync(CancellationToken ct = default)
    {
        var items = await _users.GetAllAsync(ct);
        return items
            .Select(u => new UserDto
            {
                UserId = u.UserId,
                Name = u.Name,
                Email = u.Email,
                CurrencyPreference = u.CurrencyPreference
            })
            .ToList();
    }

    public async Task<UserDto?> GetAsync(int id, CancellationToken ct = default)
    {
        var user = await _users.GetAsync(id, ct);
        return user is null
            ? null
            : new UserDto
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                CurrencyPreference = user.CurrencyPreference
            };
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto, CancellationToken ct = default)
    {
        var entity = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = dto.PasswordHash,
            CurrencyPreference = dto.CurrencyPreference
        };

        await _users.AddAsync(entity, ct);

        return new UserDto
        {
            UserId = entity.UserId,
            Name = entity.Name,
            Email = entity.Email,
            CurrencyPreference = entity.CurrencyPreference
        };
    }

    public async Task<bool> UpdateAsync(int id, CreateUserDto dto, CancellationToken ct = default)
    {
        var existing = await _users.GetAsync(id, ct);
        if (existing is null) return false;

        existing.Name = dto.Name;
        existing.Email = dto.Email;
        existing.PasswordHash = dto.PasswordHash;
        existing.CurrencyPreference = dto.CurrencyPreference;

        await _users.UpdateAsync(existing, ct);
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var existing = await _users.GetAsync(id, ct);
        if (existing is null) return false;

        await _users.DeleteAsync(existing, ct);
        return true;
    }
}
