using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Presentation.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class StatsController(PublicStatsService service) : ControllerBase
{
    [HttpGet("public")]
    public async Task<ActionResult<PublicStatsDto>> GetPublic(CancellationToken ct)
        => Ok(await service.GetAsync(ct));
}
