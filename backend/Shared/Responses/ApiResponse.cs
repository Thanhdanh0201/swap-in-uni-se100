namespace Shared.Responses;

/// <summary>
/// Định dạng phản hồi thành công thống nhất: { success, message, data }.
/// </summary>
public class ApiResponse<T>
{
    public bool Success { get; set; } = true;
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }

    public ApiResponse()
    {
    }

    public ApiResponse(T? data, string message = "")
    {
        Message = message;
        Data = data;
    }
}

public class ApiResponse
{
    public bool Success { get; set; } = true;
    public string Message { get; set; } = string.Empty;

    public ApiResponse()
    {
    }

    public ApiResponse(string message, bool success = true)
    {
        Success = success;
        Message = message;
    }

    public static ApiResponse<T> Ok<T>(T data, string message = "") => new(data, message);
    public static ApiResponse Ok(string message = "") => new(message);
}

public record PagedResult<T>(IReadOnlyList<T> Items, int Total, int Page, int PageSize);
