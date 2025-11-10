/* -----------------------------------------------------------------
File: frontend/src/api/scorecardApi.js
Purpose: a small API wrapper (adjust base URL as needed)
----------------------------------------------------------------- */
import axios from 'axios'


const api = axios.create({
baseURL: (import.meta.env.VITE_API_URL) || ''
})


export async function computeScore(payload){
const res = await api.post('/scorecard/', payload)
return res.data
}