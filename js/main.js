const add_parot_form = document.querySelector(".add-parrot");
let sortBy = document.querySelector("#sortby");
let addParrotInputs = document.querySelectorAll(".form-add-parrot");
const parrotWrapper = document.querySelector(".parrot-wrapper");
const templateParrot = document.querySelector(
  ".parrot-wrapper__template"
).content;
const filterForm = document
  .querySelector(".filter")
  .addEventListener("submit", handleFilter);

let sortObject = {
  name: function (a, b) {
    if (a.title < b.title) {
      return -1;
    } else {
      return 1;
    }
  },
  priceLowest(a, b) {
    if (a.price > b.price) {
      return -1;
    } else {
      return 1;
    }
  },
  priceHighest(a, b) {
    if (a.price < b.price) {
      return -1;
    } else {
      return 1;
    }
  },
  brithHighest(a, b) {
    if (a.birthDate < b.birthDate) {
      return -1;
    } else {
      return 1;
    }
  },
  brithLowest(a, b) {
    if (a.birthDate > b.birthDate) {
      return -1;
    } else {
      return 1;
    }
  },
};
function handleFilter(event) {
  event.preventDefault();
  let data = new FormData(event.target);
  let regex = new RegExp(data.get("search"), "gi");
  let filter = [];
  if (data.get("search").length > 0) {
    filter = parrots.filter((item) => item.title.match(regex));
  }
  let fromPrice = data.get("from-price");
  let toPrice = data.get("to-price");
  let fromWidth = data.get("from-width");
  let toWidth = data.get("to-width");
  let fromHeight = data.get("from-height");
  let toHeight = data.get("to-height");
  if (fromPrice.length > 0 || toPrice.length > 0) {
    filter = parrots.filter((item) => item.price >= fromPrice);
    filter = filter.filter((item) => item.price <= toPrice);
  }
  if (fromWidth.length > 0 || toWidth.length > 0) {
    filter = parrots.filter((item) => item.sizes.width >= fromWidth);
    filter = filter.filter((item) => item.sizes.width <= toWidth);
  }
  if (fromHeight.length > 0 || toHeight.length > 0) {
    filter = parrots.filter((item) => item.sizes.height >= fromHeight);
    filter = filter.filter((item) => item.sizes.height <= toHeight);
  }
  if (sortBy.value !== null) {
    filter = parrots.sort(sortObject[sortBy.value]);
    console.log(sortBy);
  }
  handleRenderParrot(filter);
}
let favoritesParrot = document.querySelector(".favorite-wrapper");
let favoriteTemplate = document.querySelector(".favorit-template").content;
// let deleteParrot = document.querySelector(".delete-parrot");
let locals = getItem("parrot");
let parrots = locals ? JSON.parse(locals) : [];
let favoriteParrotLocals = getItem("favoriteparrots");
let favoriteParrot = favoriteParrotLocals
  ? JSON.parse(favoriteParrotLocals)
  : [];
function handleRemoveFavoriteParrot(event) {
  let id = event.target.dataset.id;
  for (let i = 0; i < favoriteParrot.length; i++) {
    if (favoriteParrot[i].id === id) {
      let index = parrots.findIndex((item) => item.id === favoriteParrot[i].id);
      if (parrots[index].isFavorite === true) {
        parrots[index].isFavorite = false;
      }
      handleRenderParrot(parrots);
      setItem("parrot", parrots);
      favoriteParrot.splice(i, 1);
      handleRenderFavoriteParrot(favoriteParrot);
      setItem("favoriteparrots", favoriteParrot);
    }
  }
}
function handleRenderFavoriteParrot(arr) {
  favoritesParrot.innerHTML = null;
  for (let i = 0; i < arr.length; i++) {
    let clone = favoriteTemplate.cloneNode(true);
    clone.querySelector(".favorite-wrapper__title").textContent = arr[i].title;
    let deleteBtn = clone.querySelector(".favorite-wrapper__delete");
    deleteBtn.dataset.id = arr[i].id;
    deleteBtn.addEventListener("click", handleRemoveFavoriteParrot);
    favoritesParrot.appendChild(clone);
  }
}

