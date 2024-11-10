const https = require("https");
const fs = require("fs");

const USER = "victorolivaresat";
const REPOSITORY = "notify";
const token = process.env.GIT_TOKEN;

const getLanguages = () => {
  const url = `https://api.github.com/repos/${USER}/${REPOSITORY}/languages`;

  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            Authorization: `token ${token}`,
            "User-Agent": "Node.js",
          },
        },
        (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            resolve(JSON.parse(data));
          });
        }
      )
      .on("error", (err) => {
        console.error(err);
        reject(err);
      });
  });
};

const getLatestChanges = () => {
  const commitsUrl = `https://api.github.com/repos/${USER}/${REPOSITORY}/commits`;

  return new Promise((resolve, reject) => {
    https
      .get(
        commitsUrl,
        {
          headers: {
            Authorization: `token ${token}`,
            "User-Agent": "Node.js",
          },
        },
        (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            const commits = JSON.parse(data);
            const changes = commits.map((commit) => {
              return {
                commit: commit.sha,
                author: commit.commit.author.name,
                date: commit.commit.author.date,
                username: commit.author.login,
                message: commit.commit.message,
                url: commit.html_url,
                comments_url: commit.comments_url,
                stats: commit.stats,
              };
            });
            resolve(changes);
          });
        }
      )
      .on("error", (err) => {
        console.error(err);
        reject(err);
      });
  });
};

module.exports = {
  getLanguages,
  getLatestChanges,
};
