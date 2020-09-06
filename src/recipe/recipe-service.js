const RecipeService = {
  getAllRecipes(knex) {
    return knex.select("*").from("recipes");
  },

  createNewRecipe(knex, newRecipe) {
    return knex
      .insert(newRecipe)
      .into("recipes")
      .returning("*")
      .then(recipes => {
        return recipes[0];
      });
  },

  getByRecipename(knex, id) {
    return knex
      .from("recipes")
      .select("*")
      .where("id", id)
      .first();
  },

  updateRecipe(knex, id, newRecipeFields) {
    return knex("recipes")
      .where({ id })
      .update(newRecipeFields);
  },

  deleteRecipe(knex, id) {
    return knex("recipes")
      .where({ id })
      .delete();
  }
};

module.exports = RecipeService;
