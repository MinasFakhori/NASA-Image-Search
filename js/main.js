window.addEventListener("load", () => {
  // DOM Elements
  const form = document.querySelector("#search_form");
  const loading = document.querySelector("#loading");
  const outputContainer = document.querySelector("#output_container");
  const title = document.querySelector("#title");
  const body = document.querySelector("body");
  const btnContainer = document.querySelector("#btn_container");
  const searchBtn = document.querySelector("#search_btn");
  const searchField = document.querySelector("#search_input");
  const error = document.querySelector("#error");
  const focus = document.querySelector("#focus");
  const footer = document.querySelector("footer");
  const searchContainer = document.querySelector("#search_container");
  const close = document.querySelector("#close");
  const focusTitle = document.querySelector("#focus_title");
  const focusImg = document.querySelector("#focus_img");
  const focusDesc = document.querySelector("#focus_desc");
  const clearAll = document.querySelector("#clear_all");

  let scrollPosition; // Variable to store scroll position.
  let imgInFocus = false; // Boolean to check if image is in focus, if it is then don't allow onClick on other images.
  let isHomePage = true; // Boolean to check if user is on home page or not, so the clear button position can be changed accordingly.

  searchField.addEventListener("input", (e) => {
    let className = isHomePage ? "clear_class_search" : "clear_class_searched";

    // If the search field is not empty, show the clear button.
    if (e.target.value.length > 0) {
      clearAll.classList.add(className);
      clearAll.classList.remove("clear_class_hidden");
    } else {
      clearAll.classList.remove(className);
      clearAll.classList.add("clear_class_hidden");
    }
  });

  clearAll.addEventListener("click", (e) => {
    e.preventDefault();
    searchField.value = "";
    clearAll.classList.remove("clear_class_search");
    clearAll.classList.remove("clear_class_searched");
    clearAll.classList.add("clear_class_hidden");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchText = document.querySelector("#search_input").value;
    if (searchText.trim().length < 1) {
      defaultPage(); // If the search field is empty, go to the home page.
    } else {
      const data = encodeURIComponent(searchText);
      getQuery(data, false);
    }
  });

  /*
  isHistory is a boolean to check if the user is going back to a previous page or not, if they are I don't want to add that to the history state.
  isHistory stops from the history state being in a infinite loop.
   */
  const getQuery = (data, isHistory) => {
    loadingPage();
    removeItems();
    const text = decodeURIComponent(data);

    const xhr = new XMLHttpRequest(); // Create a new XMLHttpRequest object.
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) { // 200 means the request is successful.
        resultPage(data, text, isHistory);
        const response = JSON.parse(xhr.responseText);
        const items = response.collection.items;
        if (items.length > 1) {
          displayItems(items);
        } else {
          errorPage(`No result found for ${text}`);
        }
      } else {
        errorPage(`Something went wrong! ${xhr.status} error status code`);
      }
    });

    xhr.open("GET", `https://images-api.nasa.gov/search?q=${data}`, true); // Open a new connection, using the GET request on the URL endpoint.
    xhr.send();
  };

  const displayItems = (items) => {
    for (const item of items) {
      if (item.links && item.links.length > 0) {
        const imgSrc = item.links[0].href;
        const imgTitle = item.data[0].title;
        const imgDesc = item.data[0].description;

        createImageElement(imgSrc, imgTitle, imgDesc); 
      }
    }
  };

  const createImageElement = (imgSrc, imgTitle, imgDesc) => {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = imgTitle;
    img.classList.add("imgs");
    outputContainer.appendChild(img);

    img.addEventListener("click", () => {
      if (!imgInFocus) {
        imgInFocus = true;
        scrollPosition = window.pageYOffset;
        focusPage(imgTitle, imgSrc, imgDesc);
      }
    });
  };

  close.addEventListener("click", () => {
    footer.classList.remove("focus_class");
    searchContainer.classList.remove("focus_class");
    outputContainer.classList.remove("focus_class");
    imgInFocus = false;
    focus.style.display = "none";

    window.scrollTo(0, scrollPosition); // Scroll back to the previous position.
  });

  const removeItems = () => { // Remove all the images from the output container.
    while (outputContainer.firstChild) {
      outputContainer.removeChild(outputContainer.firstChild);
    }
  };

  const defaultPage = () => {
    document.title = "NASA Image Search"; // Change the title of the page.
    isHomePage = true;

    title.style.display = "flex";
    focus.style.display = "none";
    error.style.display = "none";
    outputContainer.style.display = "none";

    body.classList.remove("searched_body");
    form.classList.remove("searched_class");
    searchBtn.classList.remove("searched_btn_class");
    btnContainer.classList.remove("wrapper_btn_class");
    form.classList.remove("search_class_hidden");
    footer.classList.remove("focus_class");
    searchContainer.classList.remove("focus_class");
    clearAll.classList.remove("clear_class_searched");
    clearAll.classList.remove("clear_class_search");

    clearAll.classList.add("clear_class_hidden");
    form.classList.add("search_class");
  };

  const loadingPage = () => {
    document.title = "Loading...";

    loading.style.display = "flex";
    title.style.display = "none";
    outputContainer.style.display = "none";
    error.style.display = "none";
    focus.style.display = "none";

    body.classList.add("searched_body");
    form.classList.add("search_class_hidden");
    clearAll.classList.add("hidden_clear_class");
  };

  const resultPage = (data, text, isHistory) => {
    document.title = `${text} - NASA Image Search`;
    isHomePage = false;

    outputContainer.style.display = "grid";
    error.style.display = "none";
    focus.style.display = "none";
    loading.style.display = "none";

    form.classList.remove("search_class_hidden");
    footer.classList.remove("focus_class");
    searchContainer.classList.remove("focus_class");
    outputContainer.classList.remove("focus_class");
    clearAll.classList.remove("clear_class_search");
    clearAll.classList.add("clear_class_searched");

    searchBtn.classList.add("searched_btn_class");
    btnContainer.classList.add("wrapper_btn_class");
    form.classList.add("searched_class");

    if (!isHistory) {
      history.pushState(
        { state: `search:${data}` }, // Make the state an object with a prefix to know what type of state it is and the data. 
        text, // The title of the page, most browsers don't use this yet but it's for future proofing.
        `search+${data}.html`
      );
    }
  };

  const focusPage = (imgTitle, imgSrc, imgDesc) => {
    focusTitle.textContent = imgTitle;
    focusImg.src = imgSrc;
    focusImg.alt = imgTitle;
    focusDesc.textContent = imgDesc;

    focus.style.display = "flex";

    footer.classList.add("focus_class");
    searchContainer.classList.add("focus_class");
    outputContainer.classList.add("focus_class");
  };

  const errorPage = (errorMessage) => {
    const errorMsg = document.querySelector("#error_msg");
    const errorBtn = document.querySelector("#error_btn");

    errorMsg.textContent = errorMessage;

    loading.style.display = "none";
    title.style.display = "none";
    outputContainer.style.display = "none";
    focus.style.display = "none";
    error.style.display = "flex";

    form.classList.remove("search_class");
    footer.classList.remove("focus_class");

    body.classList.add("searched_body");
    form.classList.add("search_class_hidden");

    errorBtn.addEventListener("click", () => {
      defaultPage();
      searchField.value = "";
    });
  };

  window.addEventListener("popstate", (e) => {
    imgInFocus = false; // Reset the image in focus variable.
    if (e.state.state === "index") {
      defaultPage();
      searchField.value = "";
    } else if (e.state.state.startsWith("search")) { 
      getQuery(e.state.state.split(":")[1], true); 
      // Using split I can get all the data after the colon. 1 to say second part of the string.
      searchField.value = decodeURIComponent(e.state.state.split(":")[1]);
      // searchField.setAttribute('value', e.state.state.split(":")[1]);
    }
  });

  // This replaces the default state with a custom state so I can use it in the popstate.
  history.replaceState({ state: "index" }, "default", "index.html");
});
