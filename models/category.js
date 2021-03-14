/*
 * category.js
 */

const db = require('../database.js')
const query = require('../helpers/query.js')

module.exports = {
  findAll,
  findById,
  update,
  create,
}


function findAll(params) {
  return db.findAll(...query.where('SELECT * FROM categories', params))
}

function findById(id) {
  return db.findOne('SELECT * FROM categories WHERE id = @id', { id })
}

function update(category) {
  return db.run(`
    UPDATE categories
       SET ${query.toMapping(category)}
         , updatedAt = strftime('%s','now')
     WHERE id = @id
    `, category)
    .then(() => findById(category.id))
}

function create(category) {
  return db.insert(`
    INSERT INTO categories (name, color, createdAt, updatedAt)
    VALUES (
      @name,
      @color,
      strftime('%s','now'),
      strftime('%s','now')
    )`, category)
    .then(id => findById(id))
}

module.exports.delete = function(id) {
  return Promise.all([
    db.run('UPDATE categories SET deleted = 1 WHERE id = @id', { id }),
    db.run('UPDATE tasks      SET deleted = 1 WHERE categoryId = @id', { id }),
  ])
}
