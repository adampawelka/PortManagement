using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.IO;
using System.Text.Json; // Importante para JSON
using System.Net.Http;
using System.IO;
using System.Globalization;
using System.Linq;


using DDDSample1.Domain.VesselVisitNotifications;
using DDDSample1.Domain.Docks;
using DDDSample1.Domain.StaffMembers;
using DDDSample1.Domain.Resources;




namespace SchedulingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchedulingController : ControllerBase
    {
        private readonly string _scriptPath;
        private readonly string _alternativeScriptPath;
        private readonly string _sptScriptPath;
        private readonly string _dynamicMstScriptPath;
        private readonly string _hillClimbingScriptPath;
        private readonly string _swiplPath;
        private readonly IHttpClientFactory _httpClientFactory;


        public SchedulingController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;


            _swiplPath = "swipl";
            Console.WriteLine($"SWI-Prolog path: {_swiplPath}");

            string baseDir = AppContext.BaseDirectory;

            // Try to locate Prolog file in source folder relative to project
            string sourcePath = Path.Combine(baseDir, "..", "..", "..", "PrologFiles", "vessels_scheduling1.pl");
            sourcePath = Path.GetFullPath(sourcePath).Replace("\\", "/");

            // If file exists in source folder, use it; otherwise fallback to baseDir
            _scriptPath = System.IO.File.Exists(sourcePath)
                ? sourcePath
                : Path.Combine(baseDir, "PrologFiles", "scheduling_vessels_1.pl");
            _scriptPath = Path.GetFullPath(_scriptPath).Replace("\\", "/");

            Console.WriteLine($"Prolog script path: {_scriptPath}");

            if (!System.IO.File.Exists(_scriptPath))
                throw new Exception($"Prolog script not found at {_scriptPath}");

            // Initialize alternative heuristic script path 
            string altSourcePath = Path.Combine(baseDir, "..", "..", "..", "PrologFiles", "alternative_heuristics.pl");
            altSourcePath = Path.GetFullPath(altSourcePath).Replace("\\", "/");

            _alternativeScriptPath = System.IO.File.Exists(altSourcePath)
                ? altSourcePath
                : Path.Combine(baseDir, "PrologFiles", "alternative_heuristics.pl");
            _alternativeScriptPath = Path.GetFullPath(_alternativeScriptPath).Replace("\\", "/");

            Console.WriteLine($"Alternative Prolog script path: {_alternativeScriptPath}");

            if (!System.IO.File.Exists(_alternativeScriptPath))
                throw new Exception($"Alternative Prolog script not found at {_alternativeScriptPath}");

            // Initialize SPT script path
            string sptSourcePath = Path.Combine(baseDir, "..", "..", "..", "PrologFiles", "spt.pl");
            sptSourcePath = Path.GetFullPath(sptSourcePath).Replace("\\", "/");

            _sptScriptPath = System.IO.File.Exists(sptSourcePath)
                ? sptSourcePath
                : Path.Combine(baseDir, "PrologFiles", "spt.pl");
            _sptScriptPath = Path.GetFullPath(_sptScriptPath).Replace("\\", "/");

            Console.WriteLine($"SPT Prolog script path: {_sptScriptPath}");

            if (!System.IO.File.Exists(_sptScriptPath))
                throw new Exception($"SPT Prolog script not found at {_sptScriptPath}");

            // Initialize Dynamic MST script path
            string dynamicMstSourcePath = Path.Combine(baseDir, "..", "..", "..", "PrologFiles", "dynamic_mst.pl");
            dynamicMstSourcePath = Path.GetFullPath(dynamicMstSourcePath).Replace("\\", "/");

            _dynamicMstScriptPath = System.IO.File.Exists(dynamicMstSourcePath)
                ? dynamicMstSourcePath
                : Path.Combine(baseDir, "PrologFiles", "dynamic_mst.pl");
            _dynamicMstScriptPath = Path.GetFullPath(_dynamicMstScriptPath).Replace("\\", "/");

            Console.WriteLine($"Dynamic MST Prolog script path: {_dynamicMstScriptPath}");

            if (!System.IO.File.Exists(_dynamicMstScriptPath))
                throw new Exception($"Dynamic MST Prolog script not found at {_dynamicMstScriptPath}");

            // Initialize Hill Climbing script path
            string hillClimbingSourcePath = Path.Combine(baseDir, "..", "..", "..", "PrologFiles", "hill_climbing_heuristic.pl");
            hillClimbingSourcePath = Path.GetFullPath(hillClimbingSourcePath).Replace("\\", "/");

            _hillClimbingScriptPath = System.IO.File.Exists(hillClimbingSourcePath)
                ? hillClimbingSourcePath
                : Path.Combine(baseDir, "PrologFiles", "hill_climbing_heuristic.pl");
            _hillClimbingScriptPath = Path.GetFullPath(_hillClimbingScriptPath).Replace("\\", "/");

            Console.WriteLine($"Hill Climbing Prolog script path: {_hillClimbingScriptPath}");

            if (!System.IO.File.Exists(_hillClimbingScriptPath))
                throw new Exception($"Hill Climbing Prolog script not found at {_hillClimbingScriptPath}");

        }

        [HttpGet("test-prolog")]
        public IActionResult TestProlog()
        {
            // --- Esta será la consulta de prueba ---
            // 1. member(X, [apple, banana, orange]): Busca un miembro X en la lista.
            // 2. format('~w~n', [X]): Imprime el valor de X y un salto de línea.
            // 3. fail: Fuerza a Prolog a buscar la siguiente solución (backtracking).
            // 4. halt: Detiene el motor.
            string prologQuery = "member(X, [apple, banana, orange]), format('~w~n', [X]), fail; halt.";

            try
            {
                string result = RunPrologQuery(prologQuery);

                // El resultado será un string "apple\nbanana\norange\n"
                // Lo separamos en una lista para devolverlo como JSON
                var resultsList = result.Split('\n', StringSplitOptions.RemoveEmptyEntries);

                return Ok(resultsList); // Devuelve [ "apple", "banana", "orange" ]
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error ejecutando Prolog: {ex.Message}");
            }
        }


        [HttpGet("test-api-call")]
        public async Task<IActionResult> TestApiCall()
        {
            // 1. Asume que tu BackendAPI está en el puerto 5000. 
            //    ¡CAMBIA ESTE NÚMERO si tu BackendAPI usa otro puerto!
            //    También asegúrate de que /api/Docks exista.
            string backendApiUrl = "http://localhost:5000/api/Docks";

            try
            {
                // 2. Creamos un cliente HTTP para hacer la llamada
                var client = _httpClientFactory.CreateClient();

                // 3. Hacemos la llamada GET
                var response = await client.GetAsync(backendApiUrl);

                if (response.IsSuccessStatusCode)
                {
                    // 4. Leemos la respuesta (que será un JSON)
                    var content = await response.Content.ReadAsStringAsync();
                    return Ok(new
                    {
                        message = "¡Éxito! Conectado al BackendAPI.",
                        dataReceived = content
                    });
                }
                else
                {
                    return StatusCode((int)response.StatusCode,
                        $"Error: No se pudo conectar al BackendAPI. Código: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                // Esto pasa si el BackendAPI está apagado o la URL es incorrecta
                return StatusCode(500, $"Error de conexión: {ex.Message}");
            }
        }




        [HttpGet("calculate-schedule")]
        public async Task<IActionResult> CalculateSchedule([FromQuery] string date, [FromQuery] string algorithm = "bruteforce")
        {

            if (!DateTime.TryParse(date, null, DateTimeStyles.RoundtripKind, out var targetDate))
            {
                return BadRequest(new { message = "Invalid date format. Expected ISO 8601." });
            }
            try
            {
                // Fetch vessels from the VesselVisitNotifications API
                var client = _httpClientFactory.CreateClient();
                var response = await client.GetAsync("http://localhost:5000/api/VesselVisitNotifications");
                response.EnsureSuccessStatusCode();
                var vessels = await response.Content.ReadFromJsonAsync<List<VesselVisitNotificationDto>>();

                if (vessels == null)
                    return BadRequest(new { message = "No vessels received from the API." });


                // Filter only approved vessels that are assigned to a dock
                var approvedVessels = vessels
                    .Where(v => v.Status == "Approved" && v.AssignedDockId.HasValue)
                    .ToList();

                if (!approvedVessels.Any())
                    return BadRequest(new { message = "No approved vessels assigned to any dock." });

                // Group vessels by dock
                var dockGroups = approvedVessels
                    .GroupBy(v => v.AssignedDockId)
                    .ToList();



                // fetching resources
                // var resourceResponse = await client.GetAsync("http://localhost:5000/api/Resources");
                // resourceResponse.EnsureSuccessStatusCode();
                // var allResources = await resourceResponse.Content.ReadFromJsonAsync<List<ResourceDto>>();

                // if (allResources == null)
                //     return BadRequest(new { message = "No resources received from the API." });

                // Filter available cranes (type = Crane, status = Active, no assigned dock)
                // var availableCranes = allResources
                //     .Where(r => r.Type == "Crane" && r.Status == "Active")
                //     .ToList();

                // if (!availableCranes.Any())
                //     return BadRequest(new { message = "No available active cranes." });

                // Fetch all staff
                //var staffResponse = await client.GetAsync("http://localhost:5000/api/Staff");
                //staffResponse.EnsureSuccessStatusCode();
                //var allStaff = await staffResponse.Content.ReadFromJsonAsync<List<StaffDto>>();



                var dockSchedules = new Dictionary<string, object>();

                foreach (var dockGroup in dockGroups)
                {
                    // Convert nullable GUID to string or "unknown"
                    var dockId = dockGroup.Key.HasValue ? dockGroup.Key.Value.ToString() : "unknown";

                    var dockResponse = await client.GetAsync("http://localhost:5000/api/Docks/" + dockId);
                    dockResponse.EnsureSuccessStatusCode();
                    var dock = await dockResponse.Content.ReadFromJsonAsync<DockDto>();

                    if (dock == null)
                        return BadRequest(new { message = "No dock received from the API." });

                    // Filter vessels arriving on the requested date
                    var vesselsForDate = dockGroup
                        .Where(v => v.ETA.Date == targetDate.Date)
                        .ToList();

                    if (!vesselsForDate.Any())
                        continue;

                    // Prepare Prolog facts - Calculate load/unload time based on container count
                    string facts = string.Join(Environment.NewLine, vesselsForDate.Select(v =>
                    {
                        // Calculate load/unload time based on number of containers
                        int containerCount = v.CargoManifests?.Sum(m => m.ContainerIdentifiers?.Count ?? 0) ?? 0;

                        // Formula: 2 hours base time + 2 hours per container
                        int loadTime = 2 + (containerCount * 2);
                        int unloadTime = 2 + (containerCount * 2);

                        int etaHour = v.ETA.Minute >= 30 ? v.ETA.Hour + 1 : v.ETA.Hour;
                        int etdHour = v.ETD.Minute >= 30 ? v.ETD.Hour + 1 : v.ETD.Hour;

                        string vesselName = v.VesselName.ToLower().Replace(" ", "_");

                        return $"asserta(vessel({vesselName}, {etaHour}, {etdHour}, {unloadTime}, {loadTime})),";
                    }
                    ));

                    Console.WriteLine($"{facts}");

                    // Select script and query based on algorithm parameter
                    string scriptToUse;
                    string query;
                    string algorithmLower = algorithm.ToLower();

                    if (algorithmLower == "heuristic" || algorithmLower == "edt")
                    {
                        // Use EDT Heuristic (Early Departure Time)
                        scriptToUse = _alternativeScriptPath;
                        query = $"{facts} solve_heuristic(Solution, _Delay), format('~w~n', [Solution]), nl, halt.";
                        Console.WriteLine($"Using EDT Heuristic algorithm");
                    }
                    else if (algorithmLower == "spt")
                    {
                        // Use SPT (Shortest Processing Time)
                        scriptToUse = _sptScriptPath;
                        query = $"{facts} solve_spt(Solution, _Delay), format('~w~n', [Solution]), nl, halt.";
                        Console.WriteLine($"Using SPT algorithm");
                    }
                    else if (algorithmLower == "dynamic_mst" || algorithmLower == "mst")
                    {
                        // Use Dynamic MST (Minimum Slack Time)
                        scriptToUse = _dynamicMstScriptPath;
                        query = $"{facts} solve_dynamic_mst(Solution, _Delay), format('~w~n', [Solution]), nl, halt.";
                        Console.WriteLine($"Using Dynamic MST algorithm");
                    }
                    else
                    {
                        // Use Brute Force (default)
                        scriptToUse = _scriptPath;
                        query = $"{facts} obtain_seq_shortest_delay(Solution, _Delay), format('~w~n', [Solution]), nl, halt.";
                        Console.WriteLine($"Using Brute Force algorithm");
                    }

                    Console.WriteLine($"{query}");

                    // Execute Prolog query
                    string result = RunPrologQuery(query, scriptToUse);

                    Console.WriteLine($"{result}");

                    var craneRandom = new Random();

                    // Pick a random crane for this dock
                    //var crane = availableCranes[craneRandom.Next(availableCranes.Count)];
                    //var requiredQualifications = crane.Qualifications; // List<Guid>

                    //                 var qualifiedStaff = allStaff
                    //                  .Where(staff => requiredQualifications
                    //                  .All(req => staff.Qualifications.Any(sq => sq.Id == req)))
                    //                  .ToList();




                    dockSchedules[dockId] = new
                    {
                        schedule = result,
                        dock = dock.DockName,
                        crane = "to-add", // availableCranes.ResourceName;
                        allstaff = "to-add", // staff.MecanographicNumber
                        area = "to-add" // area.Name
                    };
                    //availableCranes.Remove(crane);

                }

                if (!dockSchedules.Any())
                    return BadRequest(new { message = "No vessels arriving on the selected date for any dock." });

                return Ok(dockSchedules);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error generating schedule: {ex.Message}");
            }
        }

        [HttpGet("test-algorithms")]
        public IActionResult TestAlgorithms([FromQuery] string algorithm = "bruteforce")
        {
            try
            {
                // Hardcoded test data from dynamic_mst.pl (lines 15-24)
                string facts = string.Join(Environment.NewLine, new[]
                {
                    "asserta(vessel(va, 6, 63, 10, 16)),",
                    "asserta(vessel(vb, 23, 50, 9, 7)),",
                    "asserta(vessel(vc, 8, 40, 5, 12)),",
                    "asserta(vessel(vd, 27, 40, 0, 8)),",
                    "asserta(vessel(ve, 36, 70, 12, 0)),",
                    "asserta(vessel(vf, 40, 60, 8, 6)),",
                    "asserta(vessel(vg, 52, 80, 9, 10)),",
                    "asserta(vessel(vi, 61, 90, 13, 8)),",
                    "asserta(vessel(vj, 74, 100, 7, 7)),",
                    //"asserta(vessel(vk, 81, 110, 6, 8)),"
                });

                // Select script and query based on algorithm parameter
                string scriptToUse;
                string queryPredicate;
                string algorithmNameForLog;

                switch (algorithm.ToLower())
                {
                    case "heuristic":
                    case "edt":
                        scriptToUse = _alternativeScriptPath;
                        queryPredicate = "solve_heuristic(Solution, TotalDelay)";
                        algorithmNameForLog = "EDT Heuristic";
                        break;
                    case "spt":
                        scriptToUse = _sptScriptPath;
                        queryPredicate = "solve_spt(Solution, TotalDelay)";
                        algorithmNameForLog = "SPT Heuristic";
                        break;
                    case "dynamic_mst":
                    case "mst":
                        scriptToUse = _dynamicMstScriptPath;
                        queryPredicate = "solve_dynamic_mst(Solution, TotalDelay)";
                        algorithmNameForLog = "Dynamic MST Heuristic";
                        break;
                    case "hill_climbing":
                    case "hillclimbing":
                        scriptToUse = _hillClimbingScriptPath;
                        queryPredicate = "solve_hill_climbing(Solution, TotalDelay)";
                        algorithmNameForLog = "Hill Climbing";
                        break;
                    case "bruteforce":
                    default:
                        scriptToUse = _scriptPath;
                        queryPredicate = "obtain_seq_shortest_delay(Solution, TotalDelay)";
                        algorithmNameForLog = "Brute Force";
                        break;
                }

                Console.WriteLine($"Testing {algorithmNameForLog} algorithm with hardcoded data");

                string query = $"{facts} {queryPredicate}, format('~w~n', [Solution]), format('TotalDelay:~w~n', [TotalDelay]), nl, halt.";

                // Execute Prolog query
                string result = RunPrologQuery(query, scriptToUse);

                Console.WriteLine($"Result: {result}");

                // Extract execution time from result - handle scientific notation
                string executionTime = "N/A";
                // Pattern to match numbers including scientific notation (e.g., 9.274482727050781e-5)
                string scientificNotationPattern = @"([\d.]+(?:[eE][+-]?\d+)?)";

                if (result.Contains("Execution Time:"))
                {
                    var timeMatch = System.Text.RegularExpressions.Regex.Match(result, @"Execution Time:\s*" + scientificNotationPattern);
                    if (timeMatch.Success)
                    {
                        executionTime = timeMatch.Groups[1].Value;
                    }
                }
                else if (result.Contains("SPT Execution Time:"))
                {
                    var timeMatch = System.Text.RegularExpressions.Regex.Match(result, @"SPT Execution Time:\s*" + scientificNotationPattern);
                    if (timeMatch.Success)
                    {
                        executionTime = timeMatch.Groups[1].Value;
                    }
                }
                else if (result.Contains("Dynamic MST Execution Time:"))
                {
                    var timeMatch = System.Text.RegularExpressions.Regex.Match(result, @"Dynamic MST Execution Time:\s*" + scientificNotationPattern);
                    if (timeMatch.Success)
                    {
                        executionTime = timeMatch.Groups[1].Value;
                    }
                }
                else if (result.Contains("EDT Execution Time:") || result.Contains("Heuristic Execution Time:"))
                {
                    var timeMatch = System.Text.RegularExpressions.Regex.Match(result, @"(?:EDT|Heuristic) Execution Time:\s*" + scientificNotationPattern);
                    if (timeMatch.Success)
                    {
                        executionTime = timeMatch.Groups[1].Value;
                    }
                }
                else if (result.Contains("Hill Climbing Execution Time:"))
                {
                    var timeMatch = System.Text.RegularExpressions.Regex.Match(result, @"Hill Climbing Execution Time:\s*" + scientificNotationPattern);
                    if (timeMatch.Success)
                    {
                        executionTime = timeMatch.Groups[1].Value;
                    }
                }

                // Extract total delay
                string totalDelay = "N/A";
                if (result.Contains("TotalDelay:"))
                {
                    var delayMatch = System.Text.RegularExpressions.Regex.Match(result, @"TotalDelay:(\d+)");
                    if (delayMatch.Success)
                    {
                        totalDelay = delayMatch.Groups[1].Value;
                    }
                }

                // Extract sequence (remove execution time and delay lines)
                string sequence = result;
                sequence = System.Text.RegularExpressions.Regex.Replace(sequence, @".*Execution Time:.*\n", "");
                sequence = System.Text.RegularExpressions.Regex.Replace(sequence, @".*SPT Execution Time:.*\n", "");
                sequence = System.Text.RegularExpressions.Regex.Replace(sequence, @".*Dynamic MST Execution Time:.*\n", "");
                sequence = System.Text.RegularExpressions.Regex.Replace(sequence, @".*EDT Execution Time:.*\n", "");
                sequence = System.Text.RegularExpressions.Regex.Replace(sequence, @".*Heuristic Execution Time:.*\n", "");
                sequence = System.Text.RegularExpressions.Regex.Replace(sequence, @".*Hill Climbing Execution Time:.*\n", "");
                sequence = System.Text.RegularExpressions.Regex.Replace(sequence, @".*Initial EDT Delay:.*\n", "");
                sequence = System.Text.RegularExpressions.Regex.Replace(sequence, @".*Improved Found!.*\n", "");
                sequence = System.Text.RegularExpressions.Regex.Replace(sequence, @".*TotalDelay:.*\n", "");
                sequence = sequence.Trim();

                return Ok(new
                {
                    algorithm = algorithmNameForLog,
                    executionTime = executionTime,
                    totalDelay = totalDelay,
                    sequence = sequence,
                    rawResult = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error testing algorithm: {ex.Message}");
            }
        }


        /// <summary>
        /// Función principal que ejecuta un comando en SWI-Prolog.
        /// </summary>
        private string RunPrologQuery(string query, string? scriptFile = null)
        {
            using (var process = new Process())
            {
                ProcessStartInfo startInfo = new ProcessStartInfo();
                startInfo.FileName = _swiplPath; // El comando "swipl"

                // Construimos los argumentos
                // -q (modo silencioso)
                // -f [scriptFile] (carga un script)
                // -g "[query]" (ejecuta una consulta)
                string args = "-q";
                if (!string.IsNullOrEmpty(scriptFile))
                {
                    args += $" -f \"{scriptFile}\"";
                }
                args += $" -g \"{query}\"";

                startInfo.Arguments = args;
                startInfo.RedirectStandardOutput = true; // Capturamos la salida
                startInfo.RedirectStandardError = true;  // Capturamos el error
                startInfo.UseShellExecute = false;
                startInfo.CreateNoWindow = true;

                process.StartInfo = startInfo;
                process.Start();

                string output = process.StandardOutput.ReadToEnd();
                string error = process.StandardError.ReadToEnd();

                process.WaitForExit();

                if (process.ExitCode != 0 || !string.IsNullOrEmpty(error))
                {
                    throw new Exception($"Prolog Error: {error} (Exit Code: {process.ExitCode})");
                }

                return output;
            }
        }

    }
}

