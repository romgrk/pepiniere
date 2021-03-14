/*
 * query.js
 */

module.exports = {
  where,
  toMapping,
}

function where(query, params) {
  const conditions = []
  const newParams = {}

  Object.keys(params).forEach(key => {
    const value = params[key]
    switch (key) {
      case 'id':
      case 'full':
        break
      case 'lastUpdate':
        conditions.push('updatedAt > @updatedAt')
        newParams['updatedAt'] = value
        break
      default:
        throw new Error(`Unknown param: ${key}`)
    }
  })

  if (!params.lastUpdate) {
    conditions.push('deleted != 1')
  }

  const newQuery = `${query} WHERE ${conditions.join(' AND ') || '1 = 1'}`

  return [newQuery, newParams]
}


function toMapping(obj) {
  return (
    Object.keys(obj)
      .filter(key => key !== 'id')
      .map(key => `${key} = @${key}`)
      .join(', ') || ''
  );
}

