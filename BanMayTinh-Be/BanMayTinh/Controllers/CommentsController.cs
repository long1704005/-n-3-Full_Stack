using BanMayTinh.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BanMayTinh.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController(BanMayTinhDbContext db) : ControllerBase
{
    public record CreateCommentRequest(int ProductId, int Rating, string? Content);

    [HttpGet("product/{productId:int}")]
    public async Task<ActionResult<IEnumerable<Comment>>> GetByProduct(int productId)
    {
        var comments = await db.Comments
            .AsNoTracking()
            .Where(c => c.ProductId == productId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        if (comments.Count == 0) return Ok(Array.Empty<Comment>());
        return comments;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Comment>> Create(CreateCommentRequest request)
    {
        if (request.Rating is < 1 or > 5)
        {
            return BadRequest("Rating phải từ 1 đến 5.");
        }

        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var productExists = await db.Products.AnyAsync(p => p.Id == request.ProductId && p.IsActive);
        if (!productExists)
        {
            return BadRequest("Sản phẩm không tồn tại hoặc đã bị khóa.");
        }

        var comment = new Comment
        {
            ProductId = request.ProductId,
            UserId = userId,
            Rating = request.Rating,
            Content = string.IsNullOrWhiteSpace(request.Content) ? null : request.Content.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        db.Comments.Add(comment);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetByProduct), new { productId = comment.ProductId }, comment);
    }
}

