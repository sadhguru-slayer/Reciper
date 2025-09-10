// src/components/RecipeDetails.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";

const RecipeDetails = ({ recipe, onClose }) => {
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Slider Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.4 
        }}
        className="fixed top-0 right-0 h-full w-full sm:w-[450px] lg:w-[500px] bg-white shadow-2xl z-50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-accent to-accent-hover">
          <h2 className="text-2xl font-bold text-white">{recipe.name}</h2>
          <motion.button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 transition-colors duration-200 p-2 rounded-full hover:bg-white hover:bg-opacity-20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <XMarkIcon className="h-6 w-6" />
          </motion.button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          {/* Recipe Image */}
          <motion.div 
            className="h-48 bg-gradient-to-br from-accent to-accent-hover rounded-2xl flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-white text-4xl">🍽️</span>
          </motion.div>

          {/* Recipe Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-text-primary">Ingredients</h3>
            <ul className="space-y-2 text-text-secondary">
              <li>• Fresh ingredients</li>
              <li>• Spices and herbs</li>
              <li>• Cooking oil</li>
              <li>• Salt and pepper</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-text-primary">Instructions</h3>
            <p className="text-text-secondary leading-relaxed">
              Detailed cooking instructions will be displayed here. This includes step-by-step 
              guidance on how to prepare this delicious recipe with proper timing and techniques.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3 pt-4"
          >
            <motion.button
              className="flex-1 bg-accent text-white py-3 px-6 rounded-xl font-semibold hover:bg-accent-hover transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Recipe
            </motion.button>
            <motion.button
              className="flex-1 bg-gray-100 text-text-primary py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Share
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecipeDetails;
