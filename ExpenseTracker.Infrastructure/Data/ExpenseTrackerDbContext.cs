using ExpenseTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Data;

public class ExpenseTrackerDbContext : DbContext
{
    public ExpenseTrackerDbContext(DbContextOptions<ExpenseTrackerDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<PaymentMethod> PaymentMethods => Set<PaymentMethod>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<Budget> Budgets => Set<Budget>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(x => x.UserId);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(200);
            entity.Property(x => x.Email).IsRequired().HasMaxLength(320);
            entity.Property(x => x.PasswordHash).IsRequired();
            entity.Property(x => x.CurrencyPreference).IsRequired().HasMaxLength(16);
            entity.HasMany(x => x.Accounts).WithOne(x => x.User).HasForeignKey(x => x.UserId);
            entity.HasMany(x => x.Categories).WithOne(x => x.User).HasForeignKey(x => x.UserId);
            entity.HasMany(x => x.PaymentMethods).WithOne(x => x.User).HasForeignKey(x => x.UserId);
            entity.HasMany(x => x.Expenses).WithOne(x => x.User).HasForeignKey(x => x.UserId);
            entity.HasMany(x => x.Budgets).WithOne(x => x.User).HasForeignKey(x => x.UserId);
        });

        builder.Entity<Account>(entity =>
        {
            entity.ToTable("account");
            entity.HasKey(x => x.AccountId);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(200);
            entity.Property(x => x.Type).IsRequired().HasMaxLength(50);
            entity.Property(x => x.InitialBalance).HasPrecision(18, 2);
            entity.Property(x => x.CurrentBalance).HasPrecision(18, 2);
            entity.HasOne(x => x.User).WithMany(u => u.Accounts).HasForeignKey(x => x.UserId);
        });

        builder.Entity<Category>(entity =>
        {
            entity.ToTable("category");
            entity.HasKey(x => x.CategoryId);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(200);
            entity.Property(x => x.SortOrder).IsRequired();
            entity.HasOne(x => x.User).WithMany(u => u.Categories).HasForeignKey(x => x.UserId);
        });

        builder.Entity<PaymentMethod>(entity =>
        {
            entity.ToTable("payment_method");
            entity.HasKey(x => x.PaymentMethodId);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(200);
            entity.Property(x => x.Type).IsRequired().HasMaxLength(50);
            entity.HasOne(x => x.User).WithMany(u => u.PaymentMethods).HasForeignKey(x => x.UserId);
        });

        builder.Entity<Expense>(entity =>
        {
            entity.ToTable("expenses");
            entity.HasKey(x => x.ExpenseId);
            entity.Property(x => x.Amount).HasPrecision(18, 2);
            entity.Property(x => x.Description).HasMaxLength(500);
            entity.HasOne(x => x.User).WithMany(u => u.Expenses).HasForeignKey(x => x.UserId);
            entity.HasOne(x => x.Category).WithMany(c => c.Expenses).HasForeignKey(x => x.CategoryId);
            entity.HasOne(x => x.PaymentMethod).WithMany(p => p.Expenses).HasForeignKey(x => x.PaymentMethodId);
            entity.HasOne(x => x.Account).WithMany(a => a.Expenses).HasForeignKey(x => x.AccountId).OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<Budget>(entity =>
        {
            entity.ToTable("budget");
            entity.HasKey(x => x.BudgetId);
            entity.Property(x => x.Amount).HasPrecision(18, 2);
            entity.Property(x => x.Name).HasMaxLength(200);
            entity.HasOne(x => x.User).WithMany(u => u.Budgets).HasForeignKey(x => x.UserId);
            entity.HasOne(x => x.Category).WithMany(c => c.Budgets).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.SetNull);
        });
    }
}
