namespace Shared.Exceptions;

/// <summary>
/// Lỗi nghiệp vụ có mã HTTP và mã lỗi (<c>code</c>) riêng, để frontend phân biệt mà không phải so chuỗi detail.
/// GlobalExceptionMiddleware chuyển thành ProblemDetails: status, title, detail, code và các extension.
/// Message phải là tiếng Việt, đọc được bởi người dùng cuối, không chứa chi tiết kỹ thuật.
/// </summary>
public class AppException : Exception
{
    public int StatusCode { get; }
    public string Code { get; }
    public string Title { get; }
    public IReadOnlyDictionary<string, object?> Extensions { get; }

    public AppException(int statusCode, string code, string title, string detail, IReadOnlyDictionary<string, object?>? extensions = null)
        : base(detail)
    {
        StatusCode = statusCode;
        Code = code;
        Title = title;
        Extensions = extensions ?? new Dictionary<string, object?>();
    }

    public static AppException NotFound(string detail) => new(404, "not_found", "Không tìm thấy", detail);
    public static AppException Forbidden(string detail) => new(403, "forbidden", "Không có quyền", detail);
    public static AppException Conflict(string code, string detail) => new(409, code, "Thao tác không hợp lệ", detail);
}
