using BanMayTinh.Models;
using BanMayTinh.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BanMayTinh.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    BanMayTinhDbContext db,
    JwtTokenService jwt,
    IWebHostEnvironment env) : ControllerBase
{
    public record RegisterRequest(string UserName, string Email, string Password, string? FullName);
    public record LoginRequest(string UserNameOrEmail, string Password);

    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterRequest request)
    {
        if (await db.Users.AnyAsync(u => u.UserName == request.UserName || u.Email == request.Email))
        {
            return BadRequest("Username hoặc email đã tồn tại.");
        }

        var user = new User
        {
            UserName = request.UserName,
            Email = request.Email,
            FullName = request.FullName,
            PasswordHash = PasswordHasher.Hash(request.Password),
            Role = "Customer",
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();
        var token = jwt.CreateToken(user);
        return Ok(new { user.Id, user.UserName, user.Email, user.FullName, user.Role, token });
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginRequest? request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.UserNameOrEmail) || request.Password is null)
        {
            return BadRequest(
                "Body JSON không hợp lệ. Dùng đúng format: {\"userNameOrEmail\":\"email@...\",\"password\":\"matKhauCuaBan\"} (có dấu : sau password).");
        }

        var login = request.UserNameOrEmail.Trim();
        var password = request.Password;

        var user = await db.Users
            .FirstOrDefaultAsync(u =>
                u.UserName == login || u.Email == login);

        if (user == null || !PasswordHasher.Verify(password, user.PasswordHash))
        {
            return Unauthorized("Sai tài khoản hoặc mật khẩu.");
        }

        if (!user.IsActive)
        {
            return Unauthorized("Tài khoản đã bị khóa.");
        }

        var token = jwt.CreateToken(user);
        return Ok(new { user.Id, user.UserName, user.Email, user.FullName, user.Role, token });
    }

    /// <summary>
    /// CHỈ dùng khi Development. Ghi đè mật khẩu bằng chuỗi hash đúng chuẩn API.
    /// Không được ghi plain text vào cột PasswordHash trong SQL — login sẽ luôn sai.
    /// </summary>
    [HttpPost("dev/reset-password")]
    public async Task<ActionResult> DevResetPassword([FromBody] DevResetPasswordRequest? request)
    {
        if (!env.IsDevelopment())
        {
            return NotFound();
        }

        if (request is null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.NewPassword))
        {
            return BadRequest("Body: { \"email\": \"...\", \"newPassword\": \"...\" }");
        }

        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email.Trim());
        if (user == null)
        {
            return NotFound("Không tìm thấy user với email này.");
        }

        user.PasswordHash = PasswordHasher.Hash(request.NewPassword);
        await db.SaveChangesAsync();

        return Ok(new
        {
            message = "Đã cập nhật PasswordHash (đã hash). Giờ đăng nhập bằng mật khẩu mới.",
            email = user.Email,
            role = user.Role
        });
    }

    public record DevResetPasswordRequest(string Email, string NewPassword);
}

