//Selektovanje elemenata
const searchInput = document.getElementById("search");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const addBtn = document.getElementById("addBtn");
const bookList = document.getElementById("bookList");

// dva niza gde cemo cuvati elemente
let books = [];
let filteredBooks = [];
// uzimanje iz local storaga
const savedBooks = localStorage.getItem("books");

if (savedBooks) {
  books = JSON.parse(savedBooks);
  renderBooks();
}

addBtn.addEventListener("click", function () {
  const title = titleInput.value;
  const author = authorInput.value;
  // Ako neko polje nije popunjeno  prekini funkciju
  if (!title || !author) return;

  const book = {
    title: title,
    author: author,
    borrowed: false,
    borrowedBy: "",
  };

  books.push(book);
  saveBooks();
  renderBooks();

  titleInput.value = "";
  authorInput.value = "";
});

//Funkcija za renderovanje knjiga
function renderBooks() {
  bookList.innerHTML = "";

  // prolaz kroz svaku knjigu u nizu
  books.forEach(function (book, index) {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${book.title}</strong> - ${book.author}
      <br>
      Status: ${book.borrowed ? `Izdata (${book.borrowedBy})` : "Dostupna"}

      <br><br>

      <button onclick="toggleBorrow(${index})">
        ${book.borrowed ? "Vrati knjigu" : "Zaduži knjigu"}
      </button>

      <button onclick="deleteBook(${index})">
        ❌
      </button>

      <hr>
    `;
    // Dodaje se li element u un order listu
    bookList.appendChild(li);
  });
}
function deleteBook(index) {
  books.splice(index, 1);
  saveBooks();
  renderBooks();
}

function toggleBorrow(index) {
  // Ako knjiga nije izdata
  if (!books[index].borrowed) {
    const userName = prompt("Ko uzima knjigu?");
    // Ako korisnik nije uneo ime prekidaj
    if (!userName) return;

    books[index].borrowed = true;
    books[index].borrowedBy = userName;
  } else {
    books[index].borrowed = false;
    books[index].borrowedBy = "";
  }

  saveBooks();
  renderBooks();
}
searchInput.addEventListener("input", function () {
  const value = searchInput.value.toLowerCase();

  filteredBooks = books.filter(function (book) {
    return (
      book.title.toLowerCase().includes(value) ||
      book.author.toLowerCase().includes(value)
    );
  });

  renderFilteredBooks();
});
function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
}
function renderFilteredBooks() {
  // Brise trenutni prikaz
  bookList.innerHTML = "";
  // Prolazi kroz filtrirane knjige
  filteredBooks.forEach(function (book) {
    const li = document.createElement("li");
    // Ubacuje naziv i autora
    li.innerHTML = `
      <strong>${book.title}</strong> - ${book.author}
    `;
    // Dodaje li u listu
    bookList.appendChild(li);
  });
}
