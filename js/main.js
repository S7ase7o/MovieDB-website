$(document).ready(function () {
window.setTimeout(()=>{
    ///loading////////////
    $(".loading").fadeOut(500);
    $('body').css("overflow","auto");

  ///////////Up Button/////////////
  
    $("#up").click(function () {
      $("html , body").animate({ scrollTop: 0 }, 2000);
    });
    ///////////////////// start sidebar open ////////////////
    let asideWidth = $("#menu").innerWidth();
    let arrayOfLi = [...$(".menu ul li")];
    let startAnimationTime = 1000;
    $("#openIcon").click(() => {
      $("#aside").animate({ left: 0 }, 500, () => {
        let plus = 0;
        for (let i = 0; i < arrayOfLi.length; i++) {
            $(arrayOfLi[i]).animate({ opacity: "1",paddingTop: "25px"},startAnimationTime + plus);
            plus+=500;
        };
      });
      $("#closeIcon").css("display", "block");
      $("#openIcon").css("display", "none");
    });
    ////////////////////// start close /////////////////
      $("#closeIcon").click(()=> {
        $("#aside").animate({ left: `-${asideWidth}` }, 500, () => {
          for (let i = 0; i < arrayOfLi.length; i++) {
            $(arrayOfLi[i]).finish().animate({ paddingTop: "500px", opacity: "0" },100)
          }
        });
        $("#closeIcon").css("display", "none");
        $("#openIcon").css("display", "block");
      });
    
    ////////// start api /////////
    
    let now_playing = `https://api.themoviedb.org/3/movie/now_playing?api_key=6580abba53ed966f714ada445dd5df05&language=en-US`;
    let popular = `https://api.themoviedb.org/3/movie/popular?api_key=6580abba53ed966f714ada445dd5df05&language=en-US`;
    let top_rated = `https://api.themoviedb.org/3/movie/top_rated?api_key=6580abba53ed966f714ada445dd5df05&language=en-US`;
    let trending = `https://api.themoviedb.org/3/trending/all/week?api_key=6580abba53ed966f714ada445dd5df05&language=en-US`;
    let upcoming = `https://api.themoviedb.org/3/movie/upcoming?api_key=6580abba53ed966f714ada445dd5df05&language=en-US`;
    
    function getApi(url){
      let myRequst = new XMLHttpRequest();
        myRequst.open("GET",url);
        myRequst.addEventListener('readystatechange', function () {
          if(myRequst.readyState == 4 && myRequst.status == 200){
            movies = JSON.parse(myRequst.response).results;
            displayAllMovies(movies)
            // console.log(myRequst.response);
            return 0;
          }else {
            // throw new Error(myRequst)
          }
        })
        myRequst.send();
    };
    getApi(now_playing); 
   
    //////// display function ///////
    function displayAllMovies(arr){
      let content = ``;
      for (let i = 0; i < arr.length; i++) {
        content += `
        <div class="col-lg-4 col-md-6 mt-4">
        <div class="item">
                  <img src="https://image.tmdb.org/t/p/w500${arr[i].poster_path}" alt="poster">
                  <div class="details d-flex flex-column align-items-center justify-content-center text-dark">
                      <h2>${arr[i].original_title}</h2>
                      <p>${arr[i].overview}</p>
                      <span>rate: <span>${arr[i].vote_average}</span></span>
                      <span class="mt-1">${arr[i].release_date}</span>
                  </div>
              </div>
          </div>
            `;
      }
      $("#moviesRow").html(content)
    };
    //////// display sidebar  /////////
    $(".list ul li a").click(function() {
      if($(this).attr("id") == "contactHref"){
        let ahrf = $(this).attr("href");
        let secOffset = $(ahrf).offset().top;
        $("html , body").animate({scrollTop : secOffset},2000)
        // 
      } else {
        let target = $(this).attr("id");
        switch(target) {
          case 'now_playing':
             getApi(now_playing)
            break;
          case 'popular':
            getApi(popular)
            break;
          case 'top_rated':
            getApi(top_rated)
            break;
          case 'trending':
            getApi(trending)
            break;
          case 'upcoming':
            getApi(upcoming)
            break;
          default:
        }
      };
    });
    /////////////// searches functions  //////////
    
    /////////// start search by word ////////////////
    let searched = []; 
    let movieWord = document.getElementById('movieWord');
    async function searchByWord() {
      if(movieWord.value == ""){getApi(now_playing)} 
      else{ 
        let eVentTarget = this; 
        await fetch(`https://api.themoviedb.org/3/search/movie?api_key=6580abba53ed966f714ada445dd5df05&query=${movieWord.value}`).
        then(function(response) {
          if (!response.ok && response.status != 200) {
            throw Error(response.statusText); 
            
          }
            return response; 
        }).
        then(async function(response){
          searched = await( await response.json()).results; 
          let content = ``;
          searched.forEach((element) => {
            if (element.title.toLowerCase().includes(eVentTarget.value.toLowerCase())){
              content += `
              <div class="col-lg-4 col-md-6 mt-4">
              <div class="item">
                        <img src="https://image.tmdb.org/t/p/w500${element.poster_path}" alt="poster">
                        <div class="details d-flex flex-column align-items-center justify-content-center text-dark">
                            <h2>${element.original_title}</h2>
                            <p>${element.overview}</p>
                            <span>rate: <span>${element.vote_average}</span></span>
                            <span class="mt-1">${element.release_date}</span>
                        </div>
                    </div>
                </div>
             `;
            }
        });
        $("#moviesRow").html(content)
        console.log("ok");
      })
      .catch(function(error) {
        console.log(error);
      });
    }
    };
    movieWord.addEventListener('keyup',searchByWord);
  
    let searchInput = document.getElementById('searchInput');
    function search() {
      if(searchInput.value == ""){displayAllMovies(searched)}
      // herg3ny l a5er page kant searched
      else{
        let content = ``;
        searched.forEach((element) => {
          if (element.title.toLowerCase().includes(searchInput.value.toLowerCase())){
            content += `
            <div class="col-lg-4 col-md-6 mt-4">
            <div class="item">
                      <img src="https://image.tmdb.org/t/p/w500${element.poster_path}" alt="poster">
                      <div class="details d-flex flex-column align-items-center justify-content-center text-dark">
                          <h2>${element.original_title}</h2>
                          <p>${element.overview}</p>
                          <span>rate: <span>${element.vote_average}</span></span>
                          <span class="mt-1">${element.release_date}</span>
                      </div>
                  </div>
              </div>
           `;
          }
      });
      $("#moviesRow").html(content)
    }
    };
    searchInput.addEventListener('keyup',search);
    ////////// regex  ////////////
    $('#name').keyup((e)=> { 
      let currentNmae = $(e.target).val();
      if(!isName(currentNmae)){
        $(e.target).next().css("display","block").html("must start with capital char and be 3 char at least");
        perventSubmit($(form));
        // console.log('not name');
      } else {$(e.target).next().css("display","none");
      // console.log("name");
    };
    });

    $('#email').keyup((e)=> { 
      let currentEmail = $(e.target).val();
      if(!isEmail(currentEmail)){
        $(e.target).next().slideDown().html("invalid Email");
        perventSubmit($(form));
        console.log('not email');
      }else {
         $(e.target).next().slideUp();
        console.log("email");
    };
    });
    $('#phone').keyup((e)=> { 
      let currentPhone = $(e.target).val();
      if(!isPhone(currentPhone)){
        $(e.target).next().slideDown().html("invalid Phone");
        perventSubmit($(form));
        console.log('not Phone');
      }else {
         $(e.target).next().slideUp();
        console.log("Phone");
    };
    });
    $('#password').keyup((e)=> { 
      let currentPassword = $(e.target).val();
      if(!isPassword(currentPassword)){
        $(e.target).next().slideDown().html("invalid password");
        perventSubmit($(form));
        console.log('not password');
      }else {
         $(e.target).next().slideUp();
        console.log("password");
    };
    });
    $('#rePassword').keyup((e)=> {
      let currentRePassword = $(e.target).val();
      let mainPasswordValue = $("#password").val()
      if(!isPassword(currentRePassword)){
        $(e.target).next().slideDown().html("invalid password");
        perventSubmit($(form));
        // console.log('not password');
      } else if(currentRePassword != mainPasswordValue){
        $("#rePassword").next().slideDown().html("not identical password");
        perventSubmit($(form));
      }
      else {
         $(e.target).next().slideUp();
        // console.log("password");
    };
    });
    $('#age').keyup((e)=> { 
      let currentAge = $(e.target).val();
      if(!isAge(currentAge)){
        $(e.target).next().slideDown().html("invalid Age");
        perventSubmit($(form));
        console.log('not Age');
      }else {
         $(e.target).next().slideUp();
        console.log("Age");
    };
    });
    ///////////////////////////////// regex validation ///////////////////////////////////////////////////
    function isName(name){
      let NameRegx = /^[A-Z][a-zA-Z ]{2,20}$/;
      if(NameRegx.test(name)) return true
    };
    function isPhone(phone){
      let phoneRegx = /^(002|\+2)?01[0125][0-9]{8}$/;
      if(phoneRegx.test(phone)) return true
    };
    function isEmail(email){
      let emailRegx = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
      if(emailRegx.test(email)) return true
    };
    function isPassword(password){
      let passwordRegx = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9@#$%^&+=*.\-_]){3,}$/;
      if(passwordRegx.test(password)) return true
    };
    function isAge(age){
      let ageRegex = /^(0?[9]|[1-9][0-9]|[1][0-9][0-9])$/;
      if(ageRegex.test(age)) return true

    }
    function perventSubmit(form){
      form.submit(function (e) { 
        e.preventDefault();
      });
    };
  },1000)
});




