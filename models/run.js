/*
 * run.js
 */

const db = require('../database.js')

module.exports = {
  findAll,
  findById,
  update,
  create,
}


function findAll() {
  return db.findAll('SELECT * FROM runs')
}

function findById(id) {
  return db.findOne('SELECT * FROM runs WHERE id = @id', { id })
}

function update(run) {
  return db.run(`
    UPDATE runs
       SET ${db.toMapping(run)}
     WHERE id = @id
    `, run)
    .then(() => findById(run.id))
}

function create(run) {
  return db.insert(`
    INSERT INTO runs (taskId, memberId, date, isAM, notes)
    VALUES (
      @taskId,
      @memberId,
      @date,
      @isAM,
      @notes
    )`, run)
    .then(id => findById(id))
}

module.exports.delete = function(id) {
  return db.run('DELETE FROM runs WHERE id = @id', { id })
}
