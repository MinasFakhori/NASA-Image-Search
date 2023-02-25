window.addEventListener("load" , () => {
    const form = document.querySelector("#form");
    const loading = document.querySelector("#loading");
    const outputContainer = document.querySelector("#output_container");
    const title = document.querySelector("#title");
    const body = document.querySelector("body");
    const wrapperButton = document.querySelector("#wrapper_btn");
    const searchBtn = document.querySelector("#search_btn");
    let searchField = document.querySelector("#search_text");
    
    form.addEventListener("submit", e => {
        e.preventDefault();
        const searchText = document.querySelector("#search_text").value;
        


        if (searchText.trim().length < 1 ) {
            return; 
        }else{
            const data = encodeURIComponent(searchText);
            getQuery(data);
         } 
    });




    const getQuery = data => {
        loadingPage(); 
        setTimeout(() => {
            resultPage(data);  
        },1000);   
    } 

    const defaultPage = () => {
            loading.style.display = "none";
            title.style.display = "flex";
            body.classList.remove("searched_body");
            form.classList.remove("searched_class");
            form.classList.add("search_class");
            outputContainer.style.display = "none";
            searchBtn.classList.remove("searched_btn_class");
            wrapperButton.classList.remove("wrapper_btn_class");
        };




        const loadingPage = () => {
            loading.style.display = "flex";
            title.style.display = "none";
            body.classList.add("searched_body"); 
            form.classList.remove("search_class");
            form.classList.add("search_class_hidden");
            outputContainer.style.display = "none";
        }

        const resultPage = text => {
            historyResultPage();
            history.pushState({state: `search:${text}`}, text, `search+${text}.html`);
        }

    const historyResultPage = () => {
            loading.style.display = "none";
            searchBtn.classList.add("searched_btn_class");
            wrapperButton.classList.add("wrapper_btn_class");
            outputContainer.style.display = "flex";
            form.classList.remove("search_class_hidden");
            form.classList.add("searched_class");
    }

       
        window.addEventListener("popstate", e => {
            if(e.state.state == "index"){
                defaultPage();
            }else if(e.state.state != null){ 
                loadingPage();
                historyResultPage();
                searchField.setAttribute("value", decodeURIComponent(e.state.text));
            }
               
        });


        history.replaceState({state: "index"}, "default", "index.html");

});