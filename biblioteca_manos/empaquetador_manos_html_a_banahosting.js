document.getElementById('btnSend').addEventListener('click', async () => {
    // 1. Recogemos los datos básicos
    const selectedTypes = Array.from(document.querySelectorAll('.checkbox-grid input:checked')).map(cb => cb.value);
    const fileInput = document.getElementById("fileInput");
    const imagen = fileInput.files[0];

    // 2. Validación mínima
    if (!modSelect.value || !varSelect.value || !imagen) {
        alert("Por favor, selecciona modalidad, variedad y sube una imagen.");
        return;
    }

    // 3. Creamos el objeto EMPAQUETADOR (FormData)
    const formData = new FormData();
    
    // Metemos los textos
    formData.append('modalidad', modSelect.value);
    formData.append('variedad', varSelect.value);
    formData.append('subtipo', subSelect.value);
    formData.append('nivel', nivelSelect.value);
    formData.append('rival', rivalSelect.value);
    formData.append('notas', textarea.value);
    formData.append('categorias', JSON.stringify(selectedTypes)); // Enviamos el array como string JSON

    // Metemos el archivo de imagen
    formData.append('foto_mano', imagen);

    // 4. Envío al servidor (BanaHosting / Local)
    try {
        const response = await fetch('upload.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.status === 'success') {
            alert("¡Mano guardada con éxito en la base de datos!");
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error en el envío:", error);
        alert("No se pudo conectar con el servidor.");
    }
});