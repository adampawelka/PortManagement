using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.IO;
using System.Text.Json;
using System.Net.Http;
using System.Globalization;

namespace SchedulingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchedulingController : ControllerBase
    {
        private readonly string _swiplPath;
        private readonly IHttpClientFactory _httpClientFactory;

        public SchedulingController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            _swiplPath = "swipl"; 
        }

        [HttpGet("calculate-schedule")]
        public IActionResult CalculateSchedule([FromQuery] string date, [FromQuery] string algorithm = "optimal")
        {
            try
            {
                string fileName;
                string query;

                if (algorithm.ToLower() == "heuristic")
                {
                    fileName = "alternative_heuristics.pl";
                    query = "solve_heuristic(Solution, Delay), format('Seq: ~w | Delay: ~w~n', [Solution, Delay]), halt.";
                }
                else
                {
                    fileName = "vessels_scheduling2.pl";
                    query = "obtain_seq_shortest_delay(Solution, Delay), format('Seq: ~w | Delay: ~w~n', [Solution, Delay]), halt.";
                }

                string baseDir = AppContext.BaseDirectory;
                string projectPrologPath = Path.GetFullPath(Path.Combine(baseDir, "..", "..", "..", "PrologFiles"));
                string scriptPath = Directory.Exists(projectPrologPath) 
                    ? Path.Combine(projectPrologPath, fileName) 
                    : Path.Combine(baseDir, "PrologFiles", fileName);

                scriptPath = scriptPath.Replace("\\", "/");

                if (!System.IO.File.Exists(scriptPath))
                {
                    return BadRequest(new { message = $"Prolog file not found at: {scriptPath}" });
                }

                Console.WriteLine($"Algorithm: {algorithm}");
                Console.WriteLine($"Executing File: {scriptPath}");
                Console.WriteLine($"Query: {query}");
\
                string result = RunPrologQuery(query, scriptPath);

                return Ok(new 
                { 
                    algorithm_used = algorithm,
                    file_used = fileName,
                    prolog_output = result 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error generating schedule: {ex.Message}");
            }
        }

        private string RunPrologQuery(string query, string? scriptFile = null)
        {
            using (var process = new Process())
            {
                ProcessStartInfo startInfo = new ProcessStartInfo();
                startInfo.FileName = _swiplPath;

                string args = "-q";
                if (!string.IsNullOrEmpty(scriptFile)) args += $" -f \"{scriptFile}\"";
                args += $" -g \"{query}\"";

                startInfo.Arguments = args;
                startInfo.RedirectStandardOutput = true;
                startInfo.RedirectStandardError = true;
                startInfo.UseShellExecute = false;
                startInfo.CreateNoWindow = true;

                process.StartInfo = startInfo;
                process.Start();

                string output = process.StandardOutput.ReadToEnd();
                string error = process.StandardError.ReadToEnd();

                process.WaitForExit();

                if (!string.IsNullOrEmpty(error) && string.IsNullOrEmpty(output))
                {
                    throw new Exception($"Prolog Error: {error}");
                }

                return output;
            }
        }
        
        [HttpGet("test-prolog")]
        public IActionResult TestProlog()
        {
            string prologQuery = "member(X, [apple, banana, orange]), format('~w~n', [X]), fail; halt.";
            try { return Ok(RunPrologQuery(prologQuery)); } catch (Exception ex) { return StatusCode(500, ex.Message); }
        }
    }
}