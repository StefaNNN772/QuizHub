using Microsoft.AspNetCore.Mvc;
using quizhub_backend.DTOs;
using quizhub_backend.Models;
using quizhub_backend.Services;
using System.Security.Claims;

namespace quizhub_backend.Controllers
{
    [ApiController]
    [Route("/")]
    public class QuizController : ControllerBase
    {
        private readonly QuizService _quizService;
        private readonly AnswerService _answerService;
        private readonly ResultService _resultService;

        public QuizController(QuizService quizService, AnswerService answerService, ResultService resultService)
        {
            this._quizService = quizService;
            this._answerService = answerService;
            this._resultService = resultService;
        }

        [HttpPost("quizzes")]
        [Produces("application/json")]
        public async Task<IActionResult> CreateQuiz([FromBody]QuizDTO quizDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (quizDto.Title.Length > 100 || quizDto.Description.Length > 150 || 
                (quizDto.Time < 1 || quizDto.Time > 120) || quizDto.Topics.Count() == 0)
            {
                return BadRequest();
            }

            var result = await _quizService.CreateQuiz(quizDto);

            return Ok(quizDto);
        }

        [HttpGet("quizzes")]
        [Produces("application/json")]
        public async Task<IActionResult> GetQuizzes([FromQuery] string? search = null, [FromQuery] string? difficulty = null, [FromQuery] string? topic = null)
        {
            try
            {
                var quizzes = await _quizService.GetQuizzes(search, difficulty, topic);

                return Ok(quizzes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("quizzes/{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetQuizById(long id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var quiz = await _quizService.GetQuizById(id);

                return Ok(quiz);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("quizzes/{id}/submit")]
        [Produces("application/json")]
        public async Task<IActionResult> SubmitQuizAnswers([FromBody] SubmitAnswersDTO answersDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                List<UserAnswerDTO> userAnswersDTO = new List<UserAnswerDTO>();
                double maxPoints = 0;
                double points = 0;
                long quizId = 0;

                foreach (var answer in answersDTO.Answers)
                {
                    var questionAnswers = await _answerService.GetAnswers(answer.QuestionId);
                    maxPoints += questionAnswers[0].QuestionDTO.Points;
                    quizId = questionAnswers[0].QuestionDTO.QuizId;

                    if (questionAnswers[0].QuestionDTO.Type == QuestionType.TrueOrFalse || questionAnswers[0].QuestionDTO.Type == QuestionType.OneAnswer)
                    {
                        var trueAnswer = questionAnswers.Where(a => a.IsTrue == true).Select(a => a.AnswerBody).FirstOrDefault();

                        if (trueAnswer.Equals(answer.AnswerBody))
                        {
                            userAnswersDTO.Add(new UserAnswerDTO { AnswerBody = answer.AnswerBody, QuestionId = answer.QuestionId, UserId = int.Parse(userId), IsTrue = true });
                            points += questionAnswers[0].QuestionDTO.Points;
                        }
                        else
                        {
                            userAnswersDTO.Add(new UserAnswerDTO { AnswerBody = answer.AnswerBody, QuestionId = answer.QuestionId, UserId = int.Parse(userId), IsTrue = false });
                        }
                    }
                    else if (questionAnswers[0].QuestionDTO.Type == QuestionType.FillInTheBlank)
                    {
                        var trueAnswer = questionAnswers.Where(a => a.IsTrue == true).Select(a => a.AnswerBody.ToLower()).FirstOrDefault();

                        if (trueAnswer.Equals(answer.AnswerBody.ToLower()))
                        {
                            userAnswersDTO.Add(new UserAnswerDTO { AnswerBody = answer.AnswerBody, QuestionId = answer.QuestionId, UserId = int.Parse(userId), IsTrue = true });
                            points += questionAnswers[0].QuestionDTO.Points;
                        }
                        else
                        {
                            userAnswersDTO.Add(new UserAnswerDTO { AnswerBody = answer.AnswerBody, QuestionId = answer.QuestionId, UserId = int.Parse(userId), IsTrue = false });
                        }
                    }
                    else if (questionAnswers[0].QuestionDTO.Type == QuestionType.MultipleAnswer)
                    {
                        string[] multipleAnswers = answer.AnswerBody.Split('|');

                        var trueAnswers = questionAnswers.Where(a => a.IsTrue == true).Select(a => a.AnswerBody);
                        int numOfTrueAnswers = trueAnswers.Count();
                        int numOfCorrect = 0;

                        foreach (var userAnswer in multipleAnswers)
                        {
                            if (trueAnswers.Contains(userAnswer))
                            {
                                userAnswersDTO.Add(new UserAnswerDTO { AnswerBody = userAnswer, QuestionId = answer.QuestionId, UserId = int.Parse(userId), IsTrue = true });
                                numOfCorrect += 1;
                            }
                            else
                            {
                                userAnswersDTO.Add(new UserAnswerDTO { AnswerBody = userAnswer, QuestionId = answer.QuestionId, UserId = int.Parse(userId), IsTrue = false });
                            }
                        }

                        if (numOfTrueAnswers == numOfCorrect)
                        {
                            points += questionAnswers[0].QuestionDTO.Points;
                        }
                    }
                }

                ResultDTO resultDTO = new ResultDTO
                {
                    QuizId = quizId,
                    UserId = int.Parse(userId),
                    DateOfPlay = DateTime.Now.ToString("o"),
                    Points = points,
                    MaxPoints = maxPoints
                };

                var result = await _resultService.SaveUserResult(resultDTO);

                if (result == null)
                {
                    return StatusCode(500, "Couldn't save your answers.");
                }

                var answers = await _answerService.SaveUserAnswers(userAnswersDTO, result.Id);

                if (!answers)
                {
                    return StatusCode(500, "Couldn't save your answers.");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("quizzes/{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> DeleteQuiz(long id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _quizService.DeleteQuiz(id);

                if (!result)
                {
                    return StatusCode(500, "Quiz was not deleted.");
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("quizzes/{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> UpdateQuiz(long id, [FromBody] QuizDTO quizDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if ((!String.IsNullOrEmpty(quizDto.Title) && quizDto.Title.Length > 100) || (!String.IsNullOrEmpty(quizDto.Description) && quizDto.Description.Length > 150) ||
                (quizDto.Time < 1 || quizDto.Time > 120))
            {
                return BadRequest();
            }

            var result = await _quizService.UpdateQuiz(id, quizDto);

            return Ok(result);
        }
    }
}
