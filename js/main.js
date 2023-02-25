window.addEventListener("load" , () => {
    const form = document.querySelector("#form");
    const loading = document.querySelector("#loading");
    const outputContainer = document.querySelector("#output_container");
    const title = document.querySelector("#title");
    const body = document.querySelector("body");
    const wrapperButton = document.querySelector("#wrapper_btn");
    const searchBtn = document.querySelector("#search_btn");
    const searchField = document.querySelector("#search_text");
    
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




    const  historyGetQuery = data => {
        loadingPage(); 
        removeItems();
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () => {
            if (xhr.status === 200){
                historyResultPage(data);
                const response = JSON.parse(xhr.responseText);
                const items = response.collection.items;
                console.log(items.length);
                if (items.length < 1) {
                    for(const item of items) {
                        if (item.links && item.links.length > 0) {                   
                            const img = document.createElement("img");
                            img.src = item.links[0].href;
                            img.alt = item.data[0].title;
                            outputContainer.appendChild(img);
                        }
        }
    }else{
        console.log("item not found");
    }

        }else{
            console.log("error code " + xhr.status + " e");
        }

        });

    
        
    xhr.open("GET" , "https://images-api.nasa.gov/search?q=" + data, true);
    xhr.send();
    } 

const getQuery = data => {

        loadingPage(); 
        removeItems();
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () => {
            if (xhr.status === 200){
                resultPage(data);
                const response = JSON.parse(xhr.responseText);
                const items = response.collection.items;
                for (let i = 0; i < items.length; i++) {
                if (items[i].links && items[i].links.length > 0) {                   
                    const img = document.createElement("img");
                    img.src = items[i].links[0].href;
                    img.alt = items[i].data[0].title;
                    img.classList.add("imgs");
                    outputContainer.appendChild(img);
         
                }
        }

        }
        });

    

        
    xhr.open("GET" , "https://images-api.nasa.gov/search?q=" + data, true);
    xhr.send();
    } 

    
    const removeItems = () => {
        while (outputContainer.firstChild) {
            outputContainer.removeChild(outputContainer.firstChild);
        }
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
            outputContainer.style.display = "grid";
            form.classList.remove("search_class_hidden");
            form.classList.add("searched_class");
            searchField.setAttribute('value', "moon");
    }

       
        window.addEventListener("popstate", e => {
            if(e.state.state == "index"){
                defaultPage();
                searchField.value = "";
            }else if(e.state.state != null){ 
                console.log(e.state.state);
                console.log(e.state.state.split(":")[1]);
                historyGetQuery(e.state.state.split(":")[1]);
                searchField.value = e.state.state.split(":")[1];
                // searchField.setAttribute('value', e.state.state.split(":")[1]);
                console.log(searchField.value);
            }
               
        });


        history.replaceState({state: "index"}, "default", "index.html");

});