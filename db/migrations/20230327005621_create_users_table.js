const { USERS } = require("../../src/constants/tables");
const { mutationSet, baseFlag } = require("../helpers");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(`${USERS}`, function (table) {
    table.increments("id", { primaryKey: true }).comment("User's Id");
    table.string("firstName", 30).notNullable().comment("User's first name");
    table.string("lastName", 30).notNullable().comment("User's last name");
    table.string("email", 250).unique().notNullable().comment("User's email");
    table.string("password", 250).notNullable().comment("User's password");
    mutationSet(knex, table);
    baseFlag(table);

    table.comment("Authentication User");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema;
};
