window.addEventListener("load" , () => {
    const form = document.querySelector("#form");
    const loading = document.querySelector("#loading");
    const outputContainer = document.querySelector("#output_container");
    

    form.addEventListener("submit", e => {
        e.preventDefault();
        const searchText = document.querySelector("#search_text").value;

        if (searchText.trim().length < 1 ) {
            return; 
        }else{
            const data = encodeURIComponent(searchText);
            getImgs(data);
         } 
        });

        const getImgs = data => {
            loadingPage(); 
            setTimeout(() => {
            resultPage(data);  
           },1000);
           
        } 

        const loadingPage = () => {
            const title = document.querySelector("#title");
            const body = document.querySelector("body");
            
            loading.style.display = "flex";
            title.style.display = "none";
            body.classList.add("searched_body"); 
            form.classList.remove("search_class");
            form.classList.add("search_class_hidden");
            outputContainer.style.display = "none";
        }

        const resultPage = text => {
            history.pushState(null, null,  text + ".html");
            const wrapperButton = document.querySelector("#wrapper_btn");
            const searchBtn = document.querySelector("#search_btn");

            loading.style.display = "none";
            searchBtn.classList.add("searched_btn_class");
            wrapperButton.classList.add("wrapper_btn_class");
            outputContainer.style.display = "flex";
            form.classList.remove("search_class_hidden");
            form.classList.add("searched_class"); 
        }

        const getInfo = item => {
            history.pushState(null, null,  item + ".html"); 
        }



});