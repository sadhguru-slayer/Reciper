// src/pages/Home.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecipeDetails from "../components/RecipeDetails";
import SearchBar from "../components/SearchBar";
import { fetchRecipes, randomMeal, estimateTimeBucket } from "../apis/api";
import { useEffect } from "react";
const Home = () => {
  const [search, setSearch] = useState("");
  const [hasResults, setHasResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState({ byName: [], byIngredient: [], byCategory: [], byArea: [] });
  const [activeTab, setActiveTab] = useState("Name");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading,setIsLoading] = useState(false)
  const [filters, setFilters] = useState({ category: null, area: null, time: null, mood: null });

  const TAB_ORDER = ["Name", "Ingredient", "Category", "Area"];

  const pickFirstNonEmptyTab = (r) => {
    if ((r.byName || []).length) return "Name";
    if ((r.byIngredient || []).length) return "Ingredient";
    if ((r.byCategory || []).length) return "Category";
    if ((r.byArea || []).length) return "Area";
    return "Name";
  };

  useEffect(() => {
    if (hasSearched && search.trim()) {
      handleSearch({ preventDefault: () => {} });
    }
  }, [filters]); // ✅ Re-run after real search when filters change

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);

    try {
      const data = await fetchRecipes(search, filters.category, filters.area, filters.time, filters.mood);
      setResults(data);
      const any = (data.byName?.length || 0) + (data.byIngredient?.length || 0) + (data.byCategory?.length || 0) + (data.byArea?.length || 0);
      setHasResults(any > 0);
      setActiveTab(pickFirstNonEmptyTab(data));
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setResults({ byName: [], byIngredient: [], byCategory: [], byArea: [] });
      setHasResults(false);
      setActiveTab("Name");
    } finally {
      setIsLoading(false);
    }
  };

  const onRandom = async (e) => {
    e.preventDefault();
    try {
      const data = await randomMeal();
      const meals = data.meals || [];
      const r = {
        byName: meals,
        byIngredient: [],
        byCategory: [],
        byArea: []
      };
      setResults(r);
      setHasResults(meals.length > 0);
      setActiveTab("Name");
    } catch (error) {
      console.log(error);
    }
  };

  const visibleTabs = [
    { key: "Name", list: results.byName },
    { key: "Ingredient", list: results.byIngredient },
    { key: "Category", list: results.byCategory },
    { key: "Area", list: results.byArea }
  ].filter(t => (t.list || []).length > 0);

  const currentList =
    activeTab === "Name" ? results.byName
    : activeTab === "Ingredient" ? results.byIngredient
    : activeTab === "Category" ? results.byCategory
    : results.byArea;


  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  return (
    <div
  className={`relative w-full ${isMobile ? "h-full" : "min-h-screen"} h-full`}
>

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
          className="flex flex-col items-center w-full h-full py-2"
        >
            {/* Search Bar */}
            <SearchBar
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
            hasSearched={hasSearched}
            hasResults={hasResults}
            filters={filters}
            setFilters={setFilters}
            onRandom={onRandom}
            isLoading={isLoading}
            setHasSearched={setHasSearched}
          />

            {/* Tabs */}
                        {/* Tabs */}
                        {hasResults && visibleTabs.length > 0 && (
                          <div className="w-full max-w-6xl px-6 sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
                            <div className="flex flex-wrap gap-2">
                              {["Name","Ingredient","Category","Area"].map((tabKey) => {
                                const item = visibleTabs.find(t => t.key === tabKey);
                                if (!item) return null;
                                const count = item.list.length;
                                const isActive = activeTab === tabKey;
                                return (
                                  <button
                                    key={tabKey}
                                    onClick={() => setActiveTab(tabKey)}
                                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                                      isActive ? "bg-accent text-white" : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                                    }`}
                                  >
                                    {tabKey} ({count})
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                       {/* Results Grid */}
                       <AnimatePresence>
                       {hasResults && (
                        <div className="w-full max-w-6xl px-4 sm:px-6 flex-1 min-h-0">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 0 }}
                            transition={{ delay: 0.05, duration: 0.3 }}
                            className="h-full overflow-y-auto pb-8 pr-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4"
                          >
                          {currentList.map((meal, index) => (
                            <motion.div
                              key={meal.idMeal || index}
                              onClick={() => setSelectedRecipe(meal)}
                              className="group p-3 sm:p-4 bg-background-card rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100"
                              whileHover={{ y: -4, transition: { duration: 0.15 } }}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: Math.min(index * 0.03, 0.3) }}
                            >
                              <div className="aspect-[1/1] rounded-lg mb-3 overflow-hidden bg-gradient-to-br from-accent to-accent-hover">
                                <img
                                  src={meal.strMealThumb}
                                  alt={meal.strMeal}
                                  className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                                />
                              </div>
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="text-sm sm:text-base font-semibold text-text-primary line-clamp-2">
                                  {meal.strMeal}
                                </h3>
                                <span className="shrink-0 text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full bg-gray-100 text-text-secondary">
                                  {(() => {
                                    const b = estimateTimeBucket(meal);
                                    if (b === "quick") return "⏱ <30m";
                                    if (b === "moderate") return "⏱ 30–60m";
                                    return "⏱ >60m";
                                  })()}
                                </span>
                              </div>
                              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-1">
                                {meal.strCategory} • {meal.strArea}
                              </p>
                            </motion.div>
                          ))}
                </motion.div>
                </div>
              )}
            </AnimatePresence>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;