window.addEventListener("load" , () => {
    const searchForm = document.querySelector("#search form");
    const loading = document.querySelector("#loading");
    const body = document.querySelector("body");
    const title = document.querySelector("#title");
    const searchBtn = document.querySelector("#search_btn");
    const outputContainer = document.querySelector("#output_container");


    searchForm.addEventListener("submit", e => {
        e.preventDefault();

        const searchText = document.querySelector("#search_text").value;


        if (searchText.trim().length <= 1 ) {
            return; 
        }else{
          const data = encodeURIComponent(searchText); 
           getTheData(data);
           searchForm.style.display = "none";
           loading.style.display = "flex";
           body.style.backgroundImage = "none";
           body.style.backgroundColor = "#000";
           title.style.display = "none";
            outputContainer.style.display = "none";

           setTimeout(() => {
            loading.style.display = "none";
            searchForm.style.display = "flex"; //clean this up
            searchForm.style.flexDirection = "row";
            searchBtn.style.marginTop = "0";
            searchForm.padding = "0";
            searchForm.style.marginTop = "0px";
            searchBtn.style.marginLeft = "2px";
            outputContainer.style.display = "flex";
          
           },1000);
           
        } 
        });

        const getTheData = data => {


        }





});