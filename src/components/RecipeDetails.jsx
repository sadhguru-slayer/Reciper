// src/components/RecipeDetails.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, HeartIcon, ShareIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

const RecipeDetails = ({ recipe, onClose }) => {
  const [isSaved, setIsSaved] = React.useState(false);

  // Extract ingredients and measurements
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient: ingredient.trim(), measure: measure?.trim() || "" });
    }
  }

  return (
    <motion.div
    initial={{ y: "100%", opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full h-full overflow-y-auto bg-white rounded-3xl"
    >
    
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            onClick={onClose}
            className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Back to Search</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isSaved 
                  ? 'text-red-500 bg-red-50' 
                  : 'text-text-secondary hover:text-red-500 hover:bg-red-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSaved ? (
                <HeartSolidIcon className="h-6 w-6" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
            </motion.button>
            
            <motion.button
              className="p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShareIcon className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Recipe Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-text-primary mb-4">{recipe.strMeal}</h1>
          <div className="flex items-center justify-center gap-4 text-text-secondary">
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
              {recipe.strCategory}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-text-secondary rounded-full text-sm font-medium">
              {recipe.strArea}
            </span>
          </div>
        </motion.div>

        {/* Recipe Image */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredients */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <span className="text-2xl">🥘</span>
              Ingredients
            </h2>
            <div className="space-y-3">
              {ingredients.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                  <span className="text-text-primary font-medium">{item.ingredient}</span>
                  {item.measure && (
                    <span className="text-text-secondary text-sm ml-auto">{item.measure}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Instructions
            </h2>
            <div className="prose prose-gray max-w-none">
              {recipe.strInstructions?.split('\n').map((instruction, index) => (
                instruction.trim() && (
                  <motion.p
                    key={index}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="text-text-secondary leading-relaxed mb-4 p-3 rounded-lg bg-gray-50"
                  >
                    <span className="font-semibold text-accent mr-2">{index + 1}.</span>
                    {instruction.trim()}
                  </motion.p>
                )
              ))}
            </div>
          </motion.div>
        </div>

        {/* Video Section */}
        {recipe.strYoutube && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <span className="text-2xl">🎥</span>
              Video Tutorial
            </h2>
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                src={recipe.strYoutube.replace('watch?v=', 'embed/')}
                title={`${recipe.strMeal} Tutorial`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex gap-4 justify-center"
        >
          <motion.button
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
              isSaved 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-accent text-white hover:bg-accent-hover'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSaved(!isSaved)}
          >
            {isSaved ? 'Saved!' : 'Save Recipe'}
          </motion.button>
          
          <motion.button
            className="px-8 py-4 bg-gray-100 text-text-primary rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Share Recipe
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RecipeDetails;
