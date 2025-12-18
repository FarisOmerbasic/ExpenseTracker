namespace ExpenseTracker.Application.DTOs;

public class CreateUserDto {
    public string Name {get; set; } = default!;
    public string Email {get; set;} = default!;
    public string Password {get; set;} = default!;
    public string CurrencyPreference {get; set; } = default!;
}
