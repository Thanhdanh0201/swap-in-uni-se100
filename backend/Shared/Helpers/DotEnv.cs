namespace Shared.Helpers;

/// <summary>
/// Nạp backend/.env vào biến môi trường khi chạy dotnet run / dotnet ef trực tiếp (không qua Docker).
/// Biến đã có sẵn trong môi trường không bị ghi đè.
/// </summary>
public static class DotEnv
{
    public static void Load()
    {
        var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
        // Tìm .env ở thư mục hiện tại hoặc tối đa 2 cấp cha (chạy từ backend/ hoặc backend/Api/).
        for (var i = 0; i < 3 && dir != null; i++, dir = dir.Parent)
        {
            var path = Path.Combine(dir.FullName, ".env");
            if (!File.Exists(path)) continue;

            foreach (var line in File.ReadAllLines(path))
            {
                var trimmed = line.Trim();
                if (trimmed.Length == 0 || trimmed.StartsWith('#')) continue;
                var parts = trimmed.Split('=', 2);
                if (parts.Length == 2 && Environment.GetEnvironmentVariable(parts[0].Trim()) == null)
                    Environment.SetEnvironmentVariable(parts[0].Trim(), parts[1].Trim());
            }
            return;
        }
    }
}
