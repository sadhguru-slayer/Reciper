// src/apis/api.js

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Search meals by name or ingredient
export const fetchRecipes = async (query, category = null, area = null) => {
  try {
    const searchUrl = `${BASE_URL}/search.php?s=${query}`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    // console.log(data)
    if (!data.meals) return { meals: [] }; // No results

    let filteredMeals = data.meals;
    console.log(filteredMeals)
    if (category) {
      filteredMeals = filteredMeals.filter(
        (meal) => meal.strCategory === category
      );
    }

    if (area) {
      filteredMeals = filteredMeals.filter(
        (meal) => meal.strArea === area
      );
    }

    return { meals: filteredMeals };
  } catch (error) {
    console.error("API error:", error);
    return { meals: [] };
  }
};
