/**
 * Función para validar la longitud de una contraseña.
 * @param {string} password - La contraseña ingresada por el usuario.
 * @returns {boolean} - Retorna true si la longitud es válida (8-12), false en caso contrario.
 */
function validarLongitudContraseña(password) {
    const longitudMinima = 8;
    const longitudMaxima = 12;
    const longitudActual = password.length;

    // Verificar si la longitud está dentro del rango permitido (inclusivo).
    if (longitudActual >= longitudMinima && longitudActual <= longitudMaxima) {
        return true; // La contraseña es válida.
    } else {
        return false; // La contraseña es demasiado corta o demasiado larga.
    }
}

// --- Ejemplos de uso ---
const claveValida = "PokerAce97"; // 10 caracteres
const claveCorta = "Corto";      // 5 caracteres
const claveLarga = "MuyLargaParaTuSistema13"; // 25 caracteres

console.log(`'${claveValida}' es válida: ${validarLongitudContraseña(claveValida)}`); // true
console.log(`'${claveCorta}' es válida: ${validarLongitudContraseña(claveCorta)}`);   // false
console.log(`'${claveLarga}' es válida: ${validarLongitudContraseña(claveLarga)}`);   // false

// Cuando la validación falla, debes mostrar un mensaje de error al usuario.