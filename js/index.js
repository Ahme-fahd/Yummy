// Main Loading Screen Function
$(window).on("load", async () => {
  setTimeout(() => {
    $(".loading-screen").fadeOut(300);
    closeSideNav();
  }, 1000);

  fetchAllMeals();
});

function showInnerLoading() {
  $(".inner-loading").removeClass("d-none");
}

function hideInnerLoading() {
  $(".inner-loading").addClass("d-none");
}

// Fetching Meal Details Function
async function getMealDetails(id) {
  showInnerLoading();
  $("#rowData").html(``);

  let mealReq = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let mealRes = await mealReq.json();
  let meal = mealRes.meals[0];

  $("#rowData").html(`
      <div class="col-md-4 ps-xs">
          <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h2>${meal.strMeal}</h2>
      </div>
      <div class="col-md-8 ps-xs">
          <h2>Instructions</h2>
          <p>${meal.strInstructions}</p>
          <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
          <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
          <h3>Recipes :</h3>
          <ul class="list-unstyled d-flex g-3 flex-wrap" id="mealRecipes"></ul>
          <h3>Tags :</h3>
          <ul class="list-unstyled d-flex g-3 flex-wrap" id="mealTags"></ul>
          <a target="_blank" href="${meal.strSource}" class="btn btn-success me-2">Source</a>
          <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger me-2">Youtube</a>
      </div>
  `);

  let recipesHtml = "";
  let i = 1;
  while (meal[`strIngredient${i}`]) {
    let ingredient = meal[`strIngredient${i}`];
    let measure = meal[`strMeasure${i}`];
    recipesHtml += `<li class="alert alert-info m-2 p-1">${measure} ${ingredient}</li>`;
    i++;
  }
  $("#mealRecipes").html(recipesHtml);

  let tagsHtml = "";
  if (meal.strTags && meal.strTags.trim() !== "") {
    meal.strTags.split(",").forEach((tag) => {
      tagsHtml += `<li class="alert alert-danger m-2 p-1">${tag.trim()}</li>`;
    });
  }
  $("#mealTags").html(tagsHtml);

  hideInnerLoading();
}

// Nav Links Starting Status

$(".nav-links .list-unstyled").children().css({ top: 300 });

// Side Nav Toggling Functions

$(".open-close-icon").on("click", function () {
  if ($(".side-nav").css("left") == "0px") {
    $(this).removeClass("fa-x");
    $(this).addClass("fa-align-justify");
    closeSideNav();
    hideNavList();
  } else {
    $(this).removeClass("fa-align-justify");
    $(this).addClass("fa-x");
    openSideNav();
    showNavLinks();
  }
});

function closeSideNav() {
  $(".side-nav").animate(
    {
      left: -$(".nav-tab").outerWidth(true),
    },
    500
  );
}

function openSideNav() {
  $(".side-nav").animate(
    {
      left: 0,
    },
    500
  );
}

function hideNavList() {
  $(".nav-links .list-unstyled").children().animate({ top: 300 }, 500);
}

function showNavLinks() {
  $(".nav-links .list-unstyled")
    .children()
    .each(function (index) {
      $(this).animate(
        {
          top: 0,
        },
        500 + index * 100
      );
    });
}

function toggleNavIcon() {
  $(".open-close-icon").removeClass("fa-x").addClass("fa-align-justify");
}

// Search Functions

$("#searchLnk").on("click", function () {
  closeSideNav();
  $(".open-close-icon").removeClass("fa-x").addClass("fa-align-justify");
  hideNavList();

  $("#searchContainer").html(
    `
     <div class="row py-4">
            <div class="col-md-6">
                <input type="text" placeholder="Search By Name" class="form-control bg-transparent text-white mb-2" id="nameSearchInput">
            </div>
            <div class="col-md-6">
                <input type="text" placeholder="Search By First Letter" maxlength="1" class="form-control bg-transparent text-white mb-2" id="letterSearchInput">
            </div>
        </div>
    `
  );

  $("#nameSearchInput").on("input", function () {
    performNameSearch();
  });

  $("#letterSearchInput").on("input", function () {
    performLetterSearch();
  });

  $("#rowData").html(``);
});

async function performNameSearch() {
  let nameSearch = $("#nameSearchInput").val().trim().toLowerCase();

  if (nameSearch === "") {
    await fetchAllMeals();
    return;
  }

  let mealsReq = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${nameSearch}`);
  let mealsRes = await mealsReq.json();
  let meals = mealsRes.meals;

  displayFilteredMeals(meals);
}

async function performLetterSearch() {
  let firstLetterSearch = $("#letterSearchInput").val().trim().toLowerCase();

  if (firstLetterSearch === "") {
    await fetchMealsByFirstLetter('a');
    return;
  }

  let mealsReq = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetterSearch}`);
  let mealsRes = await mealsReq.json();
  let meals = mealsRes.meals;

  displayFilteredMeals(meals);
}

