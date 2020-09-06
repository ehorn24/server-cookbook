CREATE TABLE saved_recipes (
  recipe_id INTEGER REFERENCES recipes(id) NOT NULL,
  user_saved TEXT REFERENCES users(username) NOT NULL
)