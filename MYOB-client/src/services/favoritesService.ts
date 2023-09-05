import axios from "axios";

let api: string = `${process.env.REACT_APP_API}/favorites`;


// get all user's favorits cards
export function getFavorites(userId: string) {
  return axios.get(`${api}/${userId}`, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}

// add or remove user's favorits 
export function addRemoveFavorites(cardToAdd: string) {
  const cardId = { _id: cardToAdd }
  return axios.post(api, cardId, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}
