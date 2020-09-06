const express = require("express");
const SavedRecipeService = require("./saved-recipe-service");

const savedRecipeRouter = express.Router();
const jsonParser = express.json();

savedRecipeRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    SavedRecipeService.getAllSavedRecipes(knexInstance)
      .then(sRecipes => {
        res.json(sRecipes);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { recipe_id, user_saved } = req.body;
    const newSave = { recipe_id, user_saved };
    for (const [key, value] of Object.entries(newSave)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing ${key} from request body.` }
        });
      }
    }
    SavedRecipeService.saveRecipe(knexInstance, newSave)
      .then(sRecipe => res.status(201).json(sRecipe))
      .catch(next);
  });

savedRecipeRouter
  .route("/:user_saved")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    SavedRecipeService.getRecipesForUser(knexInstance, req.params.user_saved)
      .then(sRecipes => {
        res.json(sRecipes);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { recipe_id, user_saved } = req.body;
    const newSave = { recipe_id, user_saved };
    for (const [key, value] of Object.entries(newSave)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing ${key} from request body.` }
        });
      }
    }
    SavedRecipeService.saveRecipe(knexInstance, newSave)
      .then(sRecipe => {
        res.status(201).json(sRecipe);
      })
      .catch(next);
  });

savedRecipeRouter
  .route("/:recipe_id/:user_saved")
  .delete(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { recipe_id, user_saved } = req.params;
    SavedRecipeService.deleteSavedRecipe(knexInstance, recipe_id, user_saved)
      .then(numRowsAffected => res.status(204).end())
      .catch(next);
  });

module.exports = savedRecipeRouter;
