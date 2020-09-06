const SavedRecipeService = {
  getAllSavedRecipes(knex) {
    return knex.select("*").from("saved_recipes");
  },
  getRecipesForUser(knex, username) {
    return knex
      .select("*")
      .from("saved_recipes")
      .where("user_saved", username);
  },

  saveRecipe(knex, newSave) {
    return knex
      .insert(newSave)
      .into("saved_recipes")
      .returning("*")
      .then(sRecipe => {
        return sRecipe[0];
      });
  },

  deleteSavedRecipe(knex, recipe_id, user_saved) {
    return knex("saved_recipes")
      .where({ recipe_id })
      .andWhere({ user_saved })
      .delete();
  }
};

module.exports = SavedRecipeService;
