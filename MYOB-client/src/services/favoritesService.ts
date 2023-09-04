import axios from "axios";
import Card from "../interfaces/Card";


let api: string = `${process.env.REACT_APP_API}/favorites`;

// create favorits object (to be used upon registration of new user)
// export function createFavoritsById(userId: string) {
//   return axios.post(api, { userId, cards: [] });
// }

// export function deleteFavoritsById(userId: string) {
//   return axios.delete(`${api}/${userId}`, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
// }

// get all user's favorits cards
export function getFavorites(userId: string) {
  return axios.get(`${api}/${userId}`, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}

// add to user's favorits 
// export async function addToFavorites(userId: string, cardToAdd: Card) {
//   try {
//     // 1. get user's favorits object
//     let res = await getFavorites(userId);
//     // 2. add the favorit card to favorits array
//     res.data[0].cards.push({ ...cardToAdd });
//     // 3. update the favorits object 
//     return axios.patch(`${api}/${res.data[0].userId}`, {
//       cards: res.data[0].cards,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

export function addToFavorites(cardToAdd: string) {
  const cardId = { _id: cardToAdd }
  return axios.post(api, cardId, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}



export async function removeFromFavorites(userId: string, cardId: string) {
  try {
    let res = await getFavorites(userId);
    res.data[0].cards = res.data[0].cards.filter((card: Card) => card._id !== cardId);
    return axios.patch(`${api}/${res.data[0].id}`, {
      cards: res.data[0].cards,
    });
  } catch (error) {
    console.log(error);
  }
}
