// src/pages/Favorites.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecipeDetails from "../components/RecipeDetails";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(saved);
  }, []);

  const removeFavorite = (idMeal) => {
    const updated = favorites.filter((f) => f.idMeal !== idMeal);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);

    if (selectedRecipe?.idMeal === idMeal) {
      setSelectedRecipe(null);
    }
  };

  const openRecipe = async (idMeal) => {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
      );
      const data = await res.json();
      if (data.meals && data.meals.length > 0) {
        setSelectedRecipe(data.meals[0]);
      }
    } catch (err) {
      console.error("Failed to fetch recipe details", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-text-primary mb-8 text-center sm:text-left">
        ❤️ Favorite Recipes
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center mt-20 text-text-secondary">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-xl font-semibold mb-2">No saved recipes yet</h2>
          <p className="text-sm">
            Browse and save meals you love by clicking the ❤️ button!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[80vh] overflow-y-auto pr-1">
          {favorites.map((meal, idx) => (
            <motion.div
              key={meal.idMeal}
              className="relative p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => openRecipe(meal.idMeal)}
            >
              <div className="relative h-40 w-full mb-4 rounded-xl overflow-hidden">
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <h3 className="text-lg font-semibold text-text-primary truncate">
                {meal.strMeal}
              </h3>
              <p className="text-sm text-text-secondary truncate">
                {meal.strCategory} • {meal.strArea}
              </p>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(meal.idMeal);
                }}
                className="absolute top-3 right-3 bg-white border border-gray-300 text-red-500 rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-100 transition-all"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-5xl h-[90vh] sm:h-[85vh] bg-white rounded-2xl overflow-hidden shadow-lg">
              <RecipeDetails
                recipe={selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Favorites;
