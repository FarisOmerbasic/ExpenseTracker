using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Presentation.Services;

public class PublicStatsService(ExpenseTrackerDbContext db)
{
    public async Task<PublicStatsDto> GetAsync(CancellationToken ct = default)
    {
        var now = DateOnly.FromDateTime(DateTime.UtcNow);
        var thisMonthStart = new DateOnly(now.Year, now.Month, 1);
        var lastMonthStart = thisMonthStart.AddMonths(-1);
        var lastMonthEnd = thisMonthStart.AddDays(-1);

        var allExpenses = await db.Expenses
            .AsNoTracking()
            .ToListAsync(ct);

        var totalSpent = allExpenses.Sum(e => e.Amount);

        var thisMonthExpenses = allExpenses
            .Where(e => e.Date >= thisMonthStart && e.Date <= now)
            .ToList();
        var thisMonthTotal = thisMonthExpenses.Sum(e => e.Amount);

        var lastMonthTotal = allExpenses
            .Where(e => e.Date >= lastMonthStart && e.Date <= lastMonthEnd)
            .Sum(e => e.Amount);

        var monthChange = lastMonthTotal > 0
            ? (int)Math.Round((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100)
            : 0;

        var activeCategories = await db.Categories
            .AsNoTracking()
            .CountAsync(ct);

        var totalBalance = await db.Accounts
            .AsNoTracking()
            .SumAsync(a => a.CurrentBalance, ct);

        
        var categoryNames = await db.Categories
            .AsNoTracking()
            .ToDictionaryAsync(c => c.CategoryId, c => c.Name, ct);

        var categoryBreakdown = allExpenses
            .GroupBy(e => e.CategoryId)
            .Select(g => new CategoryBreakdownDto
            {
                Name = categoryNames.GetValueOrDefault(g.Key, "Unknown"),
                Amount = g.Sum(e => e.Amount),
            })
            .Where(c => c.Amount > 0)
            .OrderByDescending(c => c.Amount)
            .ToList();

        
        var monthlyTrend = Enumerable.Range(0, 6)
            .Select(i =>
            {
                var monthDate = now.AddMonths(-(5 - i));
                var start = new DateOnly(monthDate.Year, monthDate.Month, 1);
                var end = start.AddMonths(1).AddDays(-1);
                return new MonthlyTrendDto
                {
                    Label = start.ToString("MMM"),
                    Amount = allExpenses
                        .Where(e => e.Date >= start && e.Date <= end)
                        .Sum(e => e.Amount),
                };
            })
            .ToList();

        return new PublicStatsDto
        {
            TotalSpent = totalSpent,
            ThisMonth = thisMonthTotal,
            MonthChange = monthChange,
            TransactionsThisMonth = thisMonthExpenses.Count,
            ActiveCategories = activeCategories,
            TotalBalance = totalBalance,
            Categories = categoryBreakdown,
            MonthlyTrend = monthlyTrend,
        };
    }
}
