using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace ExpenseTracker.Infrastructure.Security;

public sealed class PasswordResetTokenService : IPasswordResetTokenService
{
    private const string ResetTokenType = "pwd_reset";
    private readonly JwtOptions _options;
    private readonly SymmetricSecurityKey _signingKey;
    private readonly TokenValidationParameters _validationParameters;
    private readonly JwtSecurityTokenHandler _handler = new();

    public PasswordResetTokenService(IOptions<JwtOptions> options)
    {
        _options = options.Value;
        if (string.IsNullOrWhiteSpace(_options.SigningKey))
        {
            throw new InvalidOperationException("Jwt:SigningKey is not configured.");
        }

        _signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SigningKey));
        _validationParameters = new TokenValidationParameters
        {
            ValidIssuer = _options.Issuer,
            ValidAudience = _options.Audience,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = _signingKey,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    }

    public PasswordResetTokenResult CreateToken(User user)
    {
        var now = DateTime.UtcNow;
        var expiresMinutes = _options.PasswordResetExpiresMinutes <= 0 ? 15 : _options.PasswordResetExpiresMinutes;
        var expires = now.AddMinutes(expiresMinutes);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(JwtRegisteredClaimNames.Typ, ResetTokenType)
        };

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            notBefore: now,
            expires: expires,
            signingCredentials: new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256)
        );

        return new PasswordResetTokenResult
        {
            Token = _handler.WriteToken(token),
            ExpiresAtUtc = expires
        };
    }

    public bool TryValidateToken(string token, out int userId, out string email)
    {
        userId = default;
        email = string.Empty;

        if (string.IsNullOrWhiteSpace(token)) return false;

        try
        {
            var principal = _handler.ValidateToken(token, _validationParameters, out _);
            var tokenType = principal.FindFirstValue(JwtRegisteredClaimNames.Typ);
            if (!string.Equals(tokenType, ResetTokenType, StringComparison.Ordinal)) return false;

            var userIdValue = principal.FindFirstValue(ClaimTypes.NameIdentifier)
                               ?? principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!int.TryParse(userIdValue, out userId)) return false;

            email = principal.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
            if (string.IsNullOrWhiteSpace(email)) return false;

            return true;
        }
        catch (SecurityTokenException)
        {
            return false;
        }
        catch (ArgumentException)
        {
            return false;
        }
    }
}
