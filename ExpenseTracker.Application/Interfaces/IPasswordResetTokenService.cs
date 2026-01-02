using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Interfaces;

public interface IPasswordResetTokenService
{
    PasswordResetTokenResult CreateToken(User user);
    bool TryValidateToken(string token, out int userId, out string email);
}