async function fetchAllMeals() {
  showInnerLoading();
  $("#rowData").html(``);

  let mealsReq = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
  let mealsRes = await mealsReq.json();

  displayFilteredMeals(mealsRes.meals);
  hideInnerLoading();
}

async function fetchMealsByFirstLetter(letter) {
  showInnerLoading();
  $("#rowData").html(``);

  let mealsReq = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
  let mealsRes = await mealsReq.json();

  displayFilteredMeals(mealsRes.meals);
  hideInnerLoading();
}

function displayFilteredMeals(meals) {
  $("#rowData").html("");

  meals.forEach((meal) => {
    $("#rowData").append(`
      <div class="col-md-3">
        <div class="ps-xs meal position-relative rounded-2 cursor-pointer overflow-hidden" data-meal-id="${meal.idMeal}">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-100">
          <div class="meal-layer position-absolute d-flex justify-content-center align-items-center text-black p-2">
            <h3>${meal.strMeal}</h3>
          </div>
        </div>
      </div>`);
  });

  $(".meal").on("click", function () {
    let mealId = $(this).data("meal-id");
    getMealDetails(mealId);
  });
}

// Categories Functions

$("#categoriesLnk").on("click", async function () {
  closeSideNav();
  toggleNavIcon();
  hideNavList();
  showInnerLoading();

  $("#searchContainer").html(``);
  $("#rowData").html(``);

  let req = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let res = await req.json();
  res.categories.forEach((category) => {
    let description =
      category.strCategoryDescription.split(" ").slice(0, 20).join(" ") + "...";
    $("#rowData").append(`
      <div class="col-md-3">
        <div class="ps-xs meal position-relative rounded-2 cursor-pointer overflow-hidden" data-category="${category.strCategory}">
          <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="w-100">
          <div class="meal-layer position-absolute text-center text-black p-2">
            <h3>${category.strCategory}</h3>
            <p>${description}</p>
          </div>
        </div>
      </div>`);
  });

  $(".meal").on("click", function () {
    let category = $(this).data("category");
    getCategoryMeals(category);
  });

  hideInnerLoading();
});

async function getCategoryMeals(category) {
  showInnerLoading();
  $("#rowData").html(``);

  let mealsReq = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let mealsRes = await mealsReq.json();
  let meals = mealsRes.meals.slice(0, 20);
  displayFilteredMeals(meals);
  hideInnerLoading();
}
// Area Functions

$("#areaLnk").on("click", async function () {
  closeSideNav();
  toggleNavIcon();
  hideNavList();
  showInnerLoading();

  $("#searchContainer").html(``);
  $("#rowData").html(``);

  let req = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  let res = await req.json();

  res.meals.forEach((area) => {
    $("#rowData").append(`<div class="col-md-3">
    <div class="area rounded-2 cursor-pointer text-center" data-area="${area.strArea}">
        <i class="fa-solid fa-house-laptop fa-4x"></i>
        <h3>${area.strArea}</h3>
        </div>
    </div>`);
  });

  $(".area").on("click", function () {
    let area = $(this).data("area");
    getAreaMeals(area);
  });

  hideInnerLoading();
});

async function getAreaMeals(area) {
  showInnerLoading();
  $("#rowData").html(``);

  let mealsReq = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let mealsRes = await mealsReq.json();
  let meals = mealsRes.meals.slice(0, 20);
  displayFilteredMeals(meals);

  hideInnerLoading();
}
// Ingredients Functions

$("#ingredientsLnk").on("click", async function () {
  closeSideNav();
  toggleNavIcon();
  hideNavList();
  showInnerLoading();

  $("#searchContainer").html(``);
  $("#rowData").html(``);

  let req = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  let res = await req.json();

  let first20Ingredients = res.meals.slice(0, 20);

  first20Ingredients.forEach((ingredient) => {
    let description = ingredient.strDescription
      ? ingredient.strDescription.split(" ").slice(0, 20).join(" ") + "..."
      : "No description available";
    $("#rowData").append(`
        <div class="col-md-3">
          <div class="ps-xs ingredient rounded-2 cursor-pointer text-center" data-ingredient="${ingredient.strIngredient}">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h3>${ingredient.strIngredient}</h3>
            <p>${description}</p>
          </div>
        </div>`);
  });

  $(".ingredient").on("click", function(){
    let ingredient = $(this).data('ingredient');
    getIngredientMeals(ingredient);
  })

  hideInnerLoading();
});

async function getIngredientMeals(ingredient){
  showInnerLoading();
  $("#rowData").html(``);

  let mealsReq = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  let mealsRes = await mealsReq.json();
  let meals = mealsRes.meals.slice(0, 20);
  displayFilteredMeals(meals);

  hideInnerLoading();
}

// Contact Functions

const nameRegex = /^[a-zA-Z\s]+$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const phoneRegex = /^01[0125][0-9]{8}$/;
const ageRegex = /^[1-9][0-9]?$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

