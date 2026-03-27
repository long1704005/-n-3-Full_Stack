using BanMayTinh.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BanMayTinh.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(BanMayTinhDbContext db) : ControllerBase
{
    public record ProductUpsertRequest(
        int CategoryId,
        int? BrandId,
        string Name,
        string? Slug,
        string? ShortDescription,
        string? Description,
        decimal Price,
        decimal? OriginalPrice,
        int StockQuantity,
        string? ThumbnailUrl,
        string? ImageUrl,
        bool IsFeatured,
        bool IsNew,
        bool IsBestSeller,
        bool IsActive);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll(
        [FromQuery] int? categoryId,
        [FromQuery] int? brandId,
        [FromQuery] string? keyword,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var query = db.Products
            .AsNoTracking()
            .Where(p => p.IsActive);

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId);
        }

        if (brandId.HasValue)
        {
            query = query.Where(p => p.BrandId == brandId);
        }

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            query = query.Where(p => p.Name.Contains(keyword));
        }

        return await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetById(int id)
    {
        var product = await db.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null) return NotFound();

        return product;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> Create(ProductUpsertRequest request)
    {
        var product = new Product
        {
            CategoryId = request.CategoryId,
            BrandId = request.BrandId,
            Name = request.Name,
            Slug = request.Slug,
            ShortDescription = request.ShortDescription,
            Description = request.Description,
            Price = request.Price,
            OriginalPrice = request.OriginalPrice,
            StockQuantity = request.StockQuantity,
            ThumbnailUrl = request.ThumbnailUrl,
            ImageUrl = request.ImageUrl,
            IsFeatured = request.IsFeatured,
            IsNew = request.IsNew,
            IsBestSeller = request.IsBestSeller,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        db.Products.Add(product);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, ProductUpsertRequest request)
    {
        var product = await db.Products.FindAsync(id);
        if (product == null) return NotFound();

        product.CategoryId = request.CategoryId;
        product.BrandId = request.BrandId;
        product.Name = request.Name;
        product.Slug = request.Slug;
        product.ShortDescription = request.ShortDescription;
        product.Description = request.Description;
        product.Price = request.Price;
        product.OriginalPrice = request.OriginalPrice;
        product.StockQuantity = request.StockQuantity;
        product.ThumbnailUrl = request.ThumbnailUrl;
        product.ImageUrl = request.ImageUrl;
        product.IsFeatured = request.IsFeatured;
        product.IsNew = request.IsNew;
        product.IsBestSeller = request.IsBestSeller;
        product.IsActive = request.IsActive;
        product.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await db.Products.FindAsync(id);
        if (product == null) return NotFound();

        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

