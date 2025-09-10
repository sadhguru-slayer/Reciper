// src/pages/Home.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecipeDetails from "../components/RecipeDetails";
import SearchBar from "../components/SearchBar";
import { fetchRecipes, randomMeal } from "../apis/api";
import { useEffect } from "react";

const Home = () => {
  const [search, setSearch] = useState("");
  const [hasResults, setHasResults] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filters, setFilters] = useState({ category: null, area: null });

  useEffect(() => {
    if (search.trim()) {
      handleSearch({ preventDefault: () => {} });
    }
  }, [filters]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search.trim()) {
      try {
        const data = await fetchRecipes(search, filters.category, filters.area);
        setSearchResults(data.meals || []);
        setHasResults(data.meals.length > 0 ? true : false);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    }
  };

  const onRandom = async (e) => {
    e.preventDefault();
    try {
      const data = await randomMeal();
      setSearchResults(data.meals || []);
      setHasResults(data.meals.length > 0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen">
      <AnimatePresence mode="wait">
        {selectedRecipe ? (
          // Recipe Details Card - Full Screen
          <RecipeDetails
            key="recipe-details"
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        ) : (
          // Main Content - Search Bar + Results
          <motion.div
            key="main-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col min-h-fit py-2 items-center w-full h-full"
          >
            {/* Search Bar */}
            <SearchBar
              search={search}
              setSearch={setSearch}
              handleSearch={handleSearch}
              hasResults={hasResults}
              filters={filters}
              setFilters={setFilters}
              onRandom={onRandom}
            />

            {/* Results Grid */}
            <AnimatePresence>
              {hasResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-8 max-h-[30rem] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-6"
                >
                  {searchResults.map((meal, index) => (
                    <motion.div
                      key={meal.idMeal || index}
                      onClick={() => setSelectedRecipe(meal)}
                      className="p-6 bg-background-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                      whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="h-40 bg-gradient-to-br from-accent to-accent-hover rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                        <img
                          src={meal.strMealThumb}
                          alt={meal.strMeal}
                          className="h-full w-full object-cover rounded-xl"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-text-primary mb-2">
                        {meal.strMeal}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
                        {meal.strCategory} • {meal.strArea}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
