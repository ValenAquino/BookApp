const editBtn =  document.getElementById("edit-btn");
const removeBtn = document.getElementById("remove-btn");
const addBookModal = document.querySelector(".add-book-modal");
const bookModalForm = document.querySelector(".modal_form");
const cerrarModal = document.querySelector(".cerrar");
const saveBtn = document.getElementById("save-btn");
const saveBtnTool = document.getElementById("save-btn2");
const cardContainer = document.querySelector(".cards-container");
const books = [];
var booksAmount = 0;

class Libro {
    constructor(title, pages, author, read){
        this.title = title;
        this.pages = pages;
        this.author = author;
        this.read = read;
    }

    info(){
        console.log(`Libro: ${this.title}, Autor: ${this.author}, Páginas: ${this.pages}, Read: ${this.read}`);
    }

    card(){
        let checked_value = '';
        booksAmount++;
        if(this.read)
            checked_value = "checked"

        return `<div class="book-card">
                    <div class="quitarContainer"><span class="quitar"> - </span></div>
                    <h3>${this.title}</h3>   
                    <span>${this.author}<br> </span>
                    <span>Páginas: <b>${this.pages}</b> </span>
                    <div class="switch switch-card">
                    <span>Leido</span>
                    <input type="checkbox" class = "input-switch" name="read" id="switch-${booksAmount}" ${checked_value}>
                    <label for="switch-${booksAmount}" class="switch-lbl"></label>
                    </div>
                    </div>`
                }
            }
            
// Funciones pre-definidas

function agregarLibro(libro) {
    const div = document.createElement("DIV");
    div.innerHTML = libro.card();
    cardContainer.appendChild(div);
}

 function agregarLibroLocal(libro){
    books.push(libro);
    agregarLibro(libro);
    if(localStorage.getItem("libros") != null){
        localStorage.removeItem("libros");
        localStorage.setItem("libros", JSON.stringify(books));
    }
    else {
        localStorage.setItem("libros", JSON.stringify(books));
    }
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
    agregarLibroLocal(libro);
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

const deleteBtns = document.querySelectorAll(".quitar");

deleteBtns.forEach(deleteBtn => deleteBtn.addEventListener("click", (e)=> {
    console.log(e);
}));

// Código que se debe ejecutar siempre

if(localStorage.getItem("libros") != null){
    const booksSaved = localStorage.getItem("libros");
    for (let libro of JSON.parse(booksSaved)) {
        books.push(libro); 
    }
}

for (let book of books) {
    const libro = new Libro(book.title, book.pages, book.author, book.read);
    agregarLibro(libro);
}