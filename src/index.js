let addToy = false;
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");

addBtn.addEventListener("click", () => {
  // hide & seek with the form
  addToy = !addToy;
  if (addToy) {
    toyFormContainer.style.display = "block";
  } else {
    toyFormContainer.style.display = "none";
  }
});

//////////////

const toysAPI = 'http://localhost:3000/toys';
const toyCollectionElement = document.getElementById('toy-collection');
const addToyForm = document.getElementById('add-toy-form');
addToyForm.addEventListener('submit', addNewToy);

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json"
};

let toyModel = [];

fetch(toysAPI)
  .then(res => res.json())
  .then(toys => {
    toyModel = toys;
    renderToys();
  });

function renderToys() {
  toyCollectionElement.innerHTML = '';
  toyModel.forEach(renderToy);
}

function renderToy(toy) {
  const toyCard = document.createElement('div');
  toyCard.classList.add('card');

  toyCard.innerHTML = `
  <h2>${toy.name}</h2>
  <img src="${toy.image}" class="toy-avatar" />
  <p>${toy.likes} Likes</p>
  `;

  const likeButton = document.createElement('button');
  likeButton.id = toy.id;
  likeButton.textContent = 'Like ❤️';
  likeButton.addEventListener('click', () => {

    const body = JSON.stringify({
      likes: toy.likes + 1
    });

    fetch(`${toysAPI}/${toy.id}`, {
      method: 'PATCH',
      headers,
      body
    }).then(res => res.json())
      .then(() => {
        toyModel.find(t => t.id === toy.id).likes = toy.likes + 1;
        renderToys();
      });
  });
  toyCard.append(likeButton);

  toyCollectionElement.append(toyCard);
}

function addNewToy(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const image = event.target.image.value;

  const body = JSON.stringify({
    name, image, likes: 0,
  });

  console.log(body);

  fetch(toysAPI, {
    method: "POST",
    headers, body
  }).then(res => res.json())
    .then(newToy => {
      toyModel.push(newToy);
      renderToys();
    });
}