exports.up = function (knex) {
  return knex.schema.createTable("users_table", (tbl) => {
    tbl.increments();
    tbl.string("username", 128).notNullable().unique().index();
    tbl.string("password", 128).notNullable();
    tbl.string("department", 128).notNullable();
  });
};

exports.down = function (knex) {
  return knex.dropTableIfExists("users_table");
};
