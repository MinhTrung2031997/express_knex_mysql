const DEFAULT_MUTATION_SET_OPTS = {
  createAt: true,
  updateAt: true,
};

const DEFAULT_BASE_FLAG_OPTS = {
  activeFlag: true,
  deleteFlag: true,
};

exports.mutationSet = (
  knex,
  table,
  options = {
    createAt: true,
    updateAt: true,
  }
) => {
  const { createAt, updateAt } = { ...DEFAULT_MUTATION_SET_OPTS, ...options };
  if (createAt)
    table.timestamp("createAt").defaultTo(knex.fn.now()).comment("Create Date");
  if (updateAt)
    table.timestamp("updateAt").defaultTo(knex.fn.now()).comment("Create Date");
  return table;
};

exports.baseFlag = (
  table,
  options = { activeFlag: true, deleteFlag: true }
) => {
  const { activeFlag, deleteFlag } = { ...DEFAULT_BASE_FLAG_OPTS, ...options };

  if (activeFlag)
    table.boolean("activeFlag").defaultTo(true).comment("Active Flag");
  if (deleteFlag)
    table.boolean("deletaFlag").defaultTo(true).comment("Delete Flag");

  return table;
};
