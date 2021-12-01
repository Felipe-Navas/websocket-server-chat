
let usuarioAutenticado = null;
let socket = null;

// Referencias html
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');


// Validar el token del localstorage
const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if ( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    };

    const resp = await fetch( 'http://localhost:8080/api/auth/',
        { headers: {'x-token': token }
    });

    const { usuarioAutenticado: userDB, token: tokenDB } = await resp.json();
    
    // Restauro el JWT
    localStorage.setItem('token', tokenDB);
    usuarioAutenticado = userDB;

    document.title = usuarioAutenticado.nombre;

    await conectarSocket();
};

const conectarSocket = async() => {
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

    socket.on('recibir-mensajes', () => {
        // TODO:
    });

    socket.on('usuarios-activos', () => {
        // TODO:
    });

    socket.on('mensaje-privado', () => {
        // TODO:
    });
};


const main = async() => {
    // Validar JWT
    await validarJWT();
};

main();


