using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Services;

public class PaymentMethodService
{
    private readonly IPaymentMethodRepository _paymentMethods;

    public PaymentMethodService(IPaymentMethodRepository paymentMethods)
    {
        _paymentMethods = paymentMethods;
    }

    public async Task<IReadOnlyList<PaymentMethodDto>> GetByUserAsync(int userId, CancellationToken ct = default)
    {
        var items = await _paymentMethods.GetByUserAsync(userId, ct);
        return items
            .Select(p => new PaymentMethodDto
            {
                PaymentMethodId = p.PaymentMethodId,
                UserId = p.UserId,
                Name = p.Name,
                Type = p.Type
            })
            .ToList();
    }

    public async Task<PaymentMethodDto?> GetAsync(int id, CancellationToken ct = default)
    {
        var entity = await _paymentMethods.GetAsync(id, ct);
        return entity is null
            ? null
            : new PaymentMethodDto
            {
                PaymentMethodId = entity.PaymentMethodId,
                UserId = entity.UserId,
                Name = entity.Name,
                Type = entity.Type
            };
    }

    public async Task<PaymentMethodDto> CreateAsync(CreatePaymentMethodDto dto, CancellationToken ct = default)
    {
        var entity = new PaymentMethod
        {
            UserId = dto.UserId,
            Name = dto.Name,
            Type = dto.Type
        };

        await _paymentMethods.AddAsync(entity, ct);

        return new PaymentMethodDto
        {
            PaymentMethodId = entity.PaymentMethodId,
            UserId = entity.UserId,
            Name = entity.Name,
            Type = entity.Type
        };
    }

    public async Task<bool> UpdateAsync(int id, CreatePaymentMethodDto dto, CancellationToken ct = default)
    {
        var existing = await _paymentMethods.GetAsync(id, ct);
        if (existing is null) return false;

        existing.UserId = dto.UserId;
        existing.Name = dto.Name;
        existing.Type = dto.Type;

        await _paymentMethods.UpdateAsync(existing, ct);
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var existing = await _paymentMethods.GetAsync(id, ct);
        if (existing is null) return false;

        await _paymentMethods.DeleteAsync(existing, ct);
        return true;
    }
}