function handleRenderParrot(arr) {
  parrotWrapper.innerHTML = null;
  let fragmet = document.createDocumentFragment();
  for (let i = 0; i < arr.length; i++) {
    let clone = templateParrot.cloneNode(true);
    clone.querySelector(".parrot-wrapper__title").textContent = arr[i].title;
    clone.querySelector(".parrot-wrapper__img").src = arr[i].img;
    clone.querySelector(".parrot-wrapper__price mark").textContent = arr[i]
      .price
      ? "$" + arr[i].price
      : "tekin";
    clone.querySelector(
      ".parrot-wrapper__sizes"
    ).textContent = `${arr[i].sizes["width"]}sm x ${arr[i].sizes["height"]}sm `;
    let badgeTemplate = clone.querySelector(".badge-template").content;
    for (let j = 0; j < arr[i].fatures.length; j++) {
      let badgeTemplateNode = badgeTemplate.cloneNode(true);
      const element = arr[i].fatures[j];
      badgeTemplateNode.querySelector(".parrot-wrapper__badge").textContent =
        element;
      clone.querySelector(".parrot-wrapper_features").append(badgeTemplateNode);
      let iscomplate = clone.querySelector(".iscomplate");
      iscomplate.dataset.id = arr[i].id;

      iscomplate.addEventListener("click", handleIsComplate);
      let faStarO = iscomplate.querySelector(".iconka");

      if (arr[i].isFavorite === true) {
        faStarO.classList.add("fa-solid");
        faStarO.classList.add("fa-star");
      } else {
        faStarO.classList.add("fa");
        faStarO.classList.add("fa-star-o");
      }
    }
    let deleteParrot = clone.querySelector(".delete-parrot");
    deleteParrot.dataset.id = arr[i].id;
    deleteParrot.addEventListener("click", handleDeletParrot);
    clone.querySelector(".parrot-wrapper__brith-date").textContent =
      arr[i].brithDate;

    fragmet.append(clone);
  }
  parrotWrapper.appendChild(fragmet);
}
function handleAddParrot(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  let parrotObj = {
    id: uuid.v4(),
    title: formData.get("parrot-title"),
    img: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFycm90fGVufDB8fDB8fHww&w=1000&q=80",
    price: formData.get("parrot-price"),
    birthDate: formData.get("parrot-date"),
    sizes: {
      width: formData.get("parrot-width"),
      height: formData.get("parrot-height"),
    },
    isFavorite: false,
    fatures: formData.get("features").split(" "),
  };
  parrots = [...parrots, parrotObj];
  setItem("parrot", parrots);
  handleRenderParrot(parrots);
  addParrotInputs.forEach((input) => (input.value = null));
}
handleRenderParrot(parrots);
add_parot_form.addEventListener("submit", handleAddParrot);
function handleDeletParrot(event) {
  let id = event.target.dataset.id;
  for (let i = 0; i < parrots.length; i++) {
    for (let j = 0; j < favoriteParrot?.length; j++) {
      if (parrots[i].id === id || parrots[i].id === favoriteParrot[j].id) {
        parrots.splice(i, 1);
        handleRenderParrot(parrots);
        setItem("parrot", parrots);
        favoriteParrot.splice(j, 1);
        handleRenderFavoriteParrot(favoriteParrot);
        setItem("favoriteparrots", favoriteParrot);
      }
    }
    if (parrots[i]?.id === id) {
      parrots.splice(i, 1);
      handleRenderParrot(parrots);
      setItem("parrot", parrots);
    }
  }
}

handleRenderFavoriteParrot(favoriteParrot);
function handleIsComplate(event) {
  let id = event.target.dataset.id;
  let index = parrots.findIndex((item) => item.id === id);
  if (parrots[index].isFavorite === false) {
    parrots[index].isFavorite = true;
    window.addEventListener("click", handlecFavorite);
  }

  handleRenderParrot(parrots);

  setItem("parrot", parrots);
}
function handlecFavorite(event) {
  if (event.target.matches(".iscomplate")) {
    console.log(true);
    for (let i = 0; i < parrots.length; i++) {
      if (parrots[i].isFavorite === true) {
        window.removeEventListener("click", handlecFavorite);
        if (!favoriteParrot.includes(parrots[i])) {
          favoriteParrot = [...favoriteParrot, parrots[i]];
          // setItem('favoriteparrots',favoriteParrot)
        }
      }
    }
    setItem("favoriteparrots", favoriteParrot);
    handleRenderFavoriteParrot(favoriteParrot);
  }
}
