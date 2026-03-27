using System.ComponentModel.DataAnnotations;

namespace BanMayTinh.Models;

public class Comment
{
    public int Id { get; set; }

    [Required]
    public int ProductId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }

    [MaxLength(1000)]
    public string? Content { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Product? Product { get; set; }
    public User? User { get; set; }
}

