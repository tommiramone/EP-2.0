// La idea es que cada elemento disponible se pueda añadir a un carrito y este luego arroje un total de precio. 
// El precio del producto se modificará con JS con lo aprendido. 

// A su vez se utilizará el formulario para que las bandas queden resguardadas en una base de datos para ser contactadas. 

//LLAMADA DE TODOS LOS ELEMENTOS DEL DOM
const card = document.getElementById('card');
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment();
let carrito = {}


document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito();
    }
})

card.addEventListener('click', e => {
    agregarProductos(e);
})

items.addEventListener('click', e => {
    btnAccion(e)
})

// CONDIGO PARA PASAR LA DATA DEL JSON AL JS
const fetchData = async () => {
    try {
        const res = await fetch('api.json');
        const data = await res.json();
        // console.log(data)
        pintarCard(data)
    } catch (error) {
        console.log(error);
    }
}
// 

let pintarCard = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title;
        templateCard.querySelector('p').textContent = producto.precio;
        templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl);
        templateCard.querySelector('.btn-primary').dataset.id = producto.id;

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)

    })

    card.appendChild(fragment);
}

//ESTA FUNCIÓN MANDA EL ELEMENTO PADRE DEL PRODUCTO SELECCIONADO AL OBJETO SETCARRITO
const agregarProductos = e => {
    if (e.target.classList.contains('btn-primary')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-primary').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {
        ...producto
    }

    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.title
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)
    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''

    if (Object.values(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`

        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {
        cantidad
    }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {
        cantidad,
        precio
    }) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const vaciar = document.getElementById('vaciar-carrito')
    vaciar.addEventListener('click', () => {
        carrito = {}

        pintarCarrito()
    })
}

const btnAccion = e => {
    if (e.target.classList.contains('btn-info')) {
        carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {
            ...producto
        }

        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }

        pintarCarrito()
    }

    e.stopPropagation

}

$(document).ready(function () {

    //CREACION DE BOTÓN 
    $('#btnForm').append(
        `
        <button>
          <span class="iconify" data-icon="mdi:arrow-up-box" id="scroll" data-width="70" data-height="70"></span>
        </button>
        `
    )

    //PERSONALIZACIÓN DEL BOTÓN
    $('#scroll').css({
        'display': 'flex',
        'position': 'fixed',
        'bottom': '1 em',
        'right': '10 px',
        'color': '#039dff',
    })

    //ANIMACIÓN AL SCROLLEAR HACÍA ABAJO O ESTAR ARRIBA 
    $(window).scroll(function () {
        if ($(this).scrollTop() > 1000) {
            $('#scroll').show('slow');
        } else {
            $('#scroll').hide('slow');
        }
    });

    $('#btnForm').on('click', function () {
        $('body, html').animate({
            scrollTop: '0px'
        })

    })
})