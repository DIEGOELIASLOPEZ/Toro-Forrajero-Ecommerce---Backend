/*******************************************************************************
 * PÁGINA: Registro de nuevos usuarios
 ******************************************************************************/

// Objeto que acumulará los datos
const usuarioValidado = {   //const mensajeValidado
	mNombre: "",
	mApellido: "",
	mTelefono: "",
	mAreaInteres: "",
	mCorreo: "",
	mContraseña: "",
	mEstado: "",
};

function reiniciarUsuarioValidado() {
	usuarioValidado.mNombre = "";
	usuarioValidado.mApellido = "";
	usuarioValidado.mTelefono = "";
	usuarioValidado.mAreaInteres = "";
	usuarioValidado.mCorreo = "";
	usuarioValidado.mContraseña = "";
	usuarioValidado.mEstado = "";
};

/////////////////////////////////////
//VALIDACION nombre apellido

function validarNombre(inputNombre) {
	if (!inputNombre) return "No se encontró el campo nombre";
	const nombre = inputNombre.value.trim();
	const alertMensaje = `<span class="alerta-titulo">El Nombre </span>`;

	if (nombre === "") return alertMensaje + " no puede estar vacío.";
	if (/\d/.test(nombre)) return alertMensaje + " no puede contener números.";
	if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(nombre)) return alertMensaje + " solo puede contener letras y espacios.";
	if (nombre.length < 3) return alertMensaje + " debe tener al menos 3 caracteres.";

	return undefined;
}

function validarApellido(inputApellido) {
	if (!inputApellido) return "No se encontró el campo apellido";
	const apellido = inputApellido.value.trim();
	const alertMensaje = `<span class="alerta-titulo">El Apellido </span>`;

	if (apellido === "") return alertMensaje + " no puede estar vacío.";
	if (/\d/.test(apellido)) return alertMensaje + " no puede contener números.";
	if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(apellido)) return alertMensaje + " solo puede contener letras y espacios.";
	if (apellido.length < 3) return alertMensaje + " debe tener al menos 3 caracteres.";

	return undefined;
}

////////////////////////////////
//VALIDACION telefono e interes
//Función que revisa el campo de teléfono
function validarTelefono(inputTelefono) {
	if (!inputTelefono) return "Campo teléfono no encontrado";
	const telefono = inputTelefono.value.replace(/[\s-]/g, "");
	const alertMensaje = `<span class="alerta-titulo">Teléfono No válido:</span>`;

	if (telefono === "") return `${alertMensaje} Debes llenar el campo`;
	if (!/^\d{10}$/.test(telefono)) return `${alertMensaje} El teléfono debe tener exactamente 10 dígitos`;

	return undefined;
}

//Función que revisa que se haya seleccionado el área de interés
function validarMotivo(selectMotivo) {
	if (!selectMotivo) return "No se encontró el selector de área de interés.";
	if (selectMotivo.value === "") return `<span class="alerta-titulo">Área de interés:</span> Debes seleccionar un área de interés.`;
	return undefined;
}

///////////////////////////////
//VALIDACION email ,estado
function validarCorreo(inputCorreo) {
	if (!inputCorreo) return "Campo correo no encontrado";

	const correo = inputCorreo.value.trim();
	const alertMensaje = `<span class="alerta-titulo">Correo no válido:</span>`;

	if (correo === "") {
		return `${alertMensaje} Debes llenar el campo.`;
	}

	if (!correo.includes("@")) {
		return `${alertMensaje} Por favor incluye un símbolo @ en el correo electrónico.`;
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
		return `${alertMensaje} Ingresa un correo electrónico válido.`;
	}

	return undefined;
}



function validarEstado(selectEstado) {
	if (!selectEstado) return "No se encontró el selector de estado.";
	if (selectEstado.value === "") return `<span class="alerta-titulo">Estado:</span> Debes seleccionar un Estado.`;
	return undefined;
}

function validarContraseña(inputContraseña) {
	if (!inputContraseña) return "Campo contraseña no encontrado";
	const contraseña = inputContraseña.value.trim();
	const alertMensaje = `<span class="alerta-titulo">Contraseña no válida:</span>`;

	if (contraseña === "") return `${alertMensaje} Debes llenar el campo`;
	if (contraseña.length < 8) return `${alertMensaje} Debe tener al menos 8 caracteres`;

	return undefined;
}

