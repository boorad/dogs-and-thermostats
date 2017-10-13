//-----------------------------------------------------------------------------
// Services Setup
//-----------------------------------------------------------------------------

require('dotenv').config()

const openWeatherApiKey = process.env.OPEN_WEATHER_API_KEY;
if (!openWeatherApiKey) {
  console.log("OPEN_WEATHER_API_KEY env var is missing, weather services won't be available");
}
const WeatherService = require("./weather-service");
const weather = new WeatherService(openWeatherApiKey);

const DogsService = require("./dogs-service");
const dogs = new DogsService();

//-----------------------------------------------------------------------------
// Server Setup
//-----------------------------------------------------------------------------

const Hapi = require("hapi");
const Inert = require("inert");

const server = new Hapi.Server();

server.connection({
  port: process.env.HAPI_PORT || 8080,
  host: process.env.HAPI_HOST || "localhost"
});

const startServer = async () => {

  await server.register(Inert);

  //---------------------------------------------------------------------------
  // API Routes
  //---------------------------------------------------------------------------

  // breeds endpoint
  server.route({
    method: "GET",
    path: "/api/breeds",
    handler: (request, reply) => {
      dogs.getBreeds().then(breeds => {
        reply(breeds);
      })
    }
  });

  // images endpoint
  server.route({
    method: "GET",
    path: "/api/images/{breed}/{subBreed?}",
    handler: (request, reply) => {
      let breed = request.params.breed;
      let subBreed = ("subBreed" in request.params)
        ? request.params.subBreed
        : "all";
      dogs.getBreedImages(breed, subBreed).then(images => {
        reply(images)
      });
    }
  });

  // temperature endpoint
  server.route({
    method: "GET",
    path: "/api/temp/{zip}",
    handler: (request, reply) => {
      let zip = request.params.zip;
      weather.getTemperature(zip).then(temp => reply(temp));
    }
  });

  //---------------------------------------------------------------------------
  // Static Routes
  //---------------------------------------------------------------------------

  // index
  server.route({
    method: "GET",
    path: "/",
    handler: (request, reply) => {
      reply.file("public/index.html");
    },
  });

  // static assets
  server.route({
    method: "GET",
    path: "/assets/{file*}",
    handler: {
      directory: {
        path: "public",
      }
    }
  });

  await server.start();

  console.log("Server started at: " + server.info.uri);
};

startServer();
