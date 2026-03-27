using BanMayTinh.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BanMayTinh.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(BanMayTinhDbContext db) : ControllerBase
{
    public record CategoryUpsertRequest(string Name, string? Slug, string? Description, bool IsActive);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetAll()
    {
        return await db.Categories
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Category>> GetById(int id)
    {
        var category = await db.Categories.FindAsync(id);
        if (category == null) return NotFound();
        return category;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Category>> Create(CategoryUpsertRequest request)
    {
        var category = new Category
        {
            Name = request.Name,
            Slug = request.Slug,
            Description = request.Description,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow
        };
        db.Categories.Add(category);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CategoryUpsertRequest request)
    {
        var category = await db.Categories.FindAsync(id);
        if (category == null) return NotFound();

        category.Name = request.Name;
        category.Slug = request.Slug;
        category.Description = request.Description;
        category.IsActive = request.IsActive;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await db.Categories.FindAsync(id);
        if (category == null) return NotFound();

        db.Categories.Remove(category);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

