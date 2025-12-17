namespace ExpenseTracker.Application.DTOs;

public class CategoryDto
{
    public int CategoryId { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = default!;
    public int SortOrder { get; set; }
}
