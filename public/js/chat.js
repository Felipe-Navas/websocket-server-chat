
let usuarioAutenticado = null;
let socket = null;

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
    console.log(usuarioAutenticado, token)
};

const main = async() => {
    // Validar JWT
    await validarJWT();
};

main();


// const socket = io();
