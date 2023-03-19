import express from "express";
import { getRSSFeed } from "./util";
const rssURL = "https://notthatmichaelmoore.substack.com/feed";

// Initialize the express engine
const app: express.Application = express();

// Take a port 3000 for running server.
const port: number = 3000;

app.get("/", (_req, _res) => {
  _res.status(200).json({ hello: "Online" });
});

// Handle RSS Feed Fetch
app.get("/api/v1", async (_req, _res) => {
  const feed = await getRSSFeed(rssURL);
  _res.status(200).json({ posts: feed });
});

// Server setup
app.listen(port, () => {
  console.log(`TypeScript with Express
         http://localhost:${port}/`);
});

module.exports = app;
