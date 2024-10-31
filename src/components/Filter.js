import React, { useState } from "react";
import recipes from '../recipes_data.json';

export const FilterIngredients = () => {
  const [input, setInput] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    const ingredientArray = input.toLowerCase().split(",").map(item => item.trim());

    const filtered = recipes.filter((recipe) => {
      // Check if the recipe contains the extendedIngredients array
      if (recipe.recipes[0]?.extendedIngredients) {
        return ingredientArray.every((ingredient) => {
          return recipe.recipes[0].extendedIngredients.some((item) => {
            return item.name.toLowerCase().includes(ingredient);
          });
        });
      }
      return false; // Return false if extendedIngredients is not found
    });

    setFilteredRecipes(filtered);
  };

  return (
    <div>
      <h2>Filter Recipes by Ingredients</h2>
      <form onSubmit={handleFilter}>
        <label>
          Enter ingredients (comma separated):
          <input type="text" value={input} onChange={handleChange} />
        </label>
        <button type="submit">Filter</button>
      </form>
      <h3>Filtered Recipes:</h3>
      <ul>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe, index) => (
            <li key={index}>{recipe.recipes[0].title}</li>
          ))
        ) : (
          <li>No recipes found.</li>
        )}
      </ul>
    </div>
  );
};
