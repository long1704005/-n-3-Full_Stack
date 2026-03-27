using BanMayTinh.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BanMayTinh.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController(BanMayTinhDbContext db) : ControllerBase
{
    public record OrderItemDto(int ProductId, int Quantity, int DiscountPercent);
    public record CreateOrderRequest(
        int UserId,
        string ShippingAddress,
        string Phone,
        string? Note,
        string? PaymentMethod,
        List<OrderItemDto> Items);

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetAll()
    {
        return await db.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .AsNoTracking()
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Order>> GetById(int id)
    {
        var order = await db.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) return NotFound();

        return order;
    }

    [HttpPost]
    public async Task<ActionResult<Order>> Create(CreateOrderRequest request)
    {
        if (request.Items.Count == 0)
        {
            return BadRequest("Đơn hàng phải có ít nhất 1 sản phẩm.");
        }

        var userExists = await db.Users.AnyAsync(u => u.Id == request.UserId && u.IsActive);
        if (!userExists) return BadRequest("UserId không hợp lệ.");

        var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = await db.Products
            .Where(p => productIds.Contains(p.Id) && p.IsActive)
            .Select(p => new { p.Id, p.Price, p.StockQuantity })
            .ToListAsync();

        if (products.Count != productIds.Count)
        {
            return BadRequest("Có sản phẩm không tồn tại hoặc đã bị khóa.");
        }

        var order = new Order
        {
            UserId = request.UserId,
            ShippingAddress = request.ShippingAddress,
            Phone = request.Phone,
            Note = request.Note,
            PaymentMethod = request.PaymentMethod,
            Status = "Pending",
            OrderDate = DateTime.UtcNow
        };

        decimal total = 0;

        foreach (var item in request.Items)
        {
            if (item.Quantity <= 0) return BadRequest("Số lượng phải > 0.");
            if (item.DiscountPercent is < 0 or > 100) return BadRequest("DiscountPercent không hợp lệ.");

            var p = products.First(x => x.Id == item.ProductId);
            if (p.StockQuantity < item.Quantity)
            {
                return BadRequest($"Sản phẩm {item.ProductId} không đủ tồn kho.");
            }

            var orderItem = new OrderItem
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = p.Price,
                DiscountPercent = item.DiscountPercent
            };

            total += p.Price * item.Quantity * (100 - item.DiscountPercent) / 100m;
            order.Items.Add(orderItem);
        }

        order.TotalAmount = total;

        db.Orders.Add(order);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var order = await db.Orders.FindAsync(id);
        if (order == null) return NotFound();

        status = status.Trim();
        if (string.IsNullOrWhiteSpace(status)) return BadRequest("Status không hợp lệ.");

        order.Status = status;
        await db.SaveChangesAsync();

        return NoContent();
    }
}

