/*
 * requests.js
 */


import axios from 'axios'

import queryString from './helpers/query-string'



export const auth = {
  isLoggedIn: () => GET('/auth/is-logged-in'),
  login: password => POST('/auth/login', { username: 'root', password }),
  logout: () => POST('/auth/logout'),
}

export const settings = {
  list: () => GET('/settings/list'),
  update: (key, value) => POST(`/settings/update/${key}`, { value }),
  changePassword: (password, newPassword) => POST(`/settings/change-password`, { password, newPassword }),
  restoreBackup: (file) => POST(`/settings/restore-backup`, form({ file })),
}

export const members = {
  list: () => GET('/member/list'),
  get: (id) => GET(`/member/get/${id}`),
  create: (data) => POST(`/member/create`, data),
  update: (id, data) => POST(`/member/update/${id}`, data),
  delete: (id) => POST(`/member/delete/${id}`),
}

export const categories = {
  list: () => GET('/category/list'),
  get: (id) => GET(`/category/get/${id}`),
  create: (data) => POST(`/category/create`, data),
  update: (id, data) => POST(`/category/update/${id}`, data),
  delete: (id) => POST(`/category/delete/${id}`),
}

export const tasks = {
  list: () => GET('/task/list'),
  get: (id) => GET(`/task/get/${id}`),
  create: (data) => POST(`/task/create`, data),
  update: (id, data) => POST(`/task/update/${id}`, data),
  delete: (id) => POST(`/task/delete/${id}`),
}

export const runs = {
  list: () => GET('/run/list'),
  get: (id) => GET(`/run/get/${id}`),
  create: (data) => POST(`/run/create`, data),
  update: (id, data) => POST(`/run/update/${id}`, data),
  addMember: (id, memberId) => POST(`/run/add-member/${id}/${memberId}`),
  removeMember: (id, memberId) => POST(`/run/remove-member/${id}/${memberId}`),
  delete: (id) => POST(`/run/delete/${id}`),
}

export const sync = {
  all: (after) => POST('/sync/all', { after }),
}


function fetchAPI(url, params, options = {}) {
  const { method = 'get', ...other } = options

  let finalURL = process.env.PUBLIC_URL + '/api' + url
  let data

  if (method === 'post' && params)
    data = params

  if (method === 'get' && params)
    finalURL += `?${queryString(params)}`

  const config = {
    method: method,
    url: finalURL,
    data: data,
    ...other
  }

  return axios(config).then(({ data }) => {
    if (data.ok)
      return Promise.resolve(data.data)
    return Promise.reject(createError(data))
  })
}

function GET(url, params, options = {})  { return fetchAPI(url, params, { method: 'get', ...options }) }
function POST(url, params, options = {}) { return fetchAPI(url, params, { method: 'post', ...options }) }

function createError(data) {
  const e = new Error(data.message)
  e.type  = data.type
  e.stack = data.stack
  e.fromServer = true
  return e
}

function form(params) {
  const formData = new FormData()
  Object.keys(params).forEach(key => {
    const value = params[key]
    formData.append(key, value)
  })
  return formData
}

