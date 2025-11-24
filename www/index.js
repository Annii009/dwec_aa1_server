const API_URL = "http://localhost:3000"


//vriable para almacenar la categoria
let categoriaActual = null


//elementos de categorias
const listaCategorias = document.getElementById('categories-list')
const btnAgregarCategoria = document.getElementById('btn-show-add-category')
const modalCategoria = document.getElementById('category-modal')
const formCategoria = document.getElementById('form-add-category')
const inputNombreCategoria = document.getElementById('new-category-name')
const btnCancelarCategoria = document.getElementById('btn-cancel-category')


//elementos e sites
const tablaSites = document.getElementById('sites-table')
const cuerpoTablaSites = document.getElementById('sites-list')
const mensajeVacio = document.getElementById('sites-placeholder')
const btnAgregarSite = document.getElementById('btn-show-add-site')

//elementos del modal
const modalSite = document.getElementById('site-modal')
const formSite = document.getElementById('form-add-site')
const btnCancelarSite = document.getElementById('btn-cancel-site')
const inputNombreSite = document.getElementById('new-site-name')
const inputUsuarioSite = document.getElementById('new-site-user')
const inputPasswordSite = document.getElementById('new-site-pass')
const inputUrlSite = document.getElementById('new-site-url')
const inputDescripcionSite = document.getElementById('new-site-desc')
const inputBuscador = document.getElementById('search-input')
const btnGenerarPass = document.getElementById('btn-generate-pass')
const inputIconoCategoria = document.getElementById('new-category-icon')


//funciones de categorias
//obtener todas las categorias
async function cargarCategoria() {
    const res = await fetch(`${API_URL}/categories`)
    const categorias = await res.json()
    mostrarCategorias(categorias)
}

//mostrar categorias en la lista
function mostrarCategorias(categorias) {
    listaCategorias.innerHTML = ''
    categorias.forEach(categoria => {
        const li = document.createElement('li')
        li.dataset.id = categoria.id

        //nombre categoria
        const nombre = document.createElement('span')
        nombre.textContent = categoria.name
        nombre.classList.add('category-name')

        //boton de eliminar
        const btnEliminar = document.createElement('button')
        btnEliminar.textContent = 'Eliminar'
        btnEliminar.classList.add('delete-btn')

        li.appendChild(nombre)
        li.appendChild(btnEliminar)
        listaCategorias.appendChild(li)

        //si esta categoria es la actual, marcarla como seleccionada
        if (categoria.id === categoriaActual) {
            li.classList.add('selected')
        }
    })

    //si la categoria seleccionada fue eliminada, resetear
    if (categoriaActual && !categorias.find(cat => cat.id === categoriaActual)) {
        resetearSeleccion()
    }
}

//guardar nueva categoria
async function guardarCategoria(evento) {
    evento.preventDefault()

    const nombre = inputNombreCategoria.value.trim()

    if (!nombre) {
        alert("El nombre de la categoría es obligatorio.")
        return
    }

    const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: nombre })
        
    })
    if (res.ok) {
        modalCategoria.close()
        inputNombreCategoria.value = ''
        cargarCategoria()
    } else {
        alert("Error al guardar la categoría.")
    }
}

//eliminar categoria
async function eliminarCategoria(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
        return
    }
    const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        cargarCategoria()
    } else {
        alert("Error al eliminar la categoría.")
    }
}

//seleccionar categoria
function seleccionarCategoria(id) {
    categoriaActual = id

    listaCategorias.querySelectorAll('li').forEach(li => {
        li.classList.remove('selected')
    })

    const liSeleccionada = listaCategorias.querySelector(`li[data-id='${id}']`)
    if (liSeleccionada) {
        liSeleccionada.classList.add('selected')
    }

    btnAgregarSite.disabled = false

    cargarSites(id)
}

//resetear la seleccion cuando no hay categoria
function resetearSeleccion() {
    categoriaActual = null
    btnAgregarSite.disabled = true
    mensajeVacio.textContent = 'Selecciona una categoría para ver sus sites.'
    mensajeVacio.style.display = 'block'
    tablaSites.style.display = 'none'
    cuerpoTablaSites.innerHTML = ''
}

//cargar sites de una categoria
async function cargarSites(categoriaId) {
    const res = await fetch(`${API_URL}/categories/${categoriaId}`)
    const categoria = await res.json()
    mostrarSites(categoria.sites)
}

