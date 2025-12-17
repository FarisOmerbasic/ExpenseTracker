using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Interfaces;

public interface IPaymentMethodRepository
{
    Task<PaymentMethod?> GetAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<PaymentMethod>> GetByUserAsync(int userId, CancellationToken ct = default);
    Task<PaymentMethod> AddAsync(PaymentMethod paymentMethod, CancellationToken ct = default);
    Task UpdateAsync(PaymentMethod paymentMethod, CancellationToken ct = default);
    Task DeleteAsync(PaymentMethod paymentMethod, CancellationToken ct = default);
}
