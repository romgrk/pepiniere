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
  return db.findAll('SELECT * FROM runs').then(xs => xs.map(deserialize))
}

function findById(id) {
  return db.findOne('SELECT * FROM runs WHERE id = @id', { id }).then(deserialize)
}

function update(run) {
  return db.run(`
    UPDATE runs
       SET ${db.toMapping(run)}
     WHERE id = @id
    `, serialize(run))
    .then(() => findById(run.id))
}

function create(run) {
  return db.insert(`
    INSERT INTO runs (taskId, membersId, date, isAM, notes)
    VALUES (
      @taskId,
      @membersId,
      @date,
      @isAM,
      @notes
    )`, serialize(run))
    .then(id => findById(id))
}

module.exports.delete = function(id) {
  return db.run('DELETE FROM runs WHERE id = @id', { id })
}

// Conversion

function serialize(r) {
  if (r.membersId)
    r.membersId = JSON.stringify(r.membersId)
  return r
}

function deserialize(r) {
  r.membersId = JSON.parse(r.membersId)
  r.isAM = Boolean(r.isAM)
  return r
}
