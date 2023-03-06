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
  const focusDate = document.querySelector("#focus_date");
  const clearAll = document.querySelector("#clear_all");

  let scrollPosition; // Variable to store scroll position.
  let imgInFocus = false; // Boolean to check if image is in focus, if it is then don't allow onClick on other images.
  let isHomePage = true; // Boolean to check if user is on home page or not, so the clear button position can be changed accordingly.

  searchField.addEventListener("input", (e) => {
    const className = isHomePage
      ? "clear_class_search"
      : "clear_class_searched";

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
      if (!isHomePage) {
        defaultPage(false); // If the search field is empty, go to the home page.
      }
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
      if (xhr.status === 200) {
        // 200 means the request is successful.
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

    xhr.open("GET", `https://images-api.nasa.gov/search?q=${data}`, true); // Open a new connection, using the GET request.
    xhr.send();
  };

  const displayItems = (items) => {
    for (const item of items) {
      if (item.links && item.links.length > 0) {
        const imgSrc =
          item.links[0].href !== null
            ? item.links[0].href
            : "../imgs/no_image.png";
        const imgTitle =
          item.data[0].title !== null ? item.data[0].title : "No title";
        const imgAlt =
          item.links[0].href !== null ? imgTitle : "No image found";
        const imgDesc =
          item.data[0].description !== null
            ? item.data[0].description
            : "No description";
        const imgDate =
          item.data[0].date_created !== null
            ? `Data created : ${item.data[0].date_created}`
            : "No date";

        createImageElement(imgSrc, imgAlt, imgTitle, imgDesc, imgDate);
      }
    }
  };

  const createImageElement = (imgSrc, imgAlt, imgTitle, imgDesc, imgDate) => {
    const img = document.createElement("img");
    img.addEventListener("error", () => {
      img.src = "../imgs/no_image.png";
      img.alt = "Image error";

      imgSrc = img.src;
      imgAlt = img.alt;
    });

    img.src = imgSrc;
    img.alt = imgAlt;
    outputContainer.appendChild(img);

    img.addEventListener("click", () => {
      if (!imgInFocus) {
        imgInFocus = true;
        scrollPosition = window.pageYOffset;
        focusPage(imgTitle, imgSrc, imgDesc, imgDate);
      }
    });
  };

  const removeItems = () => {
    // Remove all the images from the output container.
    while (outputContainer.firstChild) {
      outputContainer.removeChild(outputContainer.firstChild);
    }
  };

  const defaultPage = (isHistory) => {
    document.title = "NASA Image Search"; // Change the title of the page.
    isHomePage = true;

    body.classList.remove("searched_body");
    form.classList.remove("searched_class");
    searchBtn.classList.remove("searched_btn_class");
    btnContainer.classList.remove("wrapper_btn_class");
    form.classList.remove("search_class_hidden");
    footer.classList.remove("other_focus");
    searchContainer.classList.remove("other_focus");
    clearAll.classList.remove("clear_class_searched");
    clearAll.classList.remove("clear_class_search");
    focus.classList.remove("show_focus");
    title.classList.remove("hidden_title");
    error.classList.remove("show_error");
    outputContainer.classList.remove("show_output");

    title.classList.add("show_title");
    error.classList.add("hidden_error");
    outputContainer.classList.add("hidden_output");
    clearAll.classList.add("clear_class_hidden");
    form.classList.add("search_class");
    focus.classList.add("hidden_focus");

    if (!isHistory) {
      history.pushState({ state: "index" }, "default", "index.html");
    }
  };

  const loadingPage = () => {
    document.title = "Loading...";

    loading.classList.remove("hidden_loading");
    title.classList.remove("show_title");
    outputContainer.classList.remove("show_output");
    error.classList.remove("show_error");
    focus.classList.remove("show_focus");

    loading.classList.add("show_loading");
    title.classList.add("hidden_title");
    outputContainer.classList.add("hidden_output");
    error.classList.add("hidden_error");
    focus.classList.add("hidden_focus");
    body.classList.add("searched_body");
    form.classList.add("search_class_hidden");
    clearAll.classList.add("hidden_clear_class");
  };

  const resultPage = (data, text, isHistory) => {
    document.title = `${text} - NASA Image Search`;
    isHomePage = false;

    loading.classList.remove("show_loading");
    outputContainer.classList.remove("hidden_output");
    error.classList.remove("show_error");
    form.classList.remove("search_class_hidden");
    footer.classList.remove("other_focus");
    searchContainer.classList.remove("other_focus");
    outputContainer.classList.remove("other_focus");
    clearAll.classList.remove("clear_class_search");
    focus.classList.remove("show_focus");

    clearAll.classList.add("clear_class_searched");
    searchBtn.classList.add("searched_btn_class");
    btnContainer.classList.add("wrapper_btn_class");
    form.classList.add("searched_class");
    loading.classList.add("hidden_loading");
    outputContainer.classList.add("show_output");
    error.classList.add("hidden_error");
    focus.classList.add("hidden_focus");

    if (!isHistory) {
      history.pushState(
        { state: `search:${data}` }, // Make the state an object with a prefix to know what type of state it is and the data.
        text, // The title of the page, most browsers don't use this yet but it's for future proofing.
        `search+${data}.html`
      );
    }
  };

  const focusPage = (imgTitle, imgSrc, imgDesc, imgDate) => {
    focusTitle.textContent = imgTitle;
    focusImg.src = imgSrc;
    focusImg.alt = imgTitle;
    focusDesc.textContent = imgDesc;
    focusDate.textContent = imgDate;

    focus.classList.remove("hidden_focus");

    focus.classList.add("show_focus");
    footer.classList.add("other_focus");
    searchContainer.classList.add("other_focus");
    outputContainer.classList.add("other_focus");

    outputContainer.scrollTo(0, scrollPosition); // Absolute positioning makes the scroll position lost, so we need to scroll back to the previous position.
    window.scrollTo(0, 0); // Scroll to the top of the page.

    close.addEventListener("click", () => {
      notFocusPage();
    });
  };

  const notFocusPage = () => {
    imgInFocus = false;
    focusImg.src = "imgs/loading.gif";

    footer.classList.remove("other_focus");
    searchContainer.classList.remove("other_focus");
    outputContainer.classList.remove("other_focus");
    focus.classList.remove("show_focus");

    focus.classList.add("hidden_focus");
    focus.classList.add("hidden_focus");

    window.scrollTo(0, scrollPosition); // Scroll back to the previous position.
  };

  const errorPage = (errorMessage) => {
    const errorMsg = document.querySelector("#error p");
    const errorBtn = document.querySelector("#error button");

    errorMsg.textContent = errorMessage;

    loading.classList.remove("show_loading");
    title.classList.remove("show_title");
    error.classList.remove("hidden_error");
    outputContainer.classList.remove("show_output");
    form.classList.remove("search_class");
    footer.classList.remove("other_focus");

    body.classList.add("searched_body");
    form.classList.add("search_class_hidden");
    title.classList.add("hidden_title");
    error.classList.add("show_error");
    loading.classList.add("hidden_loading");
    focus.classList.add("hidden_focus");
    outputContainer.classList.add("hidden_output");

    errorBtn.addEventListener("click", () => {
      defaultPage(false);
      searchField.value = "";
    });
  };

  window.addEventListener("popstate", (e) => {
    imgInFocus = false; // Reset the image in focus variable.
    if (e.state.state === "index") {
      defaultPage(true);
      searchField.value = "";
    } else if (e.state.state.startsWith("search")) {
      getQuery(e.state.state.split(":")[1], true);
      // Using split I can get all the data after the colon. 1 to say second part of the string.
      searchField.value = decodeURIComponent(e.state.state.split(":")[1]);
    }
  });

  // This replaces the default state so when I can make the state index in other parts of the code, and it goes to the default state.
  history.replaceState({ state: "index" }, "default", "index.html");
});
