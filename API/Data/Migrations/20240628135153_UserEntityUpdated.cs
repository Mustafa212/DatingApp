using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UserEntityUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "PasswrodHash",
                table: "Users",
                type: "BLOB",
                nullable: false,
                defaultValue:new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "PasswrodSalt",
                table: "Users",
                type: "BLOB",
                nullable: true,
                defaultValue:new byte[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswrodHash",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PasswrodSalt",
                table: "Users");
        }
    }
}
