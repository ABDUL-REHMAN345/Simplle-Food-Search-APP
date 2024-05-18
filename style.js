const API_ID = '7fd6d74a';
const API_KEY = 'f527e3ef8e254f871cfdb3f0da8b17fd';
const API_URL = 'https://api.edamam.com/api/recipes/v2';

document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if (query) {
        fetchRecipes(query);
    }
});

function getSavedRecipes() {
    return JSON.parse(localStorage.getItem('savedRecipes')) || [];
}

function saveRecipe(recipe) {
    const savedRecipes = getSavedRecipes();
    savedRecipes.push(recipe);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    displaySavedRecipes();
}

function removeRecipe(uri) {
    let savedRecipes = getSavedRecipes();
    savedRecipes = savedRecipes.filter(recipe => recipe.uri !== uri);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    displaySavedRecipes();
}

async function fetchRecipes(query) {
    try {
        const response = await fetch(`${API_URL}?type=public&q=${encodeURIComponent(query)}&app_id=${API_ID}&app_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        displayRecipes(data.hits);
    } catch (error) {
        console.error('Failed to fetch recipes', error);
        alert('Failed to fetch recipes. Please try again later.');
    }
}
function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = '';
    if (recipes.length === 0) {
        recipesContainer.innerHTML = '<p>No recipes found. Please try a different search term.</p>';
        return;
    }
    recipes.forEach(recipeData => {
        const recipe = recipeData.recipe;
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');
        recipeElement.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.label}">
            <h2>${recipe.label}</h2>
            <p>Source: ${recipe.source}</p>
            <p>Calories: ${Math.round(recipe.calories)}</p>
            <a href="${recipe.url}" target="_blank">View Recipe</a>
            <button onclick="saveRecipe(${encodeURIComponent(JSON.stringify(recipe))})">Save Recipe</button>
        `;
        recipesContainer.appendChild(recipeElement);
    });
}

function displaySavedRecipes() {
    const savedRecipesContainer = document.getElementById('saved-recipes-container');
    const savedRecipes = getSavedRecipes();
    savedRecipesContainer.innerHTML = '';
    if (savedRecipes.length === 0) {
        savedRecipesContainer.innerHTML = '<p>No saved recipes.</p>';
        return;
    }
    savedRecipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');
        recipeElement.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.label}">
            <h2>${recipe.label}</h2>
            <p>Source: ${recipe.source}</p>
            <p>Calories: ${Math.round(recipe.calories)}</p>
            <a href="${recipe.url}" target="_blank">View Recipe</a>
            <button onclick="removeRecipe('${recipe.uri}')">Remove Recipe</button>
        `;
        savedRecipesContainer.appendChild(recipeElement);
    });
}

// Display saved recipes on page load
window.onload = displaySavedRecipes;