function validarConfirmarContraseña(inputContraseña, inputConfirmar) {
	if (!inputConfirmar) return "Campo confirmar contraseña no encontrado";

	const confirmar = inputConfirmar.value.trim();
	const original = inputContraseña.value.trim();

	const alertMensaje = `<span class="alerta-titulo">Las contraseñas no coinciden:</span>`;

	if (confirmar === "") return `${alertMensaje} Debes confirmar tu contraseña.`;
	if (confirmar !== original) return `${alertMensaje} Debes ingresar la misma contraseña.`;

	return undefined;
}


/* -----------------------------------------------------------------------------
	VALIDACIÓN MAESTRA Y ENVÍO DEL FORMULARIO
----------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
	// Codigo agregando Bandera, ya que se observa que al usar json-server,
	// la pagina hace refresh, haciendo que el modal nunca se muestre
	// Por lo que si el registro es exitoso, este dato se guarda en sessionStorage
	// Verificamos si venimos de un registro exitoso tras el reload de json-server
    if (sessionStorage.getItem('registroExitoso') === 'true') {
        const modalElement = document.getElementById('modalExito');
        if (modalElement) {
            const modalExito = new bootstrap.Modal(modalElement);
            modalExito.show();
        }
        // Limpiar la bandera para que no reaparezca en recargas manuales futuras
        sessionStorage.removeItem('registroExitoso');
    }


	const formulario = document.querySelector("#formulario-registro");
	const btnUnirme = document.getElementById("#btnUnirme") || document.querySelector("button[type='submit'], #btnUnirme"); // o tu selector del botón

	// Función de validaciones
	function validarFormularioCompleto() {
		// Inputs
		const inputNombre = document.getElementById("nombre");
		const inputApellido = document.getElementById("apellido");
		const inputTelefono = document.getElementById("telefono");
		const selectAreaInteres = document.getElementById("motivo");
		const inputCorreo = document.getElementById("correo");
		const inputContraseña = document.getElementById("password");
		const inputConfirmar = document.getElementById("confirmarPassword");
		const selectEstado = document.getElementById("estado");

		// Ejecutar validaciones
		const errorNombre = validarNombre(inputNombre);
		const errorApellido = validarApellido(inputApellido);
		const errorTelefono = validarTelefono(inputTelefono);
		const errorAreaInteres = validarMotivo(selectAreaInteres);
		const errorCorreo = validarCorreo(inputCorreo);
		const errorContraseña = validarContraseña(inputContraseña);
		const errorConfirmar = validarConfirmarContraseña(inputContraseña, inputConfirmar);
		const errorEstado = validarEstado(selectEstado);

		// Mostrar errores en el DOM
		mostrarError("#error-nombre p", errorNombre);
		mostrarError("#error-apellido p", errorApellido);
		mostrarError("#registro_error-telefono p", errorTelefono);
		mostrarError("#registro_error-motivo p", errorAreaInteres);
		mostrarError("#error-correo p", errorCorreo);
		mostrarError("#errorPassword", errorContraseña);
		mostrarError("#errorConfirmarPassword", errorConfirmar);
		mostrarError("#error-estado p", errorEstado);

		return !(errorNombre || errorApellido || errorTelefono || errorAreaInteres || errorCorreo || errorContraseña || errorConfirmar || errorEstado);
	}

	// Se ejecutan las validaciones (Enter)
	if (formulario) {
		formulario.addEventListener('keydown', function (e) {
			if (e.key === 'Enter') {
				e.preventDefault(); // Evita que el Enter mande el formulario a la fuerza
				validarFormularioCompleto(); // Solo ejecuta las validaciones visuales
			}
		});
	}

	// Click a "unirme"
	const botonUnirme = document.querySelector("button[type='submit']");
	if (botonUnirme) {
		botonUnirme.addEventListener('click', async function (e) {
			e.preventDefault();
			reiniciarUsuarioValidado();

			const divAlerta = document.querySelector(".alerta");
			const esValido = validarFormularioCompleto();

			if (!esValido) {
				if (divAlerta) {
					divAlerta.innerHTML = `
                    <div class="alert bg-naranjaFuerte alert-dismissible fade show" role="alert">
                        <span class="alerta-titulo">Parece que hay un detalle:</span> Revisa los campos resaltados para poder continuar.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
				}
				console.warn("Envío bloqueado por errores.");
				return;
			}

			// Recolección de datos
			const inputNombre = document.getElementById("nombre");
			const inputApellido = document.getElementById("apellido");
			const inputTelefono = document.getElementById("telefono");
			const selectAreaInteres = document.getElementById("motivo");
			const inputCorreo = document.getElementById("correo");
			const inputContraseña = document.getElementById("password");
			const selectEstado = document.getElementById("estado");

			//Se formatean los inputs
			usuarioValidado.mNombre = inputNombre.value.trim();
			usuarioValidado.mApellido = inputApellido.value.trim();
			usuarioValidado.mTelefono = inputTelefono.value.replace(/[\s-]/g, "");
			usuarioValidado.mAreaInteres = selectAreaInteres.options[selectAreaInteres.selectedIndex].text;
			usuarioValidado.mCorreo = inputCorreo.value.trim();
			usuarioValidado.mContraseña = inputContraseña.value.trim();
			usuarioValidado.mEstado = selectEstado.options[selectEstado.selectedIndex].text;

			//Manda datos a la API
			await enviarDatos();
			console.log("LLEGÓ AQUÍ");
			if (divAlerta) {
				divAlerta.innerHTML = `
                <div class="alert bg-success text-white alert-dismissible fade show" role="alert">
                    Datos registrados <span class="alerta-titulo">Correctamente</span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
			}

			console.log("Objeto listo:", usuarioValidado);
		});
	}
});

// Función auxiliar para inyectar los errores en el HTML
function mostrarError(selector, mensajeError) {
	const elemento = document.querySelector(selector);
	if (elemento) {
		elemento.innerHTML = mensajeError || "";
	}
}



/* -----------------------------------------------------------------------------
   PETICIÓN API / SPRING BOOT
----------------------------------------------------------------------------- */
const API_URL = 'http://localhost:8080/api/usuarios';

