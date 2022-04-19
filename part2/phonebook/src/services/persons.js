import axios from "axios";
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const req = axios.get(baseUrl)
    return req.then(res => res.data)
}

const create = (resource) => {
    const req = axios.post(baseUrl, resource)
    return req.then(res => res.data)
}

const remove = (id, resource) => {
    const req = axios.delete(`${baseUrl}/${id}`, resource)
    return req.then(res => res.data)
}

const update = (id, newObject) => {
    const req = axios.delete(`${baseUrl}/${id}`, newObject)
    return req.then(res => res.data)
}

export default {
    getAll: getAll,
    create: create,
    remove: remove,
    update: update
}