import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

const SearchBar = ({ search, setSearch, handleSearch, hasSearched , hasResults, filters, setFilters, onRandom, isLoading, setHasSearched }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [activeSection, setActiveSection] = useState(null); // "category" | "area" | null

  // Fetch categories & areas
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, areaRes] = await Promise.all([
          fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list").then(r => r.json()),
          fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list").then(r => r.json())
        ]);
        setCategories(catRes.meals.map(m => m.strCategory));
        setAreas(areaRes.meals.map(m => m.strArea));
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };
    fetchFilters();
  }, []);

  const handleFilterSelect = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    setShowFilters(false);
    setActiveSection(null);
  };

  const toggleFilterSelect = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: prev[type] === value ? null : value }));
  };

  const removeFilter = (type) => {
    setFilters((prev) => ({ ...prev, [type]: null }));
  };

  const [showPills, setShowPills] = useState(true);


  return (
    <motion.div
      className={`w-full z-20 flex justify-center transition-all duration-500 ${
        hasResults ? 'items-start mt-6' : 'items-center h-full'
      }`}
      initial={{ y: 0, scale: 1 }}
      animate={hasResults ? { y: 0, scale: 0.9 } : { y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <motion.form
        onSubmit={handleSearch}
        className="w-full max-w-2xl px-6"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          {/* Input with filter icon */}
          <input
            type="text"
            placeholder="Search by ingredient or name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setHasSearched(false); }}
            className="w-full pl-12 pr-20 py-3 sm:py-4 text-base sm:text-lg rounded-2xl shadow-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 border border-gray-200 transition-all duration-300 hover:shadow-xl"
          />

          {/* Filter Button */}
          <motion.button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors duration-200 ${
              showFilters ? "bg-accent text-white" : "text-text-secondary hover:text-accent hover:bg-gray-100"
            }`}
          >
            <FunnelIcon className="h-5 w-5" />
          </motion.button>

          {/* Search Button */}
          <motion.button
            type="submit"
            disabled={isLoading || !search.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-xl transition-all duration-200 
              ${search.trim() && !isLoading ? 'bg-accent text-white hover:bg-accent-hover' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
            `}
          >
            {isLoading ? "Searching..." : "Search"}
          </motion.button>

          {/* Filter Dropdown (Category & Area only) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 mt-2 w-[85vw] sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-text-primary">Filters</h3>
                  <button
                    onClick={() => {
                      setShowFilters(false);
                      setActiveSection(null);
                    }}
                    className="text-text-secondary hover:text-accent transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Toggle Category */}
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSection((prev) => (prev === "category" ? null : "category"))
                      }
                      className="w-full text-left font-medium text-sm text-text-primary flex justify-between items-center"
                    >
                      Category
                      <span>{activeSection === "category" ? "▲" : "▼"}</span>
                    </button>
                    <AnimatePresence>
                      {activeSection === "category" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-3 gap-2 mt-3"
                        >
                          {categories.map((cat) => (
                            <motion.button
                              key={cat}
                              type="button"
                              onClick={() => handleFilterSelect("category", cat)}
                              className={`px-2 py-1 text-xs rounded-lg transition-colors duration-200 ${
                                filters.category === cat
                                  ? "bg-accent text-white"
                                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {cat}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Toggle Area */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setActiveSection((prev) => (prev === "area" ? null : "area"))}
                      className="w-full text-left font-medium text-sm text-text-primary flex justify-between items-center"
                    >
                      Cuisine Area
                      <span>{activeSection === "area" ? "▲" : "▼"}</span>
                    </button>
                    <AnimatePresence>
                      {activeSection === "area" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-3 gap-2 mt-3 overflow-y-auto max-h-40"
                        >
                          {areas.map((area) => (
                            <motion.button
                              key={area}
                              type="button"
                              onClick={() => handleFilterSelect("area", area)}
                              className={`px-2 py-1 text-xs rounded-lg transition-colors duration-200 ${
                                filters.area === area
                                  ? "bg-accent text-white"
                                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {area}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

{/* Toggle Button for Time & Mood Filters */}
<div className="flex justify-center mt-6">
  <motion.button
    type="button"
    onClick={() => setShowPills((prev) => !prev)}
    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white shadow-sm text-sm font-medium text-text-secondary hover:border-accent hover:text-accent transition-all"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span>🎛 Filters</span>
    <span className={`transition-transform ${showPills ? "rotate-180" : ""}`}>⌄</span>
  </motion.button>
</div>


{/* Animate Presence for Pills */}
<AnimatePresence>
  {showPills && (
    <motion.div
      key="pills"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto"
    >
      {/* Time Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-gray-200 rounded-xl shadow-md p-4"
      >
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
          ⏱ Time
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "quick", label: "<30 min" },
            { key: "moderate", label: "30–60 min" },
            { key: "leisure", label: ">60 min" },
          ].map((t, i) => (
            <motion.button
              key={t.key}
              type="button"
              onClick={() => toggleFilterSelect("time", t.key)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all duration-200 ${
                filters.time === t.key
                  ? "bg-accent text-white shadow-md"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              {t.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Mood Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-gray-200 rounded-xl shadow-md p-4"
      >
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
          🙂 Mood
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Comfort", "Healthy", "Indulgent", "Adventurous"].map((m, i) => (
            <motion.button
              key={m}
              type="button"
              onClick={() => toggleFilterSelect("mood", m)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all duration-200 ${
                filters.mood === m
                  ? "bg-accent text-white shadow-md"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              {m}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


        {/* Active Filters as Chips (all four) */}
        <AnimatePresence>
          {(filters.category || filters.area || filters.time || filters.mood) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex gap-2 mt-3 flex-wrap justify-center"
            >
              {filters.category && (
                <span
                  onClick={() => removeFilter("category")}
                  className="px-3 py-1 bg-accent text-white rounded-full text-sm cursor-pointer"
                >
                  {filters.category} ✕
                </span>
              )}
              {filters.area && (
                <span
                  onClick={() => removeFilter("area")}
                  className="px-3 py-1 bg-accent text-white rounded-full text-sm cursor-pointer"
                >
                  {filters.area} ✕
                </span>
              )}
              {filters.time && (
                <span
                  onClick={() => removeFilter("time")}
                  className="px-3 py-1 bg-accent text-white rounded-full text-sm cursor-pointer"
                >
                  {filters.time === "quick" ? "<30 min" : filters.time === "moderate" ? "30–60 min" : ">60 min"} ✕
                </span>
              )}
              {filters.mood && (
                <span
                  onClick={() => removeFilter("mood")}
                  className="px-3 py-1 bg-accent text-white rounded-full text-sm cursor-pointer"
                >
                  {filters.mood} ✕
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Random Meal Button */}
<div className="mt-6 flex justify-center">
<motion.button
  onClick={onRandom}
  className="mt-4 inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base font-medium rounded-full bg-accent text-white hover:bg-accent-hover transition-all duration-200 shadow-md"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <span className="text-lg sm:text-xl">🎲</span>
  <span className="whitespace-nowrap">Surprise Me</span>
</motion.button>
</div>


        {/* No Results Fallback */}
        {hasSearched && search.trim() && !hasResults && !isLoading && (
          <div className="mt-12 flex flex-col items-center justify-center text-center px-6">
            <div className="text-5xl mb-4">🔍</div>

            <h2 className="text-xl font-semibold text-text-primary mb-2">
              No results found for "<span className="text-accent">{search}</span>"
            </h2>

            <p className="text-text-secondary text-sm max-w-md">
              We couldn't find any meals that match your search query
              {filters.category && ` in the "${filters.category}" category`}
              {filters.area && ` from "${filters.area}" cuisine`}
              {filters.time && ` with time ${filters.time === "quick" ? "<30 min" : filters.time === "moderate" ? "30–60 min" : ">60 min"}`}
              {filters.mood && ` for "${filters.mood}" mood`}
              .
              <br />
              Try searching for a different ingredient or dish name, or clear filters.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center mt-6">
            <svg
              className="animate-spin h-6 w-6 text-accent"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          </div>
        )}
      </motion.form>
    </motion.div>
  );
};

export default SearchBar;