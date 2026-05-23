import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_BASE_URL

console.log('VITE_API_BASE_URL:', apiUrl)

export default axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})