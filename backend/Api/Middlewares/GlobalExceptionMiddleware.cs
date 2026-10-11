using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Shared.Exceptions;

namespace Api.Middlewares;

/// <summary>
/// Middleware bắt lỗi tập trung và chuyển đổi thành định dạng chuẩn RFC 7807 ProblemDetails 
/// Đảm bảo không để lộ thông tin nhạy cảm của database và hạ tầng ra phía client.
/// </summary>
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public GlobalExceptionMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionMiddleware> logger,
        IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            if (ex is AppException appEx && appEx.StatusCode < 500)
            {
                _logger.LogInformation("Từ chối yêu cầu {Path}: {Code} ({Status})", context.Request.Path, appEx.Code, appEx.StatusCode);
            }
            else
            {
                _logger.LogError(ex, "Đã xảy ra ngoại lệ chưa được xử lý tại đường dẫn: {Path}", context.Request.Path);
            }
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/problem+json";

        var problemDetails = new ProblemDetails
        {
            Instance = context.Request.Path,
            Extensions =
            {
                ["traceId"] = context.TraceIdentifier
            }
        };

        switch (exception)
        {
            case BadHttpRequestException badRequestEx when badRequestEx.StatusCode == StatusCodes.Status413PayloadTooLarge:
                context.Response.StatusCode = StatusCodes.Status413PayloadTooLarge;
                problemDetails.Status = StatusCodes.Status413PayloadTooLarge;
                problemDetails.Title = "File quá lớn";
                problemDetails.Detail = "File vượt quá giới hạn 10 MB. Hãy nén hoặc chọn file nhỏ hơn.";
                problemDetails.Extensions["code"] = "file_too_large";
                break;

            case AppException appEx:
                // Lỗi nghiệp vụ có mã HTTP + code riêng (413 file quá lớn, 415 sai loại, 409 media đang dùng, 403 không phải chủ sở hữu...)
                context.Response.StatusCode = appEx.StatusCode;
                problemDetails.Status = appEx.StatusCode;
                problemDetails.Title = appEx.Title;
                problemDetails.Detail = appEx.Message;
                problemDetails.Extensions["code"] = appEx.Code;
                foreach (var (key, value) in appEx.Extensions)
                {
                    problemDetails.Extensions[key] = value;
                }
                break;

            case ValidationException validationEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                problemDetails.Status = StatusCodes.Status400BadRequest;
                problemDetails.Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1";
                problemDetails.Title = "Dữ liệu yêu cầu không hợp lệ";
                problemDetails.Detail = "Một hoặc nhiều trường thông tin không thỏa mãn quy tắc kiểm tra.";

                var errors = new Dictionary<string, List<string>>();
                foreach (var error in validationEx.Errors)
                {
                    if (!errors.ContainsKey(error.PropertyName))
                    {
                        errors[error.PropertyName] = new List<string>();
                    }
                    errors[error.PropertyName].Add(error.ErrorMessage);
                }
                problemDetails.Extensions["errors"] = errors;
                break;

            case ArgumentException argumentEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                problemDetails.Status = StatusCodes.Status400BadRequest;
                problemDetails.Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1";
                problemDetails.Title = "Tham số yêu cầu không hợp lệ";
                problemDetails.Detail = argumentEx.Message;
                break;

            case KeyNotFoundException keyNotFoundEx:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                problemDetails.Status = StatusCodes.Status404NotFound;
                problemDetails.Type = "https://tools.ietf.org/html/rfc7231#section-6.5.4";
                problemDetails.Title = "Không tìm thấy tài nguyên";
                problemDetails.Detail = keyNotFoundEx.Message;
                break;

            case UnauthorizedAccessException unauthorizedEx:
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                problemDetails.Status = StatusCodes.Status401Unauthorized;
                problemDetails.Type = "https://tools.ietf.org/html/rfc7235#section-3.1";
                problemDetails.Title = "Yêu cầu xác thực tài khoản";
                problemDetails.Detail = unauthorizedEx.Message;
                break;

            case InvalidOperationException invalidOpEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                problemDetails.Status = StatusCodes.Status400BadRequest;
                problemDetails.Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1";
                problemDetails.Title = "Thao tác không hợp lệ";
                problemDetails.Detail = invalidOpEx.Message;
                break;

            default:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                problemDetails.Status = StatusCodes.Status500InternalServerError;
                problemDetails.Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1";
                problemDetails.Title = "Lỗi máy chủ nội bộ";
                problemDetails.Detail = _env.IsDevelopment()
                    ? exception.Message
                    : "Đã xảy ra sự cố kỹ thuật trên hệ thống. Vui lòng liên hệ quản trị viên với mã vết để được hỗ trợ.";
                break;
        }

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };

        var responseJson = JsonSerializer.Serialize(problemDetails, jsonOptions);
        await context.Response.WriteAsync(responseJson);
    }
}
