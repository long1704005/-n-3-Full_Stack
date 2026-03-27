using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BanMayTinh.Models;

public class Order
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    [MaxLength(50)]
    public string Status { get; set; } = "Pending";

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    [Required, MaxLength(500)]
    public string ShippingAddress { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Note { get; set; }

    [MaxLength(50)]
    public string? PaymentMethod { get; set; }

    [MaxLength(50)]
    public string? PaymentStatus { get; set; }

    public User? User { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

