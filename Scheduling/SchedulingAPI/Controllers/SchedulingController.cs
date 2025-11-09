using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.IO;
using System.Text.Json; // Importante para JSON
using System.Net.Http;
using System.IO;


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
        public IActionResult CalculateSchedule([FromQuery] string date)
        {
            // data is necessary to fetch
            // 1. CONSEGUIR DATOS:
            //    Aquí llamarías al BackendAPI (usando IHttpClientFactory) para
            //    obtener los barcos, muelles, etc., para la 'date'.
            //    (Este es el Criterio 3.4.1b)

            // 2. PREPARAR DATOS PARA PROLOG:
            //    Ej: "barco(v1, 50). barco(v2, 30). muelle(d1, 60)."
            //string facts = $"barco(v1, 50). barco(v2, 30). muelle(d1, 60). fecha('{date}').";
            // HERE WE ONLY PUT VESSELS

            // 3. PREPARAR CONSULTA:
            //    Tus compañeros definirán un predicado principal, ej: "generar_horario(Solucion)"
            //string query = $"{facts} generar_horario(Solucion), format('~q', [Solucion]), halt.";
            string query = "run_schedule";
            try
            {
                // 4. EJECUTAR
                string result = RunPrologQuery(query, _scriptPath);

                return Ok(new { scheduleResult = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error generando horario: {ex.Message}");
            }
        }


        /// <summary>
        /// Función principal que ejecuta un comando en SWI-Prolog.
        /// </summary>
        private string RunPrologQuery(string query, string scriptFile = null)
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