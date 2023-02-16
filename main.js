const url =  'http://localhost:3000/api/articulos/'
const caja = document.querySelector("tbody");
let resultados = '';
const modalArticulo = new bootstrap.Modal(document.getElementById('modalArticulo'))
const formArticulo = document.querySelector("form")
const descripcion = document.getElementById("descripcion")
const precio = document.getElementById("precio")
const stock = document.getElementById("stock")
let opcion = ''

btnCrear.addEventListener('click', (e) => {
    descripcion.value = '';
    precio.value = '';
    stock.value = '';
    modalArticulo.show()
    opcion = 'crear'
})

const mostrar = (articulos) => {
    articulos.forEach(articulo => {
        resultados += `
        <tr class="text-center">
        <td>${articulo.id}</td>
        <td>${articulo.descripcion}</td>
        <td>${articulo.precio} €</td>
        <td>${articulo.stock} Pc.</td>
        <td>
        <a class="btnEditar btn btn-primary">Editer</a>
        <a class="btnBorrar btn btn-danger">Effacer</a></td>
        </tr>
        `
    })
    caja.innerHTML = resultados;
}

const fetchData = async () => {
    const response = await fetch(url)
    const articulos = await response.json();
    mostrar(articulos)
}

fetchData()

const on = (elemento, evento, selector, handler) => {
    elemento.addEventListener(evento, (e) => {
        if(e.target.closest(selector)) {
            handler(e)
        }
    })
}

on(document, 'click', '.btnBorrar', (e) => {
    const fila = e.target.parentNode.parentNode;
    const id = fila.firstElementChild.innerHTML;
    alertify.confirm("Appuyez sur 'OK' pour supprimer",
  function(){
    fetch(url+id, {
        method: 'DELETE'
    })
    .then (res => res.json())
    .then(() => location.reload())
    // alertify.success('Ok');
  },
  function(){
    alertify.error('Cancel');
  });
})

let idForm = 0

on(document, 'click', '.btnEditar', e => {
    const fila = e.target.parentNode.parentNode;
    idForm = fila.children[0].innerHTML
    const descripcionForm = fila.children[1].innerHTML
    const precioForm = fila.children[2].innerHTML
    const stockForm = fila.children[3].innerHTML 
    descripcion.value = descripcionForm 
    precio.value = precioForm 
    stock.value = stockForm 
    opcion = 'editar'
    modalArticulo.show()
})

formArticulo.addEventListener('submit', (e)=> {
    e.preventDefault();
    if (opcion == 'crear') {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                descripcion:descripcion.value,
                precio:precio.value,
                stock:stock.value
            })
        })
        .then(res => res.json())
        .then(data => {
            const nuevoArticulo = [];
            nuevoArticulo.push(data)
            mostrar(nuevoArticulo)
        })
    }

    if (opcion == 'editar') {
        fetch(url+idForm , {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                descripcion:descripcion.value,
                precio:precio.value,
                stock:stock.value
            })
        })
        .then(res => res.json())
        .then(res => location.reload())
            
        }
        modalArticulo.hide()
    })
