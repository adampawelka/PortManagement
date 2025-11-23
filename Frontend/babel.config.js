/**
 * Konfiguracja Babel dla Jesta
 * Używa modułów ES (export default) i jest kompatybilna z "type": "module" w package.json.
 * Zastępuje module.exports, aby uniknąć błędu ReferenceError.
 */
export default {
    presets: [
        '@babel/preset-env',
        ['@babel/preset-react', {
            // Wymagane dla React 17+ i 19+ (Vite)
            runtime: 'automatic' 
        }]
    ]
};