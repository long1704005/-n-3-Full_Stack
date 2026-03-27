using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BanMayTinh.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BanMayTinh.Security;

public class JwtTokenService(IConfiguration config)
{
    public string CreateToken(User user)
    {
        var issuer = config["Jwt:Issuer"] ?? "BanMayTinh";
        var audience = config["Jwt:Audience"] ?? "BanMayTinh.Client";
        var key = config["Jwt:Key"] ?? throw new InvalidOperationException("Missing Jwt:Key in configuration.");

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, user.UserName),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName),
            new(ClaimTypes.Role, user.Role)
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

