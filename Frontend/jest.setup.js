// Wstrzyknięcie TextEncoder i TextDecoder do globalnego obiektu.

// W środowisku JSDOM, aby rozwiązać błąd "ReferenceError: TextEncoder is not defined",
// wstrzykujemy globalne klasy z wbudowanych modułów Node.js.

// UWAGA: Jeśli to zawiedzie (a to jest błąd ReferenceError, a nie SyntaxError),
// to albo moduł 'util' nie jest widoczny, albo wersja Node/Jest jest zbyt stara.

const { TextEncoder, TextDecoder } = require('util');

// Upewniamy się, że klasy są w globalnym scope, zanim zaimportuje je react-router-dom.
if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder;
}

// Opcjonalne: Upewnienie się, że Console jest dostępna (choć zazwyczaj jest)
if (typeof global.console === 'undefined') {
    global.console = console;
}