function validateName() {
  const input = $("#nameInput");
  const regex = nameRegex;
  const alertId = "#nameAlert";

  if (!input.val().trim()) {
    $(alertId).addClass("d-none");
    return false;
  } else {
    if (regex.test(input.val().trim())) {
      $(alertId).addClass("d-none");
      return true;
    } else {
      $(alertId).removeClass("d-none");
      return false;
    }
  }
}

function validateEmail() {
  const input = $("#emailInput");
  const regex = emailRegex;
  const alertId = "#emailAlert";

  if (!input.val().trim()) {
    $(alertId).addClass("d-none");
    return false;
  } else {
    if (regex.test(input.val().trim())) {
      $(alertId).addClass("d-none");
      return true;
    } else {
      $(alertId).removeClass("d-none");
      return false;
    }
  }
}

function validatePhone() {
  const input = $("#phoneInput");
  const regex = phoneRegex;
  const alertId = "#phoneAlert";

  if (!input.val().trim()) {
    $(alertId).addClass("d-none");
    return false;
  } else {
    if (regex.test(input.val().trim())) {
      $(alertId).addClass("d-none");
      return true;
    } else {
      $(alertId).removeClass("d-none");
      return false;
    }
  }
}

function validateAge() {
  const input = $("#ageInput");
  const regex = ageRegex;
  const alertId = "#ageAlert";

  if (!input.val().trim()) {
    $(alertId).addClass("d-none");
    return false;
  } else {
    if (regex.test(input.val().trim())) {
      $(alertId).addClass("d-none");
      return true;
    } else {
      $(alertId).removeClass("d-none");
      return false;
    }
  }
}

function validatePassword() {
  const input = $("#passwordInput");
  const regex = passwordRegex;
  const alertId = "#passwordAlert";

  if (!input.val().trim()) {
    $(alertId).addClass("d-none");
    return false;
  } else {
    if (regex.test(input.val().trim())) {
      $(alertId).addClass("d-none");
      return true;
    } else {
      $(alertId).removeClass("d-none");
      return false;
    }
  }
}

function validateRepassword() {
  const password = $("#passwordInput").val();
  const repassword = $("#repasswordInput").val();
  const alertId = "#repasswordAlert";

  if (!repassword.trim()) {
    $(alertId).addClass("d-none");
    return false;
  } else {
    if (password === repassword) {
      $(alertId).addClass("d-none");
      return true;
    } else {
      $(alertId).removeClass("d-none");
      return false;
    }
  }
}

function isInputDataValid() {
  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  const isAgeValid = validateAge();
  const isPasswordValid = validatePassword();
  const isRepasswordValid = validateRepassword();

  if (
    isNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isAgeValid &&
    isPasswordValid &&
    isRepasswordValid
  ) {
    $("#submitBtn").prop("disabled", false);
  } else {
    $("#submitBtn").prop("disabled", true);
  }
}

$("#contactLnk").on("click", function () {
  closeSideNav();
  toggleNavIcon();
  hideNavList();

  $("#searchContainer").html("");

  $("#rowData").html(`
        <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 text-center">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input type="text" placeholder="Enter Your Name" class="form-control" id="nameInput"/>
                        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Special characters and numbers are not allowed
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="email" placeholder="Enter Your Email" class="form-control" id="emailInput"/>
                        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Email not valid *example@yyy.zzz
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="text" placeholder="Enter Your Phone" class="form-control" id="phoneInput"/>
                        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid Phone Number
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" placeholder="Enter Your Age" class="form-control" id="ageInput"/>
                        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid age
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="password" placeholder="Enter Your Password" class="form-control" id="passwordInput"/>
                        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid password *Minimum eight characters, at least one letter and one number:*
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="password" placeholder="Repassword" class="form-control" id="repasswordInput"/>
                        <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter a valid repassword
                        </div>
                    </div>
                </div>
                <button id="submitBtn" class="btn btn-outline-danger px-2 mt-3" disabled>Submit</button>
            </div>
        </div>`);

  $("#nameInput").on("input", () => {
    validateName();
    isInputDataValid();
  });

  $("#emailInput").on("input", () => {
    validateEmail();
    isInputDataValid();
  });

  $("#phoneInput").on("input", () => {
    validatePhone();
    isInputDataValid();
  });

  $("#ageInput").on("input", () => {
    validateAge();
    isInputDataValid();
  });

  $("#passwordInput").on("input", () => {
    validatePassword();
    validateRepassword();
    isInputDataValid();
  });

  $("#repasswordInput").on("input", () => {
    validateRepassword();
    isInputDataValid();
  });

  $("#submitBtn").on("click", (e) => {
    e.stopPropagation();
    $("#submitBtn").addClass("bg-danger");
    $("#submitBtn").addClass("text-white");
  });

  $("body").on("click", (e) => {
    if (!$(e.target).is("#submitBtn")) {
      $("#submitBtn").removeClass("bg-danger");
      $("#submitBtn").removeClass("text-white");
    }
  });
});
