require("dotenv").config();

const http = require("http");
const app = require("./app");

const { mongoConnect } = require("./services/mongo");

const { loadPlanetsData } = require("./models/planets.models");
const { loadLaunchData } = require("./models/launches.models");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
