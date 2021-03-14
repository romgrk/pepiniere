/*
 * member.js
 */

const db = require('../database.js')
const query = require('../helpers/query.js')

module.exports = {
  findAll,
  findById,
  findPhotoById,
  update,
  create,
}


function findAll(params) {
  return db.findAll(...query.where('SELECT * FROM members', params))
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
       SET ${query.toMapping(member)}
         , updatedAt = strftime('%s','now')
     WHERE id = @id
    `, member)
    .then(() => findById(member.id))
}

function create(member) {
  return db.insert(`
    INSERT INTO members (firstName, lastName, country, photo, isPermanent, startDate, endDate, createdAt, updatedAt)
    VALUES (
      @firstName,
      @lastName,
      @country,
      @photo,
      @isPermanent,
      @startDate,
      @endDate,
      strftime('%s','now'),
      strftime('%s','now')
    )`, member)
    .then(id => findById(id))
}

module.exports.delete = function(id) {
  return db.run('UPDATE members SET deleted = 1 WHERE id = @id', { id })
}

// Helpers

function serialize(member) {
  if (member.photo)
    member.photo = `/api/member/photo/${member.id}`
  return member
}
