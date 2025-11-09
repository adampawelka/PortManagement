using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.IO;
using System.Text.Json; // Importante para JSON
using System.Net.Http;
using System.IO;
using System.Globalization;


using DDDSample1.Domain.VesselVisitNotifications;
using DDDSample1.Domain.Resources;
using DDDSample1.Domain.Docks;



namespace SchedulingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchedulingController : ControllerBase
    {
        private readonly string _scriptPath;
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
        public async Task<IActionResult> CalculateSchedule([FromQuery] string date)
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
                var resourceResponse = await client.GetAsync("http://localhost:5000/api/Resources");
                resourceResponse.EnsureSuccessStatusCode();
                var allResources = await resourceResponse.Content.ReadFromJsonAsync<List<ResourceDto>>();

                if (allResources == null)
                    return BadRequest(new { message = "No resources received from the API." });

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
                    var dock = await resourceResponse.Content.ReadFromJsonAsync<DockDto>();

                    if (dock == null)
                        return BadRequest(new { message = "No dock received from the API." });

                    // Filter vessels arriving on the requested date
                    var vesselsForDate = dockGroup
                        .Where(v => v.ETA.Date == targetDate.Date)
                        .ToList();

                    if (!vesselsForDate.Any())
                        continue;

                    var random = new Random();
                    // Prepare Prolog facts - TO-DO: add the time of loading and unloading to the facts, for now random values
                    string facts = string.Join(Environment.NewLine, vesselsForDate.Select(v =>
                    {
                        // losowy czas załadunku i rozładunku w godzinach (np. 1-4h)
                        int loadTime = random.Next(5, 20);
                        int unloadTime = random.Next(5, 20);
                        return $"vessel('{v.VesselName.ToLower()}', {v.ETA.Hour}, {v.ETD.Hour}).";
                    }
                    ));

                    string query = $"{facts} run_schedule(Solution), format('~q', [Solution]), halt.";

                    // Execute Prolog query
                    string result = RunPrologQuery(query, _scriptPath);

                    var craneRandom = new Random();

                    // Pick a random crane for this dock
                    //var crane = availableCranes[craneRandom.Next(availableCranes.Count)];


                    dockSchedules[dockId] = new
                    {
                        schedule = result,
                        dock = dock.DockName,
                        crane = "to-add",
                        staff = "todo"
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

