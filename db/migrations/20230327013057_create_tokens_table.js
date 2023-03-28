const { TOKENS } = require("../../src/constants/tables");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(`${TOKENS}`, function (table) {
    table.increments("id", { primaryKey: true });
    table
      .integer("userId")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("refreshToken", 250).notNullable();
    table.string("expiresIn", 64).notNullable();
    table.datetime("createdAt", { precision: 6 }).defaultTo(knex.fn.now(6));
    table.datetime("updatedAt", { precision: 6 }).defaultTo(knex.fn.now(6));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable(`${TOKENS}`);
};
