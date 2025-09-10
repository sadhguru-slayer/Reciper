// src/pages/Home.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecipeDetails from "../components/RecipeDetails";
import SearchBar from "../components/SearchBar";
import { fetchRecipes} from "../apis/api";
import { useEffect } from "react";

const Home = () => {
  
  const [search, setSearch] = useState("");
  const [hasResults, setHasResults] = useState(false);
  const [searchResults,setSearchResults] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  // Inside Home component
  const [filters, setFilters] = useState({ category: null, area: null });
  const [hasFilters,setHasFilters] = useState(false);

  useEffect(() => {
    if (search.trim()) {
      // Auto-trigger search on filter change if search term exists
      handleSearch({ preventDefault: () => {} });
    }
  }, [filters]);

  const handleSearch = async (e) => {
    e.preventDefault();
  
    if (search.trim()) {
      try {
        const data = await fetchRecipes(search, filters.category, filters.area); // pass filters
        setSearchResults(data.meals || []);
        
        setHasResults(data.meals.length > 0 ?true:false);
        console.log(hasResults)
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    }
  };
  
  

  return (
    <div className="flex flex-col min-h-fit py-2 items-center w-full h-full ">
      {/* Search Bar */}
      <SearchBar 
      search={search}
      setSearch={setSearch}
      handleSearch={handleSearch}
      hasResults={hasResults}
      filters={filters}
      setFilters={setFilters}
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
              key={meal.idMeal || index}   // ✅ unique key
              onClick={() => setSelectedRecipe(meal)} // pass full meal
              className="p-6 bg-background-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="h-40 bg-gradient-to-br from-accent to-accent-hover rounded-xl mb-4 flex items-center justify-center">
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

      {/* Recipe Details Slider */}
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeDetails
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
