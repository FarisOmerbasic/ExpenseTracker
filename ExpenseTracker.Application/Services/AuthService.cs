using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Services;

public class AuthService
{
    private readonly IUserRepository _users;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public AuthService(IUserRepository users, IPasswordHasher passwordHasher, ITokenService tokenService)
    {
        _users = users;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto dto, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
        {
            return null;
        }

        var email = dto.Email.Trim();
        var user = await _users.GetByEmailAsync(email, ct);
        if (user is null) return null;
        if (!_passwordHasher.Verify(dto.Password, user.PasswordHash)) return null;

        return BuildResponse(user);
    }

    public async Task<AuthResponseDto?> RegisterAsync(CreateUserDto dto, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
        {
            return null;
        }

        var email = dto.Email.Trim();
        var existing = await _users.GetByEmailAsync(email, ct);
        if (existing is not null) return null;

        var entity = new User
        {
            Name = dto.Name,
            Email = email,
            PasswordHash = _passwordHasher.Hash(dto.Password),
            CurrencyPreference = dto.CurrencyPreference
        };

        await _users.AddAsync(entity, ct);
        return BuildResponse(entity);
    }

    private AuthResponseDto BuildResponse(User user)
    {
        var token = _tokenService.CreateToken(user);

        return new AuthResponseDto
        {
            AccessToken = token.AccessToken,
            ExpiresAtUtc = token.ExpiresAtUtc,
            User = new UserDto
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                CurrencyPreference = user.CurrencyPreference
            }
        };
    }
}