//funciones de sites
//mostrar sites en la tabla
function mostrarSites(sites) {
    cuerpoTablaSites.innerHTML = ''

    if (sites.length === 0) {
        mensajeVacio.textContent = 'No hay sites en esta categoría.'
        mensajeVacio.style.display = 'block'
        tablaSites.style.display = 'none'
        return
    }

    mensajeVacio.style.display = 'none'
    tablaSites.style.display = 'table'

    sites.forEach(site => {
        const tr = document.createElement('tr')
        tr.dataset.id = site.id

        const fecha = new Date(site.createdAt).toLocaleDateString()

        tr.innerHTML = `
            <td>${site.name}</td>
            <td>${site.user}</td>
            <td>${fecha}</td>
            <td>
            <button class="action-btn view-btn" title="Ver URL">
                    <i data-lucide="eye"></i>
                </button>
                <button class="action-btn edit-btn" title="Editar">
                    <i data-lucide="pencil"></i>
                </button>
                <button class="action-btn delete-site-btn" title="Eliminar">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        `
        cuerpoTablaSites.appendChild(tr)
    })

    lucide.createIcons()
}


//guardar nuevo site
async function guardarSite(evento) {
    evento.preventDefault()

    const nombre = inputNombreSite.value.trim()
    const usuario = inputUsuarioSite.value.trim()
    const password = inputPasswordSite.value.trim()

    if (!nombre || !usuario || !password) {
        alert("Los campos Nombre, Usuario y Contraseña son obligatorios.")
        return
    }

    const nuevoSite = {
        name: nombre,
        user: usuario,
        password: password,
        url: inputUrlSite.value.trim(),
        description: inputDescripcionSite.value.trim()
    }

    const res = await fetch(`${API_URL}/categories/${categoriaActual}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoSite)
    })

    if (res.ok) {
        modalSite.close()
        formSite.reset()
        cargarSites(categoriaActual)
    } else {
        alert("Error al guardar el site.")
    }
}

//eliminar site
async function eliminarSite(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este site?")) {
        return
    }

    const res = await fetch(`${API_URL}/sites/${id}`, {
        method: 'DELETE'
    })

    if (res.ok) {
        cargarSites(categoriaActual)
    } else {
        alert("Error al eliminar.")
    }
}

//eventos
//cargar categorias al iniciar
document.addEventListener('DOMContentLoaded', cargarCategoria)

//eventos de categorias
btnAgregarCategoria.addEventListener('click', () => modalCategoria.showModal())
btnCancelarCategoria.addEventListener('click', () => modalCategoria.close())
formCategoria.addEventListener('submit', guardarCategoria)

listaCategorias.addEventListener('click', (evento) => {
    const elemento = evento.target

    if (elemento.classList.contains('category-name')) {
        const id = elemento.parentElement.dataset.id
        seleccionarCategoria(id)
    }

    if (elemento.classList.contains('delete-btn')) {
        const id = elemento.parentElement.dataset.id
        eliminarCategoria(id)
    }
})

//eventos de sites
btnAgregarSite.addEventListener('click', () => modalSite.showModal())
btnCancelarSite.addEventListener('click', () => modalSite.close())
formSite.addEventListener('submit', guardarSite)

cuerpoTablaSites.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.delete-site-btn')

    if (boton) {
        const fila = boton.closest('tr')
        const id = fila.dataset.id
        eliminarSite(id)
    }
})


//generar contraseñas aleatorias
function generarContrasenaSegura(longitud = 12) {
    const mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const minusculas = "abcdefghijklmnopqrstuvwxyz"
    const numeros = "0123456789"
    const simbolos = "!@#$%^&*()_+{}[]<>?/|=-"

    const todo = mayusculas + minusculas + numeros + simbolos

    let password = ""

    // hace que haya uno de cadfa tipo
    password += mayusculas[Math.floor(Math.random() * mayusculas.length)]
    password += minusculas[Math.floor(Math.random() * minusculas.length)]
    password += numeros[Math.floor(Math.random() * numeros.length)]
    password += simbolos[Math.floor(Math.random() * simbolos.length)]

    //completa la longutud que quieres de la contraseña
    for (let i = password.length; i < longitud; i++) {
        password += todo[Math.floor(Math.random() * todo.length)]
    }

    // Mezclar al azar el resultado
    return password.split('').sort(() => Math.random() - 0.5).join('')
}

//te la genera y te la pone en el input
btnGenerarPass.addEventListener('click', () => {
    const pass = generarContrasenaSegura(8)
    inputPasswordSite.value = pass
})


//buscador por categorias
function filtrarCategorias(texto) {
    const textoLower = texto.toLowerCase()

    listaCategorias.querySelectorAll('li').forEach(li => {
        const nombreCategoria = li.querySelector('.category-name').textContent.toLowerCase()

        li.style.display = nombreCategoria.includes(textoLower) ? 'flex' : 'none'
    })
}


function filtrarSitios(texto) {
    const textoLower = texto.toLowerCase()

    cuerpoTablaSites.querySelectorAll('tr').forEach(tr => {
        const columnas = Array.from(tr.children).map(td => td.textContent.toLowerCase())
        const coincide = columnas.some(col => col.includes(textoLower))

        tr.style.display = coincide ? '' : 'none'
    })
}


inputBuscador.addEventListener('input', () => {
    const texto = inputBuscador.value.trim()

    filtrarCategorias(texto)

    if (categoriaActual) {
        filtrarSitios(texto)
    }
})
