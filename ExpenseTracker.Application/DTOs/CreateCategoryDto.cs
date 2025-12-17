namespace ExpenseTracker.Application.DTOs;

public class CreateCategoryDto
{
    public int UserId { get; set; }
    public string Name { get; set; } = default!;
    public int SortOrder { get; set; }
}
