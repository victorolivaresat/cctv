const {
  getLanguages,
  getLatestChanges,
  writeChangesToChangelog,
} = require("../app/api/github");
const routes = require("express").Router();

routes.get("/languages", async (req, res) => {
  const languages = await getLanguages();
  res.json(languages);
});

routes.get("/latestChanges", async (req, res) => {
  const latestChanges = await getLatestChanges();
  res.json(latestChanges);
});

module.exports = routes;
