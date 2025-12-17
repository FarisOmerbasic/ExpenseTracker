using System.ComponentModel;
using System.Net.Sockets;
using System.Reflection.Metadata;

namespace ExpenseTracker.Domain.Entities;

public class Expense
{
    public int ExpenseId {get; set;}
    public int UserId {get; set;}
    public int CategoryId {get; set;}
    public int PaymentMethodId {get; set;}
    public decimal Amount {get; set;}
    public DateOnly Date {get; set;}
    public string? Description {get; set;}

    public User User {get; set;} = null!;
    public Category Category {get; set;} = null!;
    public PaymentMethod PaymentMethod {get; set;} = null!;
}