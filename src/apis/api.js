// src/apis/api.js

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Simple mood → category/area mapping (heuristic)
const MOOD_MAP = {
  Comfort: {
    categories: ["Pasta", "Soup", "Beef", "Pork", "Lamb", "Casserole"],
    areas: []
  },
  Healthy: {
    categories: ["Vegetarian", "Vegan", "Salad", "Seafood", "Miscellaneous"],
    areas: []
  },
  Indulgent: {
    categories: ["Dessert", "Side", "Starter"],
    areas: []
  },
  Adventurous: {
    categories: [],
    areas: ["Thai", "Japanese", "Mexican", "Moroccan", "Indian"]
  }
};

// Estimate time by number of non-empty ingredients
export const estimateTimeBucket = (meal) => {
  if (!meal) return "moderate";
  let count = 0;
  for (let i = 1; i <= 20; i++) {
    const key = `strIngredient${i}`;
    const val = meal[key];
    if (val && String(val).trim()) count++;
  }
  if (count <= 6) return "quick";       // ~ <30 mins
  if (count <= 12) return "moderate";   // ~ 30–60 mins
  return "leisure";                     // ~ >60 mins
};

// Helper: hydrate a list from filter endpoints to full meals
const hydrateByIds = async (basicMeals) => {
  const ids = (basicMeals || []).map(m => m.idMeal);
  const detailed = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await res.json();
      return data.meals ? data.meals[0] : null;
    })
  );
  return detailed.filter(Boolean);
};

// Apply local filters (category, area, time, mood) to an array
const applyLocalFilters = (meals, { category, area, time, mood }) => {
  let arr = meals || [];

  if (category) {
    arr = arr.filter(m => m.strCategory === category);
  }
  if (area) {
    arr = arr.filter(m => m.strArea === area);
  }
  if (time) {
    arr = arr.filter(m => estimateTimeBucket(m) === time);
  }
  if (mood && MOOD_MAP[mood]) {
    const { categories = [], areas = [] } = MOOD_MAP[mood];
    arr = arr.filter((m) => {
      const catMatch = categories.includes(m.strCategory);
      const areaMatch = areas.includes(m.strArea);
      return (categories.length ? catMatch : true) && (areas.length ? areaMatch : true);
    });
  }
  return arr;
};

// Structured search: returns results split into tabs
export const fetchRecipes = async (query, category = null, area = null, time = null, mood = null) => {
  try {
    const q = (query || "").trim();

    // Name search (full details already)
    const nameRes = await fetch(`${BASE_URL}/search.php?s=${q}`);
    const nameData = await nameRes.json();
    const byNameRaw = nameData.meals || [];

    // Ingredient search (needs hydration)
    const ingRes = await fetch(`${BASE_URL}/filter.php?i=${q}`);
    const ingData = await ingRes.json();
    const byIngredient = await hydrateByIds(ingData.meals || []);

    // Category search (needs hydration)
    const catRes = await fetch(`${BASE_URL}/filter.php?c=${q}`);
    const catData = await catRes.json();
    const byCategory = await hydrateByIds(catData.meals || []);

    // Area search (needs hydration)
    const areaRes = await fetch(`${BASE_URL}/filter.php?a=${q}`);
    const areaData = await areaRes.json();
    const byArea = await hydrateByIds(areaData.meals || []);

    // Apply local filters to each list
    const filters = { category, area, time, mood };
    const byName = applyLocalFilters(byNameRaw, filters);
    const byIng = applyLocalFilters(byIngredient, filters);
    const byCat = applyLocalFilters(byCategory, filters);
    const byAr = applyLocalFilters(byArea, filters);

    return {
      byName,
      byIngredient: byIng,
      byCategory: byCat,
      byArea: byAr
    };
  } catch (error) {
    console.error("API error:", error);
    return { byName: [], byIngredient: [], byCategory: [], byArea: [] };
  }
};

export const randomMeal = async () => {
  try {
    const response = await fetch(`${BASE_URL}/random.php`);
    const data = await response.json();
    return data.meals ? { meals: data.meals } : { meals: [] };
  } catch (error) {
    console.log(error);
    return { meals: [] };
  }
};