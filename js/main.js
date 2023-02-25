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

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchText = document.querySelector("#search_text").value;
    if (searchText.trim().length < 1) {
      return;
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
              const img = document.createElement("img");
              img.src = item.links[0].href;
              img.alt = item.data[0].title;
              img.classList.add("imgs");
              outputContainer.appendChild(img);
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
  };

  const loadingPage = () => {
    loading.style.display = "flex";
    title.style.display = "none";
    body.classList.add("searched_body");
    form.classList.remove("search_class");
    form.classList.add("search_class_hidden");
    outputContainer.style.display = "none";
    error.style.display = "none";
  };

  const resultPage = (text, isHistory) => {
    loading.style.display = "none";
    searchBtn.classList.add("searched_btn_class");
    wrapperButton.classList.add("wrapper_btn_class");
    outputContainer.style.display = "grid";
    form.classList.remove("search_class_hidden");
    form.classList.add("searched_class");
    error.style.display = "none";

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

    error.style.display = "flex";
    errorMsg.textContent = errorMessage;

    errorBtn.addEventListener("click", () => {
      defaultPage();
      searchField.value = "";
    });
  };

  window.addEventListener("popstate", (e) => {
    if (e.state.state == "index") {
      defaultPage();
      searchField.value = "";
    } else if (e.state.state != null) {
      console.log(e.state.state);
      console.log(e.state.state.split(":")[1]);
      getQuery(e.state.state.split(":")[1], true);
      searchField.value = decodeURIComponent(e.state.state.split(":")[1]);
      // searchField.setAttribute('value', e.state.state.split(":")[1]);
      console.log(searchField.value);
    }
  });

  history.replaceState({ state: "index" }, "default", "index.html");
});
