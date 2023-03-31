const { TOKENS } = require("../../src/constants/tables");
const { mutationSet } = require("../helpers");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(`${TOKENS}`, function (table) {
    table.increments("id", { primaryKey: true }).comment("Token's id");
    table
      .integer("userId")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .comment("UserId refer to id of user table");
    table
      .string("refreshToken", 250)
      .notNullable()
      .comment("Refresh Token of User");
    table.string("expiresIn", 64).notNullable().comment("Token expire");
    mutationSet(knex, table);

    table.comment("Authentication Token");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema;
};
