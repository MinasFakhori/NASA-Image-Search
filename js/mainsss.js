window.addEventListener("load", () => {
history.pushState({ main }, "text", `main.html`);
  const form = document.querySelector("#form");
  const loading = document.querySelector("#loading");
  const outputContainer = document.querySelector("#outputContainer");
  let searchField = document.querySelector("#searchText");


  form.addEventListener("submit", e => {
    e.preventDefault();
    const searchText = document.querySelector("#searchText").value;

    if (searchText.trim().length < 1) {
      return;
    } else {
      const data = encodeURIComponent(searchText);
      getImgs(data);
    }
  });

  const getImgs = (data) => {
    loadingPage();
    setTimeout(() => {
      resultPage(data);
    }, 1000);
  };

  const loadingPage = () => {
    const title = document.querySelector("#title");
    const body = document.querySelector("body");

    loading.style.display = "flex";
    title.style.display = "none";
    body.classList.add("searched_body");
    form.classList.remove("search_class");
    form.classList.add("search_class_hidden");
    outputContainer.style.display = "none";
  };

  const resultPage = (text) => {
    history.pushState({ text }, text, `${text}.html`);
    const wrapperButton = document.querySelector("#wrapperBtn");
    const searchBtn = document.querySelector("#searchBtn");

    loading.style.display = "none";
    searchBtn.classList.add("searched_btn_class");
    wrapperButton.classList.add("wrapper_btn_class");
    outputContainer.style.display = "flex";
    form.classList.remove("search_class_hidden");
    form.classList.add("searched_class");
  };

  window.addEventListener("popstate", (e) => {
    if (e.state.text) {
      loadingPage();
      resultPage(decodeURIComponent(e.state.text));
      searchField.setAttribute("value", decodeURIComponent(e.state.text));
    } else{
      history.replaceState({ home: true }, "Home", "index.html");
    }
  });
});
