# ==========================================
# Stage 1: Build & Publish (.NET 10)
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Shared/Shared.csproj", "Shared/"]
COPY ["Data/Data.csproj", "Data/"]
COPY ["Business/Business.csproj", "Business/"]
COPY ["Api/Api.csproj", "Api/"]
RUN dotnet restore "Api/Api.csproj"

COPY Shared/ Shared/
COPY Data/ Data/
COPY Business/ Business/
COPY Api/ Api/

WORKDIR "/src/Api"
RUN dotnet publish "Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ==========================================
# Stage 2: Runtime
# ==========================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
EXPOSE 5180
ENV ASPNETCORE_URLS=http://+:5180
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Api.dll"]
