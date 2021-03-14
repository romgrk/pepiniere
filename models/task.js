/*
 * task.js
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
  return db.findAll(...query.where('SELECT * FROM tasks', params))
}

function findById(id) {
  return db.findOne('SELECT * FROM tasks WHERE id = @id', { id })
}

function update(task) {
  return db.run(`
    UPDATE tasks
       SET ${query.toMapping(task)}
         , updatedAt = strftime('%s','now')
     WHERE id = @id
    `, task)
    .then(() => findById(task.id))
}

function create(task) {
  return db.insert(`
    INSERT INTO tasks (categoryId, name, createdAt, updatedAt)
    VALUES (
      @categoryId,
      @name,
      strftime('%s','now'),
      strftime('%s','now')
    )`, task)
    .then(id => findById(id))
}

module.exports.delete = function(id) {
  return db.run('UPDATE tasks SET deleted = 1 WHERE id = @id', { id })
}
