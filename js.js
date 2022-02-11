//tools
const addBtn =  document.getElementById("add-btn");
const removeBtn = document.getElementById("remove-btn");
const saveBtnTool = document.getElementById("save-btn2");
// modales
const addBookModal = document.querySelector(".add-book-modal"); // fondo oscuro
const bookModalForm = document.querySelector(".modal_form"); // ventana emergente
const btnCerrarModal = document.querySelector(".cerrar"); // cruz de la ventana emergente
const saveBtn = document.getElementById("save-btn");
// cards
const cardContainer = document.querySelector(".cards-container");
let books = [];
var cantLib = 0;

class Libro {
    constructor(title, pages, author, read, id){
        this.title = title;
        this.pages = pages;
        this.author = author;
        this.read = read;
        this.id = id;
    }

    setId(nuevoID){
        this.id = nuevoID;
    }

    card(){
        const card = document.createElement("DIV");
        this.setId(cantLib);
        card.classList.add("book-card");
        card.classList.add("book-card-style");
        card.setAttribute("id", `card-${this.id}`);
        card.appendChild(this.nodoEliminar());
        card.appendChild(this.nodoDatos());
        card.appendChild(this.nodoSwitch());

        return card;
    }

    nodoEliminar(){
        const botonEliminar = document.createElement("DIV");
        
        botonEliminar.classList.add("quitarContainer");
        botonEliminar.innerHTML = `<span class="botonEditar quitar"> - </span>`;
        botonEliminar.addEventListener("click", (e)=>{eliminarLibro(this.id, botonEliminar)});
        
        return botonEliminar;
    }
    
    nodoDatos(){
        const dataContainer = document.createElement("DIV");
        const datosLibro = document.createElement("DIV");
        const titulo = `<h3>${this.id}) ${this.title}</h3>`;
        const spanAutor = `<span>${this.author}<br></span>`;
        const spanPages = `<span>Páginas: <b>${this.pages}</b></span>`;
        
        datosLibro.innerHTML = `${titulo} ${spanAutor} ${spanPages}`;
        dataContainer.appendChild(datosLibro);
        
        return dataContainer;
    }
    
    nodoSwitch(){
        const switchCard = document.createElement("DIV");
        const span = document.createElement("SPAN");
        const label = document.createElement("LABEL");
        const input = this.hadleInputSwitch();
        
        span.textContent = "Leido";
        label.classList.add("switch-lbl");
        label.setAttribute("for", `switch-${this.id}`);
        
        switchCard.classList.add("switch");
        switchCard.classList.add("switch-card");
        switchCard.appendChild(span);
        switchCard.appendChild(input);
        switchCard.appendChild(label);
        
        return switchCard; 
    }
    
    hadleInputSwitch() {
        const input = document.createElement("INPUT");
        input.classList.add("input-switch");
        input.classList.add("input-switch-card");
        input.setAttribute(`type`, `checkbox`);
        input.setAttribute(`name`, `read`);
        input.setAttribute(`id`, `switch-${this.id}`);
        input.checked = this.read;
        input.addEventListener("click", (e) => actualizarCheckBox(input, this.id));
        
        return input;
    }
    
    estaParaBorrar() {
        const card = document.getElementById(`switch-${this.id}`);

        return card.classList.contains("book-card-delete");
    }
};

// Funciones pre-definidas

function desplegarLibros(){
    cantLib = 0;
    for (let book of books) {
        const libro = new Libro(book.title, book.pages, book.author, book.read, cantLib);
        agregarLibro(libro);
    }
}

function desplegarListaGuardada(){
    if(localStorage.getItem("libros") != null){
        const booksSaved = localStorage.getItem("libros");
        for (let libro of JSON.parse(booksSaved))
        books.push(libro); 
    }
    desplegarLibros();
}

function agregarLibro(libro) {
    cardContainer.appendChild(libro.card());
    cantLib++;
}

function guardarBooksLocal(){
    localStorage.removeItem("libros");
    if(books.length > 0)
    localStorage.setItem("libros", JSON.stringify(books));
}

function agregarLibroLocalStorage(libro){
    books.push(libro);
    agregarLibro(libro);
    if(localStorage.getItem("libros") != null)
    guardarBooksLocal();
    else
    localStorage.setItem("libros", JSON.stringify(books));
}

function ocultarModal(modal) {
    modal.style.display = "none";
    document.body.classList.remove("bloquearScroll");
}

function actualizarCheckBox(input, bookIndex) {
    const newValue = input.checked;

    books[bookIndex].read = newValue;
    guardarBooksLocal();
}

function eliminarLibro(idxLibro, btn) {
    const libroParaQuitar = document.getElementById(`card-${idxLibro}`);
    
    if(libroParaQuitar.classList.contains("book-card-style")){
        libroParaQuitar.classList.remove("book-card-style");
        libroParaQuitar.classList.add("book-card-delete");
        btn.innerHTML =  `<span class="botonEditar agregar"> + </span>`;
    }
    else {
        libroParaQuitar.classList.add("book-card-style");
        libroParaQuitar.classList.remove("book-card-delete");
        btn.innerHTML =  `<span class="botonEditar quitar"> - </span>`;
    };
};

function cardContainerReset(){
    cardContainer.innerHTML = "";
}

function desplegarBotonesBorrarLibro(){
    const removeContainers = document.querySelectorAll(".quitarContainer");

    removeContainers.forEach(container => {container.style.display = "none"});
    removeBtn.style.display = "inline-block";
    saveBtnTool.style.display = "none";
}

function tieneClaseDelete(libro) {
    return document.getElementById(`card-${libro.id}`).classList.contains("book-card-delete");
}

function reasignarIDLibros() {
    for (const i in books) {
        books[i].setId(i);
    }
}

function actualizarListaLibros(){
    const librosABorrar = books.filter(libro => tieneClaseDelete(libro));
    const librosFiltrados = books.filter(libro => !librosABorrar.includes(libro));
    books = librosFiltrados;
    console.log(librosABorrar);
    console.log(books);
    reasignarIDLibros();
}

// Eventos

addBtn.addEventListener("click", (e)=>{
    addBookModal.style.display = "flex";
    document.body.classList.add("bloquearScroll");
});

addBookModal.addEventListener("click", (e)=>{
    if(!((e.target == bookModalForm || e.target != addBookModal) && e.target != btnCerrarModal)){
        ocultarModal(addBookModal);
        bookModalForm.reset();
    }
});

btnCerrarModal.addEventListener("click", (e)=>{
    ocultarModal(addBookModal);
});

saveBtn.addEventListener("click", (e)=>{
    const form = document.querySelector(".modal_form")
    const title = document.getElementById("title").value;
    const pages = document.getElementById("pages").value;
    const author = document.getElementById("author").value;
    const read  = document.getElementById("switch-modal").checked;
    const libro = new Libro(title, pages, author, read, cantLib);
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
    desplegarBotonesBorrarLibro();
    actualizarListaLibros();
    cardContainerReset();
    desplegarLibros();
    guardarBooksLocal();
});

// Código que se debe ejecutar siempre
desplegarListaGuardada();