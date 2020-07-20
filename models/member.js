/*
 * member.js
 */

const db = require('../database.js')
const { rejectMessage } = require('../helpers/promise')
const k = require('../constants')

module.exports = {
  findAll,
  findById,
  findBygoogleID,
  update,
  create,
}


function findAll() {
  return db.findAll('SELECT * FROM members')
}

function findById(id) {
  return db.selectOne('SELECT * FROM members WHERE id = @id', { id })
    .catch(err =>
      err.type === k.ROW_NOT_FOUND ?
        rejectMessage('User account not found', k.ACCOUNT_NOT_FOUND) :
        Promise.reject(err)
    )
}

function findBygoogleID(googleID) {
  return db.selectOne('SELECT * FROM members WHERE "googleID" = @googleID', { googleID })
    .catch(err =>
      err.type === k.ROW_NOT_FOUND ?
        rejectMessage('User account not found', k.ACCOUNT_NOT_FOUND) :
        Promise.reject(err)
    )
}

function update(member) {
  return db.query(`
    UPDATE members
       SET ${db.toMapping(member)}
     WHERE id = @id
    `, member)
    .then(() => findById(member.id))
}

function create(member) {
  return db.insert(`
    INSERT INTO members (firstName, lastName, country, photo, isPermanent, startDate, endDate)
    VALUES (
      @firstName,
      @lastName,
      @country,
      @photo,
      @isPermanent,
      @startDate,
      @endDate
    )`, member)
    .then(id => findById(id))
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM members WHERE id = @id', { id })
}
