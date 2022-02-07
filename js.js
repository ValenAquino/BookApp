//tools
const editBtn =  document.getElementById("add-btn");
const removeBtn = document.getElementById("remove-btn");
const saveBtnTool = document.getElementById("save-btn2");
// modales
const addBookModal = document.querySelector(".add-book-modal"); // fondo oscuro
const bookModalForm = document.querySelector(".modal_form"); // ventana emergente
const cerrarModal = document.querySelector(".cerrar"); // cruz de la ventana emergent
const saveBtn = document.getElementById("save-btn");
// cards
const cardContainer = document.querySelector(".cards-container");
const books = [];
var cantLib = 0;

class Libro {
    constructor(title, pages, author, read){
        this.title = title;
        this.pages = pages;
        this.author = author;
        this.read = read;
    }

    card(){
        const card = document.createElement("DIV");
        cantLib++;
        card.classList.add("book-card");
        card.appendChild(this.nodoDatos());
        card.appendChild(this.nodoSwitch());

        return card;
    }

    nodoDatos(){
        const dataContainer = document.createElement("DIV")
        const botonCerrar = document.createElement("DIV");
        const datosLibro = document.createElement("DIV");
        
        botonCerrar.innerHTML = `<div class="quitarContainer"><span class="quitar"> - </span></div>`;
        datosLibro.innerHTML = `<h3>${this.title}</h3>   
                                <span>${this.author}<br></span>
                                <span>Páginas: <b>${this.pages}</b></span>`;
                                
        dataContainer.appendChild(botonCerrar);
        dataContainer.appendChild(datosLibro);

        return dataContainer;
    }

    nodoSwitch(){
        const  switchCard = document.createElement("DIV");
        const span = document.createElement("SPAN");
        const input = document.createElement("INPUT");
        const label = document.createElement("LABEL");

        span.textContent = "Leido";

        input.classList.add("input-switch");
        input.classList.add("input-switch-card");
        input.setAttribute(`type`, `checkbox`);
        input.setAttribute(`name`, `read`);
        input.setAttribute(`id`, `switch-${cantLib}`);
        input.checked = this.read;

        label.classList.add("switch-lbl");
        label.setAttribute("for", `switch-${cantLib}`);

        switchCard.classList.add("switch");
        switchCard.classList.add("switch-card");
        switchCard.appendChild(span);
        switchCard.appendChild(input);
        switchCard.appendChild(label);

        return switchCard;
    }
}

// Funciones pre-definidas

function desplegarListaGuardada(){
    if(localStorage.getItem("libros") != null){
        const booksSaved = localStorage.getItem("libros");
        for (let libro of JSON.parse(booksSaved))
            books.push(libro); 
    }
    
    for (let book of books) {
        const libro = new Libro(book.title, book.pages, book.author, book.read);
        agregarLibro(libro);
    }
}

function agregarLibro(libro) {
    cardContainer.appendChild(libro.card());
}

function agregarLibroLocalStorage(libro){
    books.push(libro);
    agregarLibro(libro);
    if(localStorage.getItem("libros") != null){
        localStorage.removeItem("libros");
        localStorage.setItem("libros", JSON.stringify(books));
    }
    else
    localStorage.setItem("libros", JSON.stringify(books));
}

function ocultarModal(modal) {
    modal.style.display = "none";
}

// Eventos

editBtn.addEventListener("click", (e)=>{
    addBookModal.style.display = "flex";
});

cerrarModal.addEventListener("click", (e)=>{
    ocultarModal(addBookModal);
})

saveBtn.addEventListener("click", (e)=>{
    const form = document.querySelector(".modal_form")
    const title = document.getElementById("title").value;
    const pages = document.getElementById("pages").value;
    const author = document.getElementById("author").value;
    const read  = document.getElementById("switch-modal").checked;
    const libro = new Libro(title, pages, author, read);

    e.preventDefault();
    agregarLibroLocalStorage(libro);
    ocultarModal(addBookModal);
    form.reset();
});

removeBtn.addEventListener("click", (e)=>{
    const removeContainers = document.querySelectorAll(".quitarContainer");

    removeContainers.forEach(container => {container.style.display = "inline-block"});
    removeBtn.style.display = "none";
    saveBtnTool.style.display = "inline-block"
})

saveBtnTool.addEventListener("click", (e)=>{
    const removeContainers = document.querySelectorAll(".quitarContainer");

    removeContainers.forEach(container => {container.style.display = "none"});
    removeBtn.style.display = "inline-block";
    saveBtnTool.style.display = "none";
});

// Código que se debe ejecutar siempre

desplegarListaGuardada();