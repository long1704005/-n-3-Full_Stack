using System.Security.Cryptography;
using System.Text;

namespace BanMayTinh.Security;

public static class PasswordHasher
{
    private const int SaltSize = 16; // 128-bit
    private const int KeySize = 32;  // 256-bit
    private const int Iterations = 100_000;

    // Format: pbkdf2$<iterations>$<saltBase64>$<hashBase64>
    public static string Hash(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            Iterations,
            HashAlgorithmName.SHA256,
            KeySize);

        return $"pbkdf2${Iterations}${Convert.ToBase64String(salt)}${Convert.ToBase64String(hash)}";
    }

    public static bool Verify(string password, string stored)
    {
        if (string.IsNullOrWhiteSpace(stored)) return false;

        // Tài khoản đăng ký phiên bản cũ (SHA256 hex, không có dấu $)
        if (!stored.Contains('$', StringComparison.Ordinal))
        {
            return VerifyLegacySha256Hex(password, stored);
        }

        var parts = stored.Split('$');
        if (parts.Length != 4) return false;
        if (!string.Equals(parts[0], "pbkdf2", StringComparison.OrdinalIgnoreCase)) return false;
        if (!int.TryParse(parts[1], out var iterations)) return false;

        byte[] salt;
        byte[] expected;
        try
        {
            salt = Convert.FromBase64String(parts[2]);
            expected = Convert.FromBase64String(parts[3]);
        }
        catch
        {
            return false;
        }

        var actual = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            iterations,
            HashAlgorithmName.SHA256,
            expected.Length);

        return CryptographicOperations.FixedTimeEquals(actual, expected);
    }

    private static bool VerifyLegacySha256Hex(string password, string storedHex)
    {
        if (storedHex.Length != 64) return false;
        foreach (var c in storedHex)
        {
            var ok = (c is >= '0' and <= '9') || (c is >= 'a' and <= 'f') || (c is >= 'A' and <= 'F');
            if (!ok) return false;
        }

        using var sha = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha.ComputeHash(bytes);
        var hex = Convert.ToHexString(hash);
        return string.Equals(hex, storedHex, StringComparison.OrdinalIgnoreCase);
    }
}

