using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpenseTracker.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBudgetNameAndExpenseAccount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_budget_category_CategoryId",
                table: "budget");

            migrationBuilder.AddColumn<int>(
                name: "AccountId",
                table: "expenses",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "budget",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "budget",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_expenses_AccountId",
                table: "expenses",
                column: "AccountId");

            migrationBuilder.AddForeignKey(
                name: "FK_budget_category_CategoryId",
                table: "budget",
                column: "CategoryId",
                principalTable: "category",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_expenses_account_AccountId",
                table: "expenses",
                column: "AccountId",
                principalTable: "account",
                principalColumn: "AccountId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_budget_category_CategoryId",
                table: "budget");

            migrationBuilder.DropForeignKey(
                name: "FK_expenses_account_AccountId",
                table: "expenses");

            migrationBuilder.DropIndex(
                name: "IX_expenses_AccountId",
                table: "expenses");

            migrationBuilder.DropColumn(
                name: "AccountId",
                table: "expenses");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "budget");

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "budget",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_budget_category_CategoryId",
                table: "budget",
                column: "CategoryId",
                principalTable: "category",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
