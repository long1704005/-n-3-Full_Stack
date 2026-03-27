using BanMayTinh.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BanMayTinh.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController(BanMayTinhDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetAll()
    {
        return await db.Users
            .AsNoTracking()
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<User>> GetById(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user == null) return NotFound();
        return user;
    }

    [HttpPut("{id:int}/active")]
    public async Task<IActionResult> SetActive(int id, [FromBody] bool isActive)
    {
        var user = await db.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.IsActive = isActive;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id:int}/role")]
    public async Task<IActionResult> SetRole(int id, [FromBody] string role)
    {
        role = role.Trim();
        if (role is not ("Admin" or "Customer")) return BadRequest("Role chỉ được: Admin hoặc Customer.");

        var user = await db.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.Role = role;
        await db.SaveChangesAsync();
        return NoContent();
    }
}

