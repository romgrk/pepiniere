/*
 * run.js
 */

const db = require('../database.js')
const query = require('../helpers/query.js')

module.exports = {
  findAll,
  findById,
  update,
  addMember,
  removeMember,
  create,
}


function findAll(params) {
  return db.findAll(...query.where('SELECT * FROM runs', params))
    .then(xs => xs.map(deserialize))
}

function findById(id) {
  return db.findOne('SELECT * FROM runs WHERE id = @id', { id }).then(deserialize)
}

function update(run) {
  return db.run(`
    UPDATE runs
       SET ${query.toMapping(run)}
         , updatedAt = strftime('%s','now')
     WHERE id = @id
    `, serialize(run))
    .then(() => findById(run.id))
}

function addMember(id, memberId) {
  return findById(id)
  .then(run =>
    db.run(`
      UPDATE runs
        SET membersId = @membersId
          , updatedAt = strftime('%s','now')
      WHERE id = @id
    `, serialize({ id, membersId: run.membersId.concat(memberId) }))
  )
}

function removeMember(id, memberId) {
  return findById(id)
  .then(run =>
    db.run(`
      UPDATE runs
        SET membersId = @membersId
          , updatedAt = strftime('%s','now')
      WHERE id = @id
    `, serialize({ id, membersId: run.membersId.filter(id => id !== memberId) }))
  )
}

function create(run) {
  return db.insert(`
    INSERT INTO runs (taskId, membersId, date, isAM, notes, createdAt, updatedAt)
    VALUES (
      @taskId,
      @membersId,
      @date,
      @isAM,
      @notes,
      strftime('%s','now'),
      strftime('%s','now')
    )`, serialize(run))
    .then(id => findById(id))
}

module.exports.delete = function(id) {
  return db.run('UPDATE runs SET deleted = 1 WHERE id = @id', { id })
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
