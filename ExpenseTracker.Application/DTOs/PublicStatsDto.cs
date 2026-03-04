namespace ExpenseTracker.Application.DTOs;

public class PublicStatsDto
{
    public decimal TotalSpent { get; set; }
    public decimal ThisMonth { get; set; }
    public int MonthChange { get; set; }
    public int TransactionsThisMonth { get; set; }
    public int ActiveCategories { get; set; }
    public decimal TotalBalance { get; set; }
    public List<CategoryBreakdownDto> Categories { get; set; } = [];
    public List<MonthlyTrendDto> MonthlyTrend { get; set; } = [];
}

public class CategoryBreakdownDto
{
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}

public class MonthlyTrendDto
{
    public string Label { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}
