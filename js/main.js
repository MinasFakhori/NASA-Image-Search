window.addEventListener("load", () => {
  const form = document.querySelector("#form");
  const loading = document.querySelector("#loading");
  const outputContainer = document.querySelector("#output_container");
  const title = document.querySelector("#title");
  const body = document.querySelector("body");
  const wrapperButton = document.querySelector("#wrapper_btn");
  const searchBtn = document.querySelector("#search_btn");
  const searchField = document.querySelector("#search_text");
  const error = document.querySelector("#error");
  const focus = document.querySelector("#focus");
  const footer = document.querySelector("footer");
  const searchContainer = document.querySelector("#search");
  const close = document.querySelector("#close");
  const focusTitle = document.querySelector("#focus_title");
  const focusImg = document.querySelector("#focus_img");
  const focusDesc = document.querySelector("#focus_desc");
  const clearAll = document.querySelector("#clear_all");

  let imgInFocus = false;
  let scrollPosition;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchText = document.querySelector("#search_text").value;
    if (searchText.trim().length < 1) {
      defaultPage();
    } else {
      const data = encodeURIComponent(searchText);
      getQuery(data, false);
    }
  });

  const getQuery = (data, isHistory) => {
    loadingPage();
    removeItems();

    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        resultPage(data, isHistory);
        const response = JSON.parse(xhr.responseText);
        const items = response.collection.items;
        if (items.length > 1) {
          for (item of items) {
            if (item.links && item.links.length > 0) {
              const imgSrc = item.links[0].href;
              const imgTitle = item.data[0].title;
              const imgDesc = item.data[0].description;

              const img = document.createElement("img");
              img.src = imgSrc;
              img.alt = imgTitle;
              img.classList.add("imgs");
              outputContainer.appendChild(img);

              img.addEventListener("click", () => {
                if (!imgInFocus) {
                  imgInFocus = true;
                  scrollPosition = window.pageYOffset;
                  console.log(scrollPosition);

                  focusPage(isHistory, imgTitle, imgSrc, imgDesc);
                }
              });
            }
          }
        } else {
          errorPage(`No result found for ${decodeURIComponent(data)}`);
        }
      } else {
        errorPage(`Something went wrong! ${xhr.status} error status code`);
      }
    });

    xhr.open("GET", "https://images-api.nasa.gov/search?q=" + data, true);

    xhr.send();
  };

  const focusPage = (isHistory, imgTitle, imgSrc, imgDesc) => {
    footer.classList.add("focus_class");
    searchContainer.classList.add("focus_class");
    outputContainer.classList.add("focus_class");

    focus.style.display = "flex";

    focusTitle.textContent = imgTitle;
    focusImg.src = imgSrc;
    focusImg.alt = imgTitle;
    focusDesc.textContent = imgDesc;
  };

  close.addEventListener("click", () => {
    footer.classList.remove("focus_class");
    searchContainer.classList.remove("focus_class");
    outputContainer.classList.remove("focus_class");
    imgInFocus = false;
    focus.style.display = "none";

    window.scrollTo(0, scrollPosition);
  });

  const removeItems = () => {
    while (outputContainer.firstChild) {
      outputContainer.removeChild(outputContainer.firstChild);
    }
  };

  const defaultPage = () => {
    loading.style.display = "none";
    title.style.display = "flex";
    body.classList.remove("searched_body");
    form.classList.remove("searched_class");
    form.classList.add("search_class");
    outputContainer.style.display = "none";
    searchBtn.classList.remove("searched_btn_class");
    wrapperButton.classList.remove("wrapper_btn_class");
    error.style.display = "none";
    form.classList.remove("search_class_hidden");

    footer.classList.remove("focus_class");
    searchContainer.classList.remove("focus_class");

    document.title = "NASA Image Search";

    focus.style.display = "none";

    clearAll.classList.remove("clear_all_class");
    clearAll.classList.add("hidden_clear_class");
  };

  const loadingPage = () => {
    loading.style.display = "flex";
    title.style.display = "none";
    body.classList.add("searched_body");
    form.classList.remove("search_class");
    form.classList.add("search_class_hidden");
    outputContainer.style.display = "none";
    error.style.display = "none";
    focus.style.display = "none";

    document.title = "Loading...";

    clearAll.classList.remove("clear_all_class");
    clearAll.classList.add("hidden_clear_class");
  };

  clearAll.addEventListener("click", (e) => {
    e.preventDefault();
    searchField.value = "";
    if (searchField.value.trim().length > 0) {
      clearAll.classList.add("clear_all_class");
      clearAll.classList.remove("hidden_clear_class");
    } else {
      clearAll.classList.remove("clear_all_class");
      clearAll.classList.add("hidden_clear_class");
    }
  });

  const resultPage = (text, isHistory) => {
    loading.style.display = "none";
    searchBtn.classList.add("searched_btn_class");
    wrapperButton.classList.add("wrapper_btn_class");
    outputContainer.style.display = "grid";
    form.classList.remove("search_class_hidden");
    form.classList.add("searched_class");
    error.style.display = "none";
    focus.style.display = "none";

    document.title = `${decodeURIComponent(text)} - NASA Image Search`;

    footer.classList.remove("focus_class");
    searchContainer.classList.remove("focus_class");
    outputContainer.classList.remove("focus_class");

    searchField.addEventListener("input", (e) => {
      clearAll.classList.add("clear_all_class");
      clearAll.classList.remove("hidden_clear_class");
    });

    clearAll.classList.add("clear_all_class");
    clearAll.classList.remove("hidden_clear_class");

    if (!isHistory) {
      history.pushState(
        { state: `search:${text}` },
        text,
        `search+${text}.html`
      );
    }
  };

  const errorPage = (errorMessage) => {
    const errorMsg = document.querySelector("#error_msg");
    const errorBtn = document.querySelector("#error_btn");
    loading.style.display = "none";
    title.style.display = "none";
    body.classList.add("searched_body");
    form.classList.remove("search_class");
    form.classList.add("search_class_hidden");
    outputContainer.style.display = "none";

    clearAll.classList.remove("clear_all_class");
    clearAll.classList.add("hidden_clear_class");

    focus.style.display = "none";
    footer.classList.remove("focus_class");

    error.style.display = "flex";
    errorMsg.textContent = errorMessage;

    errorBtn.addEventListener("click", () => {
      defaultPage();
      searchField.value = "";
    });
  };

  window.addEventListener("popstate", (e) => {
    if (e.state.state === "index") {
      defaultPage();
      imgInFocus = false;
      searchField.value = "";
    } else if (e.state.state.startsWith("search")) {
      getQuery(e.state.state.split(":")[1], true);
      imgInFocus = false;
      searchField.value = decodeURIComponent(e.state.state.split(":")[1]);
      // searchField.setAttribute('value', e.state.state.split(":")[1]);
    }
  });

  history.replaceState({ state: "index" }, "default", "index.html");
});
