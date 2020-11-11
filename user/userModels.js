const db = require("../data/db-config");

function find() {
  return db("users_table").select("id", "username", "department").orderBy("id");
}

function findBy(filter) {
  return db("users_table").where(filter);
}

function findById(id) {
  return db("users_table").where({ id }).first();
}

async function add(user) {
  try {
    const [id] = await db("users_table").insert(user, "id");
    return findById(id);
  } catch (err) {
    Promise.reject(new Error(err.message));
  }
}

module.exports = { findById, add, findBy, find };
