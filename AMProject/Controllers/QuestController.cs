using Microsoft.AspNetCore.Mvc;

namespace AMProject.Controllers;

[ApiController]
public class QuestController : Controller
{
    [HttpGet("GetQuests")]
    public ActionResult<List<QuestModel>> GetQuests()
    {
        var quests = new List<QuestModel>();
        var rng = new Random();
        
        for (int i = 0; i < 10; i++)
        {
            quests.Add(new QuestModel
            {
                Id = i,
                Lat = rng.NextDouble() + 49,
                Long = rng.NextDouble() + 17.5,
                Question = "Are you happy?",
                Answer = "yes"
            });
        }

        return Ok(Json(quests));
    }
}