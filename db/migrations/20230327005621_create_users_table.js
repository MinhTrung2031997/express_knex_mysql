const { USERS } = require("../../src/constants/tables");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(`${USERS}`, function (table) {
    table.increments("id", { primaryKey: true });
    table.string("firstName", 30).notNullable();
    table.string("lastName", 30).notNullable();
    table.string("email", 250).notNullable();
    table.string("password", 250).notNullable();
    table.datetime("createdAt", { precision: 6 }).defaultTo(knex.fn.now(6));
    table.datetime("updatedAt", { precision: 6 }).defaultTo(knex.fn.now(6));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable(`${USERS}`);
};