async function enviarDatos() {
    console.log("enviarDatos() ejecutado");
    try {
        const nuevoUsuario = {
            nombre: usuarioValidado.mNombre,
            apellido: usuarioValidado.mApellido,
            telefono: usuarioValidado.mTelefono,
            areaInteres: usuarioValidado.mAreaInteres,
            correo: usuarioValidado.mCorreo,
            estado: usuarioValidado.mEstado,
            contrasena: usuarioValidado.mContraseña
        };

        console.log("Usuario que se enviará a Spring Boot:", nuevoUsuario);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoUsuario)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const resultado = await response.json();
        console.log("Usuario registrado exitosamente:", resultado);
        return resultado;

    } catch (error) {
        console.error("Fallo al registrar el usuario:", error);
        throw error;
    }
}

/* -----------------------------------------------------------------------------
   PETICIÓN API / JSON-SERVER
----------------------------------------------------------------------------- */
//const API_URL = 'http://localhost:3000/usuarios';
//
//async function enviarDatos() {
//	console.log("enviarDatos() ejecutado");
//	try {
//		const resActual = await fetch(API_URL);
//		const usuariosActuales = await resActual.json();
//
//		// Calculamos el ID incremental correctamente
//		const ultimoId = usuariosActuales.reduce((max, p) => Number(p.id) > max ? Number(p.id) : max, 0);
//		const nuevoId = ultimoId + 1;
//
//		const nuevoUsuario = {
//			id: String(nuevoId), // Se asigna como string o number según el JSON
//			nombre: usuarioValidado.mNombre,
//			apellido: usuarioValidado.mApellido,
//			telefono: Number(usuarioValidado.mTelefono),
//			areaInteres: usuarioValidado.mAreaInteres,
//			correo: usuarioValidado.mCorreo,
//			contraseña: usuarioValidado.mContraseña,
//			estado: usuarioValidado.mEstado,
//		};
//
//		//Guardamos nuevoUsuario en la db.json
//		const response = await fetch(API_URL, {
//			method: 'POST',
//			headers: { 'Content-Type': 'application/json' },
//			body: JSON.stringify(nuevoUsuario)
//		});
//
//
//
//		if (!response.ok) {
//			throw new Error(`Error status: ${response.status}`);
//		}
//
//		const resultado = await response.json();
//		console.log("Usuario guardado exitosamente en JSON-Server:", resultado);
//
//
//		//Guardar nuevoUsuario en LocalStorage
//
//		//obtener el usuario que ya esta en localStorage
//		const usuariosLocalStorage = JSON.parse(localStorage.getItem('usuarios')) || [];
//		//Agregar el nuevo usuario al array
//		usuariosLocalStorage.push(nuevoUsuario);
//		//Guardar el arreglo
//		localStorage.setItem('usuarios', JSON.stringify(usuariosLocalStorage));
//
//		console.log("Usuario guardado exitosamente en LocalStorage:", nuevoUsuario);
//
//		//Funcionamiento del Modal
//		//Activamos la bandera antes de que json-server recargue la página
  //      sessionStorage.setItem('registroExitoso', 'true');
//
//
//
//	} catch (error) {
//		console.error('Fallo al guardar el usuario', error);
//	}
//
//}
