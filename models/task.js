/*
 * task.js
 */

const db = require('../database.js')

module.exports = {
  findAll,
  findById,
  update,
  create,
}


function findAll() {
  return db.findAll('SELECT * FROM tasks')
}

function findById(id) {
  return db.findOne('SELECT * FROM tasks WHERE id = @id', { id })
}

function update(task) {
  return db.run(`
    UPDATE tasks
       SET ${db.toMapping(task)}
     WHERE id = @id
    `, task)
    .then(() => findById(task.id))
}

function create(task) {
  return db.insert(`
    INSERT INTO tasks (categoryId, name)
    VALUES (
      @categoryId,
      @name
    )`, task)
    .then(id => findById(id))
}

module.exports.delete = function(id) {
  return db.run('DELETE FROM tasks WHERE id = @id', { id })
}
