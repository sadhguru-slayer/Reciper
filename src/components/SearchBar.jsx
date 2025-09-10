import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

const SearchBar = ({ search, setSearch, handleSearch, hasResults, filters, setFilters, onRandom }) => {

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

  const removeFilter = (type) => {
    setFilters((prev) => ({ ...prev, [type]: null }));
  };

  console.log(hasResults)

  return (
    <motion.div
  className={`w-full flex justify-center transition-all duration-500 ${
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
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-20 py-4 text-lg rounded-2xl shadow-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 border border-gray-200 transition-all duration-300 hover:shadow-xl"
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
  disabled={!search.trim()}
  className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl transition-all duration-200 
    ${search.trim() ? 'bg-accent text-white hover:bg-accent-hover' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
  `}
>
  Search
</motion.button>


          {/* Filter Dropdown */}
          <AnimatePresence>
          
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 mt-2 w-96 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 overflow-hidden"
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
                          className="grid grid-cols-3 gap-2 mt-3"
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

        {/* Active Filters as Chips */}
        <AnimatePresence>
          {(filters.category || filters.area) && (
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Random Meal Button */}
<div className="mt-6 flex justify-center">
<motion.button
  type="button"
  className="px-6 py-3 bg-gray-100 text-text-primary rounded-lg shadow-md hover:bg-gray-200 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={onRandom}
>
  <span className="inline-block mr-2">🎲</span> Suggest a Random Meal
</motion.button>
</div>

{!hasResults && (
    <p className="text-center mt-8 text-text-secondary text-lg">No meals found with the selected filters.</p>
  )}

      </motion.form>
    </motion.div>
  );
};

export default SearchBar;
