using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.IO;
using System.Text.Json; // Importante para JSON
using System.Net.Http;
using System.IO;
using System.Globalization;
using System.Linq;

using System.Text.RegularExpressions;


using DDDSample1.Domain.VesselVisitNotifications;
using DDDSample1.Domain.Docks;
using DDDSample1.Domain.StaffMembers;
using DDDSample1.Domain.Resources;
using DDDSample1.Domain.StorageAreas;




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
        private readonly string _multiCraneScriptPath;
        private readonly string _swiplPath;
        private readonly string _backendApiUrl;
        private readonly IHttpClientFactory _httpClientFactory;

        public SchedulingController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;


            _swiplPath = "swipl";
            Console.WriteLine($"SWI-Prolog path: {_swiplPath}");

            string baseDir = AppContext.BaseDirectory;

            // Try to locate Prolog file in source folder relative to project
            _backendApiUrl = configuration["BackendAPI:BaseUrl"] ?? "http://localhost:5000";

            Console.WriteLine($"Backend API URL: {_backendApiUrl}");

            string sourcePath = Path.Combine(baseDir, "..", "..", "..", "PrologFiles", "vessels_scheduling1.pl");
            sourcePath = Path.GetFullPath(sourcePath).Replace("\\", "/");

            // If file exists in source folder, use it; otherwise fallback to baseDir
            _scriptPath = System.IO.File.Exists(sourcePath)
                ? sourcePath
                : Path.Combine(baseDir, "PrologFiles", "vessels_scheduling1.pl");
            _scriptPath = Path.GetFullPath(_scriptPath).Replace("\\", "/");

            Console.WriteLine($"Prolog script path: {_scriptPath}");

            if (!System.IO.File.Exists(_scriptPath))
                throw new Exception($"Prolog script not found at {_scriptPath}");

            string multiCranePath = Path.Combine(baseDir, "..", "..", "..", "PrologFiles", "multiple_scheduling.pl");
            multiCranePath = Path.GetFullPath(multiCranePath).Replace("\\", "/");

            // If file exists in source folder, use it; otherwise fallback to baseDir
            _multiCraneScriptPath = System.IO.File.Exists(multiCranePath)
                ? multiCranePath
                : Path.Combine(baseDir, "PrologFiles", "multiple_scheduling.pl");
            _multiCraneScriptPath = Path.GetFullPath(_multiCraneScriptPath).Replace("\\", "/");

            Console.WriteLine($"Multiple Crane Scheduling script path: {_multiCraneScriptPath}");

            if (!System.IO.File.Exists(_multiCraneScriptPath))
                throw new Exception($"Multiple Crane Scheduling script not found at {_multiCraneScriptPath}");

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
            // string backendApiUrl = "http://localhost:5000/api/Docks";

            try
            {
                // 2. Creamos un cliente HTTP para hacer la llamada
                var client = _httpClientFactory.CreateClient();

                // 3. Hacemos la llamada GET
                var response = await client.GetAsync($"{_backendApiUrl}/api/Docks");

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
        public async Task<IActionResult> CalculateSchedule(
     [FromQuery] string date,
     [FromQuery] string algorithm = "bruteforce")
        {
            if (!DateTime.TryParse(date, null, DateTimeStyles.RoundtripKind, out var targetDate))
                return BadRequest(new { message = "Invalid date format. Expected ISO 8601." });

            try
            {
                // --- AUTH ---
                var authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                    return Unauthorized(new { message = "Missing or invalid token." });

                var token = authHeader.Substring("Bearer ".Length).Trim();

                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                // --- VESSELS ---
                var response = await client.GetAsync($"{_backendApiUrl}/api/VesselVisitNotifications");
                response.EnsureSuccessStatusCode();

                var vessels = await response.Content.ReadFromJsonAsync<List<VesselVisitNotificationDto>>();
                if (vessels == null)
                    return BadRequest(new { message = "No vessels received from the API." });

                var approvedVessels = vessels
                    .Where(v => v.Status == "Approved" && v.AssignedDockId.HasValue)
                    .ToList();

                if (!approvedVessels.Any())
                    return BadRequest(new { message = "No approved vessels assigned to any dock." });

                var dockGroups = approvedVessels
                    .GroupBy(v => v.AssignedDockId)
                    .ToList();

                // --- RESOURCES ---
                var resourceResponse = await client.GetAsync($"{_backendApiUrl}/api/Resources");
                resourceResponse.EnsureSuccessStatusCode();

                var allResources = await resourceResponse.Content.ReadFromJsonAsync<List<ResourceDto>>();
                var availableCranes = allResources
                    .Where(r => r.Type == "Crane" && r.Status == "active")
                    .ToList();

                // --- STAFF ---
                var staffResponse = await client.GetAsync($"{_backendApiUrl}/api/StaffMembers");
                staffResponse.EnsureSuccessStatusCode();

                var allStaff = await staffResponse.Content.ReadFromJsonAsync<List<StaffMemberDto>>();

                // --- STORAGE AREAS ---
                var areaResponse = await client.GetAsync($"{_backendApiUrl}/api/StorageAreas");
                areaResponse.EnsureSuccessStatusCode();

                var allAreas = await areaResponse.Content.ReadFromJsonAsync<List<StorageAreaDto>>();

                // --- RESOURCE SELECTION ---
                var selectedCrane = availableCranes.FirstOrDefault();
                if (selectedCrane != null) availableCranes.Remove(selectedCrane);

                var dockSchedules = new Dictionary<string, object>();

                // ============================================================
                //                     MAIN LOOP PER DOCK
                // ============================================================
                foreach (var dockGroup in dockGroups)
                {
                    string dockId = dockGroup.Key.Value.ToString();

                    var dockResponse = await client.GetAsync($"{_backendApiUrl}/api/Docks/{dockId}");
                    dockResponse.EnsureSuccessStatusCode();
                    var dock = await dockResponse.Content.ReadFromJsonAsync<DockDto>();

                    var vesselsForDate = dockGroup
                        .Where(v => v.ETA.Date == targetDate.Date)
                        .ToList();

                    if (!vesselsForDate.Any())
                        continue;

                    // --- FIND CLOSEST STORAGE AREA ---
                    var closestArea = GetClosestArea(allAreas, dockGroup.Key.Value);

                    // --- PROLOG FACTS ---
                    string facts = string.Join(Environment.NewLine, vesselsForDate.Select(v =>
                    {
                        int containerCount = v.CargoManifests?.Sum(m => m.ContainerIdentifiers?.Count ?? 0) ?? 0;
                        int loadTime = 2 + (containerCount * 2);
                        int unloadTime = 2 + (containerCount * 2);

                        int etaHour = v.ETA.Minute >= 30 ? v.ETA.Hour + 1 : v.ETA.Hour;
                        int etdHour = v.ETD.Minute >= 30 ? v.ETD.Hour + 1 : v.ETD.Hour;

                        string vesselKey = v.VesselName.ToLower().Replace(" ", "_");

                        return $"asserta(vessel({vesselKey}, {etaHour}, {etdHour}, {unloadTime}, {loadTime})),";
                    }));

                    // --- CHOOSE SOLVER ---
                    string scriptToUse;
                    string query;

                    switch (algorithm.ToLower())
                    {
                        case "heuristic":
                        case "edt":
                            scriptToUse = _alternativeScriptPath;
                            query = $"{facts} solve_heuristic(Solution,_), format('~w~n',[Solution]), halt.";
                            break;

                        case "spt":
                            scriptToUse = _sptScriptPath;
                            query = $"{facts} solve_spt(Solution,_), format('~w~n',[Solution]), halt.";
                            break;

                        case "dynamic_mst":
                        case "mst":
                            scriptToUse = _dynamicMstScriptPath;
                            query = $"{facts} solve_dynamic_mst(Solution,_), format('~w~n',[Solution]), halt.";
                            break;

                        default:
                            scriptToUse = _scriptPath;
                            query = $"{facts} obtain_seq_shortest_delay(Solution,_), format('~w~n',[Solution]), halt.";
                            break;
                    }

                    // --- PROLOG EXECUTION ---
                    string result = RunPrologQuery(query, scriptToUse);

                    // --- RESPONSE ENTRY ---
                    dockSchedules[dockId] = new
                    {
                        dock = dock.DockName,
                        schedule = result,
                        vessels = vesselsForDate,
                        crane = selectedCrane?.Code,
                        staff = allStaff,

                        // 🔥 only closest area returned
                        area = closestArea
                    };
                }

                if (!dockSchedules.Any())
                    return BadRequest(new { message = "No vessels arriving on that date." });

                return Ok(dockSchedules);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error generating schedule: {ex.Message}");
            }
        }



        [HttpGet("calculate-schedule-multi-crane")]
        public async Task<IActionResult> CalculateScheduleMultiCrane([FromQuery] string date)
        {
            // -------------------------
            // VALIDATE DATE
            // -------------------------
            if (!DateTime.TryParse(date, null, DateTimeStyles.RoundtripKind, out var targetDate))
                return BadRequest(new { message = "Invalid date format. Expected ISO 8601." });

            try
            {
                // -------------------------
                // VALIDATE AUTH TOKEN
                // -------------------------
                var authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                    return Unauthorized(new { message = "Missing or invalid token." });

                var token = authHeader.Substring("Bearer ".Length).Trim();

                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                // -------------------------
                // LOAD ALL NECESSARY DATA ONCE (NO LOOP REQUESTS)
                // -------------------------

                // 1. Vessels
                var vesselResponse = await client.GetAsync($"{_backendApiUrl}/api/VesselVisitNotifications");
                vesselResponse.EnsureSuccessStatusCode();
                var vessels = await vesselResponse.Content.ReadFromJsonAsync<List<VesselVisitNotificationDto>>() ?? new();
                var approvedVessels = vessels
                    .Where(v => v.Status == "Approved" && v.AssignedDockId.HasValue)
                    .ToList();

                if (!approvedVessels.Any())
                    return BadRequest(new { message = "No approved vessels assigned to any dock." });

                // 2. Resources
                var resourceResponse = await client.GetAsync($"{_backendApiUrl}/api/Resources");
                resourceResponse.EnsureSuccessStatusCode();
                var allResources = await resourceResponse.Content.ReadFromJsonAsync<List<ResourceDto>>() ?? new();

                // 3. Staff
                var staffResponse = await client.GetAsync($"{_backendApiUrl}/api/StaffMembers");
                staffResponse.EnsureSuccessStatusCode();
                var allStaff = await staffResponse.Content.ReadFromJsonAsync<List<StaffMemberDto>>() ?? new();

                // 4. Storage Areas
                var areaResponse = await client.GetAsync($"{_backendApiUrl}/api/StorageAreas");
                areaResponse.EnsureSuccessStatusCode();
                var allAreas = await areaResponse.Content.ReadFromJsonAsync<List<StorageAreaDto>>() ?? new();

                // -------------------------
                // GROUP BY DOCK
                // -------------------------
                var dockGroups = approvedVessels.GroupBy(v => v.AssignedDockId);
                var dockSchedules = new Dictionary<string, object>();

                // -------------------------
                // PROCESS EACH DOCK
                // -------------------------
                foreach (var dockGroup in dockGroups)
                {
                    var dockId = dockGroup.Key?.ToString() ?? "unknown";

                    // Load dock ONCE
                    var dockResponse = await client.GetAsync($"{_backendApiUrl}/api/Docks/{dockId}");
                    dockResponse.EnsureSuccessStatusCode();
                    var dock = await dockResponse.Content.ReadFromJsonAsync<DockDto>();
                    if (dock == null)
                        return BadRequest(new { message = "No dock received from the API." });

                    // Filter vessels for selected date
                    var vesselsForDate = dockGroup
                        .Where(v => v.ETA.Date == targetDate.Date)
                        .ToList();

                    if (!vesselsForDate.Any())
                        continue;

                    // -------------------------
                    // BUILD PROLOG FACTS
                    // -------------------------
                    var facts = string.Join(Environment.NewLine, vesselsForDate.Select(v =>
                    {
                        int containerCount = v.CargoManifests?.Sum(m => m.ContainerIdentifiers?.Count ?? 0) ?? 0;

                        int load = 2 + containerCount * 2;
                        int unload = 2 + containerCount * 2;

                        int eta = v.ETA.Minute >= 30 ? v.ETA.Hour + 1 : v.ETA.Hour;
                        int etd = v.ETD.Minute >= 30 ? v.ETD.Hour + 1 : v.ETD.Hour;

                        int maxCranes = containerCount > 100 ? 4 : containerCount > 50 ? 3 : 2;

                        string name = v.VesselName.ToLower().Replace(" ", "_").Replace("-", "_");

                        return $"asserta(vessel_multi({name}, {eta}, {etd}, {unload}, {load}, {maxCranes})),";

                    }));

                    // -------------------------
                    // PROLOG QUERY
                    // -------------------------
                    var query =
                        $"{facts} " +
                        "solve_multi_crane(SingleSeq, SingleDelay, SingleCraneHours, " +
                        "MultiSeq, MultiDelay, MultiCraneHours), " +
                        "format('SINGLE_SEQ:~w~n', [SingleSeq]), " +
                        "format('SINGLE_DELAY:~w~n', [SingleDelay]), " +
                        "format('SINGLE_CRANE_HOURS:~w~n', [SingleCraneHours]), " +
                        "format('MULTI_SEQ:~w~n', [MultiSeq]), " +
                        "format('MULTI_DELAY:~w~n', [MultiDelay]), " +
                        "format('MULTI_CRANE_HOURS:~w~n', [MultiCraneHours]), halt.";

                    // -------------------------
                    // EXECUTE PROLOG
                    // -------------------------
                    string result;
                    try
                    {
                        result = RunPrologQuery(query, _multiCraneScriptPath);
                    }
                    catch (Exception ex)
                    {
                        return StatusCode(500, new
                        {
                            message = "Prolog execution failed",
                            details = ex.ToString()
                        });
                    }

                    // -------------------------
                    // PARSE RESULT
                    // -------------------------
                    var parsed = ParseMultiCraneResult(result, vesselsForDate, dock);

                    // Assign the first crane found
                    var crane = allResources
                        .FirstOrDefault(r => r.Type == "Crane" && r.Status == "Active");

                    // -------------------------
                    // FINAL DOCK ENTRY
                    // -------------------------
                    dockSchedules[dockId] = new
                    {
                        dockName = dock.DockName,
                        craneCode = crane?.Code ?? "Unassigned",
                        staff = allStaff.Take(5),
                        area = allAreas.FirstOrDefault()?.StorageAreaType ?? "Unassigned",

                        singleCrane = new
                        {
                            schedules = parsed.SingleSchedules,
                            delay = parsed.SingleDelay,
                            craneHours = parsed.SingleCraneHours
                        },
                        multiCrane = new
                        {
                            schedules = parsed.MultiSchedules,
                            delay = parsed.MultiDelay,
                            craneHours = parsed.MultiCraneHours
                        },
                        improvement = new
                        {
                            delayReduction = parsed.SingleDelay - parsed.MultiDelay,
                            additionalCraneHours = parsed.MultiCraneHours - parsed.SingleCraneHours,
                            percentageImprovement = parsed.SingleDelay > 0
                                ? Math.Round(((double)(parsed.SingleDelay - parsed.MultiDelay) / parsed.SingleDelay) * 100, 2)
                                : 0
                        }
                    };
                }

                // If nothing produced output
                if (!dockSchedules.Any())
                    return BadRequest(new { message = "No vessels arriving on the selected date for any dock." });

                return Ok(dockSchedules);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = $"Error generating multi-crane schedule: {ex.Message}",
                    details = ex.ToString()
                });
            }
        }

        private class MultiCraneParseResult
        {
            public string SingleSchedule { get; set; }
            public int SingleDelay { get; set; }
            public int SingleCraneHours { get; set; }
            public string MultiSchedule { get; set; }
            public int MultiDelay { get; set; }
            public int MultiCraneHours { get; set; }
            public List<VesselSchedule> SingleSchedules { get; set; }
            public List<VesselSchedule> MultiSchedules { get; set; }
        }

        // Add a new class to hold vessel schedule data
        private class VesselSchedule
        {
            public string VesselName { get; set; }
            public string StartTime { get; set; }
            public string EndTime { get; set; }
            public int CranesUsed { get; set; }
            public int StartSlot { get; set; }
            public int EndSlot { get; set; }
        }

        // Replace the ParseMultiCraneResult method with an improved version
        // Replace all the parsing-related methods with this single comprehensive method
        private MultiCraneParseResult ParseMultiCraneResult(string result, List<VesselVisitNotificationDto> vesselsForDate, DockDto dock)
        {
            var parsed = new MultiCraneParseResult
            {
                SingleSchedules = new List<VesselSchedule>(),
                MultiSchedules = new List<VesselSchedule>(),
                SingleDelay = 0,
                MultiDelay = 0,
                SingleCraneHours = 0,
                MultiCraneHours = 0
            };

            try
            {
                // 1. Parsowanie harmonogramów
                parsed.SingleSchedules = ParseAndCleanSchedules("SINGLE", 1, result, vesselsForDate);
                parsed.MultiSchedules = ParseAndCleanSchedules("MULTI", -1, result, vesselsForDate);

                // 2. Parsowanie delay bez fallbacku
                var singleDelayMatch = Regex.Match(result, @"SINGLE_DELAY:(\d+)");
                if (singleDelayMatch.Success)
                    parsed.SingleDelay = int.Parse(singleDelayMatch.Groups[1].Value);

                var multiDelayMatch = Regex.Match(result, @"MULTI_DELAY:(\d+)");
                if (multiDelayMatch.Success)
                    parsed.MultiDelay = int.Parse(multiDelayMatch.Groups[1].Value);

                // 3. Parsowanie crane hours
                var singleCraneHoursMatch = Regex.Match(result, @"SINGLE_CRANE_HOURS:(\d+)");
                if (singleCraneHoursMatch.Success)
                    parsed.SingleCraneHours = int.Parse(singleCraneHoursMatch.Groups[1].Value);

                var multiCraneHoursMatch = Regex.Match(result, @"MULTI_CRANE_HOURS:(\d+)");
                if (multiCraneHoursMatch.Success)
                    parsed.MultiCraneHours = int.Parse(multiCraneHoursMatch.Groups[1].Value);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Warning: Error parsing Prolog result: {ex.Message}");
                // fallback tylko do harmonogramów
                parsed.SingleSchedules = CreateSimpleFallbackSchedules(vesselsForDate, 1);
                parsed.MultiSchedules = CreateSimpleFallbackSchedules(vesselsForDate, 2);
            }

            return parsed;
        }

        private List<VesselSchedule> ParseAndCleanSchedules(string prefix, int defaultCranes, string result, List<VesselVisitNotificationDto> vesselsForDate)
        {
            var allSchedules = new List<VesselSchedule>();
            var uniqueVessels = new HashSet<string>();

            // Wydobycie harmonogramu z wyniku Prologu
            string seqPattern = $@"{prefix}_SEQ:\[([^\]]+)\]";
            var seqMatch = System.Text.RegularExpressions.Regex.Match(result, seqPattern, System.Text.RegularExpressions.RegexOptions.IgnoreCase);

            if (!seqMatch.Success)
                return allSchedules; // brak danych, zwróć pustą listę

            var vesselNames = seqMatch.Groups[1].Value.Split(',').Select(v => v.Trim()).ToList();

            // Zbuduj listę obiektów statków z Prologu
            var vessels = vesselNames
                .Select(name =>
                {
                    var vessel = vesselsForDate.FirstOrDefault(v =>
                        v.VesselName.ToLower().Replace(" ", "_").Replace("-", "_") == name);
                    if (vessel == null) return null;

                    int containerCount = vessel.CargoManifests?.Sum(m => m.ContainerIdentifiers?.Count ?? 0) ?? 0;
                    int loadTime = 2 + containerCount * 2;
                    int unloadTime = 2 + containerCount * 2;
                    int totalProcessing = loadTime + unloadTime;
                    int arrivalSlot = vessel.ETA.Minute >= 30 ? vessel.ETA.Hour + 1 : vessel.ETA.Hour;

                    int maxCranes = defaultCranes > 0 ? defaultCranes :
                                     (containerCount > 100 ? 4 : (containerCount > 50 ? 3 : 2));

                    return new
                    {
                        vesselName = name,
                        arrivalSlot,
                        totalProcessing,
                        maxCranes
                    };
                })
                .Where(v => v != null)
                .ToList();

            if (!vessels.Any())
                return allSchedules;

            // Multi-crane logic: równoległe przypisywanie do dźwigów
            int cranesCount = vessels.Max(v => v.maxCranes); // maksymalna liczba dźwigów
            var craneAvailability = new int[cranesCount];     // godzina, kiedy każdy dźwig będzie wolny

            foreach (var vessel in vessels)
            {
                // Znajdź najwcześniejszy dostępny dźwig
                int minIndex = 0;
                int earliest = craneAvailability[0];
                for (int i = 1; i < craneAvailability.Length; i++)
                {
                    if (craneAvailability[i] < earliest)
                    {
                        earliest = craneAvailability[i];
                        minIndex = i;
                    }
                }

                int startSlot = Math.Max(vessel.arrivalSlot, earliest);
                int endSlot = startSlot + vessel.totalProcessing - 1;

                allSchedules.Add(new VesselSchedule
                {
                    VesselName = vessel.vesselName,
                    StartSlot = startSlot,
                    EndSlot = endSlot,
                    StartTime = SlotToTime(startSlot),
                    EndTime = SlotToTime(endSlot),
                    CranesUsed = Math.Min(vessel.maxCranes, cranesCount)
                });

                // Zaktualizuj czas dostępności tego dźwigu
                craneAvailability[minIndex] = endSlot + 1;

                uniqueVessels.Add(vessel.vesselName);
            }

            return allSchedules;
        }

        private List<VesselSchedule> CreateSimpleFallbackSchedules(List<VesselVisitNotificationDto> vessels, int defaultCranes)
        {
            var schedules = new List<VesselSchedule>();
            int currentTime = 0;
            var uniqueVessels = new HashSet<string>();

            foreach (var vessel in vessels.OrderBy(v => v.ETA))
            {
                string vesselName = vessel.VesselName.ToLower().Replace(" ", "_").Replace("-", "_");

                if (!uniqueVessels.Contains(vesselName))
                {
                    int containerCount = vessel.CargoManifests?.Sum(m => m.ContainerIdentifiers?.Count ?? 0) ?? 0;
                    int loadTime = 2 + (containerCount * 2);
                    int unloadTime = 2 + (containerCount * 2);
                    int arrivalHour = vessel.ETA.Minute >= 30 ? vessel.ETA.Hour + 1 : vessel.ETA.Hour;

                    int cranes = defaultCranes;
                    int totalProcessing;

                    if (defaultCranes == -1) // Multi-crane
                    {
                        cranes = containerCount > 100 ? 4 : (containerCount > 50 ? 3 : 2);
                        int actualUnload = (int)Math.Ceiling((double)unloadTime / cranes);
                        int actualLoad = (int)Math.Ceiling((double)loadTime / cranes);
                        totalProcessing = actualUnload + actualLoad;
                    }
                    else // Single crane
                    {
                        totalProcessing = loadTime + unloadTime;
                        cranes = 1;
                    }

                    int startSlot = Math.Max(arrivalHour, currentTime);
                    int endSlot = startSlot + totalProcessing - 1;

                    schedules.Add(new VesselSchedule
                    {
                        VesselName = vesselName,
                        StartSlot = startSlot,
                        EndSlot = endSlot,
                        StartTime = SlotToTime(startSlot),
                        EndTime = SlotToTime(endSlot),
                        CranesUsed = cranes
                    });

                    currentTime = endSlot + 1;
                    uniqueVessels.Add(vesselName);
                }
            }

            return schedules.OrderBy(s => s.StartSlot).ToList();
        }
        private string SlotToTime(int slot)
        {
            int hours = slot % 24;
            int days = slot / 24;
            string timeStr = $"{hours:00}:00";
            return days > 0 ? $"{timeStr} (+{days}d)" : timeStr;
        }

        private StorageAreaDto? GetClosestArea(List<StorageAreaDto> areas, Guid dockId)
        {
            return areas
                .Select(area =>
                {
                    var match = area.DockDistances?
                        .FirstOrDefault(d => d.DockId == dockId);

                    double distance = match?.Distance ?? double.MaxValue;

                    return (area, distance);
                })
                .OrderBy(x => x.distance)
                .FirstOrDefault()
                .area;
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

