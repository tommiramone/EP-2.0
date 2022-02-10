// La idea es que cada elemento disponible se pueda añadir a un carrito y este luego arroje un total de precio. 

//SE UTILIZARÁN LOS TEMPLATE PARA PODER PINTAR LAS CARDS EN LA PÁGINA WEB

//LLAMADA DE TODOS LOS ELEMENTOS DEL DOM
const card = document.getElementById('card');
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment();
let carrito = {}


//ADDEVENT PARA QUE ANTES DE EJECUTAR ESPERE QUE SE CARGUE TODO EL HTML
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

//FUNCION PARA QUE SE GENEREN LAS CARDS CON EL CONTENIDO DEL JSON EN LA PÁGINA 
let pintarCard = data => {
    //TOMA LOS DATOS DE LOS ELEMENTOS DEL JSON
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

//FUNCIÓN QUE MEDIANTE EL BOTÓN MANDA LA INFORMACIÓN DEL PRODUCTO AL CARRITO (setCarrito)
const agregarProductos = e => {
    if (e.target.classList.contains('btn-primary')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

//CAPTURA TODOS LOS ELEMENTOS MANDADOS DESDE LA FUNCION agregarProductos
const setCarrito = objeto => {
    //OBJETO QUE TOMA LO ENVIADO DESDE agregarProductos
    const producto = {
        id: objeto.querySelector('.btn-primary').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    //CONDICIÓN PARA QUE SE AUMENTE EN 1, POR CADA VEZ QUE SE LO SELECCIONA, LA CANTIDAD DEL PRODUCTO EN CASO DE QUE ESTE YA ESTÉ AGREGADO. 
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {
        ...producto
    }

    pintarCarrito()
}

//FUNCIÓN PARA QUE AL AGREGAR UN ELEMENTO SE PINTE ESTE MISMO EN EL DOM
const pintarCarrito = () => {
    items.innerHTML = ''

    //PARA TRAER LA INFORMACIÓN DEL PRODUCTO AGREGADO
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

//FUNCIÓN PARA QUE SE PINTE EL FOOTER EN EL DOM
const pintarFooter = () => {
    footer.innerHTML = ''

    //CONDICIONAL PARA QUE AL VACIAR EL CARRITO SE PINTE CIERTA INFORMACIÓN
    if (Object.values(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`

        return
    }

    //FUNCIÓN PARA CALCULAR LA CANTIDAD TOTAL DE PRODUCTOS SELECCIONADOS EN EL CARRITO 
    const nCantidad = Object.values(carrito).reduce((acc, {
        cantidad
    }) => acc + cantidad, 0)
    //FUNCIÓN PARA CALCULAR EL PRECIO TOTAL DEL CARRITO
    const nPrecio = Object.values(carrito).reduce((acc, {
        cantidad,
        precio
    }) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    //FUNCIONALIDAD DEL BOTÓN PARA VACIAR EL CARRITO
    const vaciar = document.getElementById('vaciar-carrito')
    vaciar.addEventListener('click', () => {
        carrito = {}

        pintarCarrito()
    })
}

//FUNCIONALIDAD DE LOS BOTONES DE SUMA Y RESTA DE CANTIDAD DE PRODUCTOS
const btnAccion = e => {
    //BOTON DE SUMA 
    if (e.target.classList.contains('btn-info')) {
        carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {
            ...producto
        }

        pintarCarrito()
    }

    //BOTON DE RESTA
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
