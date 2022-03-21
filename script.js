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
        console.log(data);
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

//Event Listener for search
submit.addEventListener('submit', searchMeal);
