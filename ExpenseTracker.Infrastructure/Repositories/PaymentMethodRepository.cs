using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Repositories;

public class PaymentMethodRepository : IPaymentMethodRepository
{
    private readonly ExpenseTrackerDbContext _db;

    public PaymentMethodRepository(ExpenseTrackerDbContext db)
    {
        _db = db;
    }

    public Task<PaymentMethod?> GetAsync(int id, CancellationToken ct = default) =>
        _db.PaymentMethods.FirstOrDefaultAsync(p => p.PaymentMethodId == id, ct);

    public async Task<IReadOnlyList<PaymentMethod>> GetByUserAsync(int userId, CancellationToken ct = default) =>
        await _db.PaymentMethods
            .Where(p => p.UserId == userId)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<PaymentMethod> AddAsync(PaymentMethod paymentMethod, CancellationToken ct = default)
    {
        _db.PaymentMethods.Add(paymentMethod);
        await _db.SaveChangesAsync(ct);
        return paymentMethod;
    }

    public async Task UpdateAsync(PaymentMethod paymentMethod, CancellationToken ct = default)
    {
        _db.PaymentMethods.Update(paymentMethod);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(PaymentMethod paymentMethod, CancellationToken ct = default)
    {
        _db.PaymentMethods.Remove(paymentMethod);
        await _db.SaveChangesAsync(ct);
    }
}
