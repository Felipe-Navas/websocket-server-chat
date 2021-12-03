
let usuarioAutenticado = null;
let socket = null;

// Referencias html
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');


// Validar el token del localstorage
const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    };

    const resp = await fetch('http://localhost:8080/api/auth/',
        {
            headers: { 'x-token': token }
        });

    const { usuarioAutenticado: userDB, token: tokenDB } = await resp.json();

    // Restauro el JWT
    localStorage.setItem('token', tokenDB);
    usuarioAutenticado = userDB;

    document.title = usuarioAutenticado.nombre;

    await conectarSocket();
};

const conectarSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets Online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets Offline');
    });

    socket.on('recibir-mensajes', mostrarMensajes);

    socket.on('usuarios-activos', mostrarUsuarios);

    // TODO: Crear nuevo metodo mostrarMensajesPrivados similar a mostrarMensajes:
    // socket.on('mensaje-privado', mostrarMensajesPrivados);
    // modificando la clase ChatMensajes para que soporte una nueva lista con los mensajes privados
    socket.on('mensaje-privado', mostrarMensajes);
};


const mostrarUsuarios = (usuarios = []) => {
    let usersHtml = '';
    usuarios.forEach(({ nombre, uid }) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${nombre}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;
};

const mostrarMensajes = (mensajes = []) => {
    let mensajesHtml = '';
    mensajes.forEach(({ mensaje, nombre }) => {
        mensajesHtml += `
            <li>
                <p>
                    <span class="text-primary">${nombre}: </span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
    });
    ulMensajes.innerHTML = mensajesHtml;
};


// Agrego el evento keyup, que escucha cuando se presiona una tecla en el input
// En el keyCode viene el numero ASCII de la tecla presionada
txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    if (keyCode !== 13) { return };

    const mensaje = txtMensaje.value;
    if (mensaje.length === 0) { return };
    const uid = txtUid.value;

    socket.emit('enviar-mensaje', { mensaje, uid });

    txtMensaje.value = '';
});


const main = async () => {
    // Validar JWT
    await validarJWT();
};

main();


