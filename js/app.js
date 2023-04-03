

const cryptoSelect = document.querySelector( '#criptomonedas' );
const monedaSelect = document.querySelector( '#moneda' );
const formulario = document.querySelector( '#formulario' );
const resultado = document.querySelector( '#resultado' );

const objBusqueda = {
    moneda: '',
    cryptomoneda: '',
}

const obtenerCryptoMonedas = ( cryptoMonedas ) => new Promise( resolve => {
    resolve( cryptoMonedas );
} );


document.addEventListener( 'DOMContentLoaded', () => {
    consultarCryptoMonedas();

    formulario.addEventListener( 'submit', submitFormulario );

    cryptoSelect.addEventListener( 'change', leerValor );
    monedaSelect.addEventListener( 'change', leerValor );
} );

async function consultarCryptoMonedas() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    // fetch( url )
    //     .then( respuesta => respuesta.json() )
    //     .then( datos => obtenerCryptoMonedas( datos.Data ) )
    //     .then( criptomonedas => selectCryptoMonedas( criptomonedas ) );
    try {
        const respuesta = await fetch( url );
        const datos = await respuesta.json();
        const criptomonedas = await obtenerCryptoMonedas( datos.Data );
        selectCryptoMonedas( criptomonedas );
    } catch ( error ) {
        console.log( error );
    }
}
function selectCryptoMonedas( criptomonedas ) {
    criptomonedas.forEach( crypto => {
        const { FullName, Name } = crypto.CoinInfo;

        const option = document.createElement( 'OPTION' );
        option.value = Name;
        option.textContent = FullName;
        cryptoSelect.appendChild( option );
    } );
}

function leerValor( e ) {

    objBusqueda[ e.target.name ] = e.target.value;

}

function submitFormulario( e ) {
    e.preventDefault();
    //validar
    const { moneda, cryptomoneda } = objBusqueda;

    if ( moneda === '' || cryptomoneda === '' ) {
        mostrarAlerta( 'Ambos campos son obligatorios' );
        return;
    }
    //consultar APO con los resultados. 
    consultarAPI();
}

function mostrarAlerta( mensaje ) {
    const existeError = document.querySelector( '.error' );

    if ( !existeError ) {
        const alerta = document.createElement( 'DIV' );
        alerta.classList.add( 'error' )

        //mensaje de error
        alerta.textContent = mensaje;
        formulario.appendChild( alerta );

        setTimeout( () => {
            alerta.remove();
        }, 3000 );
    }

}

async function consultarAPI() {
    const { moneda, cryptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${ cryptomoneda }&tsyms=${ moneda }`;

    mostrarSpinner();

    // fetch( url )
    //     .then( respuesta => respuesta.json() )
    //     .then( datos => mostrarCotizacionHTML( datos.DISPLAY[ cryptomoneda ][ moneda ] ) );

    try {
        const respuesta = await fetch( url );
        const datos = await respuesta.json();
        mostrarCotizacionHTML( datos.DISPLAY[ cryptomoneda ][ moneda ] );
    } catch ( error ) {
        console.log( error );
    }
}

function mostrarCotizacionHTML( cotizacion ) {
    limpiarHTML();
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement( 'P' );
    precio.classList.add( 'precio' );
    precio.innerHTML = `El pecio es: <span>${ PRICE }</span>`;

    const precioAlto = document.createElement( 'P' );
    precioAlto.innerHTML = `<p>Precio mas alto del dia:<span>${ HIGHDAY }<span/></p>`;

    const precioBajo = document.createElement( 'P' );
    precioBajo.innerHTML = `<p>Precio mas bajo del dia:<span>${ LOWDAY }<span/></p>`;

    const ultimasHoras = document.createElement( 'P' );
    ultimasHoras.innerHTML = `<p>Precio mas alto del dia:<span>${ CHANGEPCT24HOUR }%<span/></p>`;

    const ultimaActualizacion = document.createElement( 'P' );
    ultimaActualizacion.innerHTML = `<p>Ultima actualizacion del dia:<span>${ LASTUPDATE }<span/></p>`;



    resultado.appendChild( precio );
    resultado.appendChild( precioAlto );
    resultado.appendChild( precioBajo );
    resultado.appendChild( ultimasHoras );
    resultado.appendChild( ultimaActualizacion );
}

function limpiarHTML() {
    while ( resultado.firstChild ) {
        resultado.removeChild( resultado.firstChild );
    }
}

function mostrarSpinner() {

    limpiarHTML();

    const spinner = document.createElement( 'DIV' );
    spinner.classList.add( 'spinner' );

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild( spinner );
}



