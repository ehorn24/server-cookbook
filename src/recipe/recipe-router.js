const path = require("path");
const express = require("express");
const RecipeService = require("./recipe-service");

const recipeRouter = express.Router();
const jsonParser = express.json();

recipeRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    RecipeService.getAllRecipes(knexInstance)
      .then(recipes => {
        res.json(recipes);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { username, recipename, recipephoto, ingredients, steps } = req.body;
    const newRecipe = {
      username,
      recipename,
      recipephoto,
      ingredients,
      steps
    };
    for (const [key, value] of Object.entries(newRecipe)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing ${key} from request body` }
        });
      }
    }
    RecipeService.createNewRecipe(knexInstance, newRecipe)
      .then(recipe => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${recipe.recipename}`))
          .json(recipe);
      })
      .catch(next);
  });

recipeRouter
  .route("/:recipe_id")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    RecipeService.getByRecipename(knexInstance, req.params.recipe_id)
      .then(recipe => {
        if (!recipe) {
          return res.status(404).json({
            error: { message: "Recipe doesn't exist." }
          });
        }
        res.recipe = recipe;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.recipe);
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    RecipeService.deleteRecipe(knexInstance, req.params.recipe_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { recipename, recipephoto, ingredients, instructions } = req.body;
    const recipeToUpdate = {
      recipename,
      recipephoto,
      recipephoto,
      ingredients,
      instructions
    };
    const numberOfValues = Object.values(recipeToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message:
            "Request body must contain either recipename, recipephoto, ingredients, or instructions."
        }
      });
    }
    RecipeService.updateRecipe(
      knexInstance,
      req.params.recipe_id,
      recipeToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = recipeRouter;
