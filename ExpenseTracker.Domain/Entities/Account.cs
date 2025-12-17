namespace ExpenseTracker.Domain.Entities;

public class Account
{
    public int AccountId {get; set;}
    public int UserId {get; set;}
    public required string Name{get; set;}
    public required string Type{get; set;}
    public decimal InitialBalance{get; set;}
    public decimal CurrentBalance{get; set;}

    public User User {get; set;} = null!;
}