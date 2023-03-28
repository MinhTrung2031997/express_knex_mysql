const knex = require("knex");
const options = require("../knexfile");
const environment = process.env.NODE_ENV || "development";
const config = options[environment];
module.exports = knex(config);
