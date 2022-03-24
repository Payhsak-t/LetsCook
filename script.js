'use strict';

const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const singleMealEl = document.getElementById('single-meal');

//function to search meal
function searchMeal(e) {
  e.preventDefault();

  //Clear single meal
  singleMealEl.innerHTML = '';

  //Get search Term
  const term = search.value;

  //check for empty
  if (term.trim()) {
    //Fetch Data from API
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(response => response.json())
      .then(data => {
        resultHeading.innerHTML = `<h2 class="result-heading">Search results for "${term}":</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Please try again.</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              item =>
                `<div class="meal">
              <img src="${item.strMealThumb}" alt="${item.strMeal}" />
              <div class="meal-info" data-mealID ="${item.idMeal}">
                <h3>${item.strMeal}</h3>
              </div>
            </div>`
            )
            .join('');
        }
      });
    //clear search value
    search.value = '';
  } else {
    alert('Please enter a search term');
  }
}

//Fetch Meal by ID
function getMealbyID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

//Fetch random meal from API
function randomMeal() {
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

//Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMealEl.innerHTML = `
  <div class="single-meal">
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ``}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ``}
    </div>
    <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
        ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
      </ul>
    </div>
  </div>
  `;
}

//Event Listener for search
submit.addEventListener('submit', searchMeal);
submit.addEventListener('click', randomMeal);

mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealID');
    getMealbyID(mealID);
  }
});
