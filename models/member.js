/*
 * member.js
 */

const db = require('../database.js')
const { rejectMessage } = require('../helpers/promise')
const k = require('../constants')

module.exports = {
  findAll,
  findById,
  findPhotoById,
  update,
  create,
}


function findAll() {
  return db.findAll('SELECT * FROM members')
    .then(ms => ms.map(serialize))
}

function findById(id) {
  return db.findOne('SELECT * FROM members WHERE id = @id', { id })
    .then(m => serialize(m))
}

function findPhotoById(id) {
  return db.findOne('SELECT * FROM members WHERE id = @id', { id })
    .then(m => {
      const data = m.photo.replace('data:image/png;base64,', '')
      const buffer = new Buffer(data, 'base64')
      return buffer
    })
}

function update(member) {
  return db.run(`
    UPDATE members
       SET ${db.toMapping(member)}
         , updatedAt = strftime('%s','now')
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
  return db.run('DELETE FROM members WHERE id = @id', { id })
}

// Helpers

function serialize(member) {
  if (member.photo)
    member.photo = `/api/member/photo/${member.id}`
  return member
}
