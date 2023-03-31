const { USERS } = require("../../src/constants/tables");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table(`${USERS}`, function (table) {
    table.boolean("isAdmin").nullable().defaultTo(false).comment("Admin Role");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table(`${USERS}`, function (table) {
    table.dropColumn("isAdmin");
  });
};
