using BanMayTinh.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BanMayTinh.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandsController(BanMayTinhDbContext db) : ControllerBase
{
    public record BrandUpsertRequest(string Name, string? Slug, string? Description, bool IsActive);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Brand>>> GetAll()
    {
        return await db.Brands
            .AsNoTracking()
            .OrderBy(b => b.Name)
            .ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Brand>> GetById(int id)
    {
        var brand = await db.Brands.FindAsync(id);
        if (brand == null) return NotFound();
        return brand;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Brand>> Create(BrandUpsertRequest request)
    {
        var brand = new Brand
        {
            Name = request.Name,
            Slug = request.Slug,
            Description = request.Description,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow
        };
        db.Brands.Add(brand);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = brand.Id }, brand);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, BrandUpsertRequest request)
    {
        var brand = await db.Brands.FindAsync(id);
        if (brand == null) return NotFound();

        brand.Name = request.Name;
        brand.Slug = request.Slug;
        brand.Description = request.Description;
        brand.IsActive = request.IsActive;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var brand = await db.Brands.FindAsync(id);
        if (brand == null) return NotFound();

        db.Brands.Remove(brand);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

