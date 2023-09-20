import axios from "axios";
import Card from "../interfaces/Card";

let api: string = `${process.env.REACT_APP_API}/cards`;

export function getCards() {
  return axios.get(api);
}

export function getCardById(_id: string) {
  return axios.get(`${api}/${_id}`);
}

export function getCardsByOwner() {
  return axios.get(`${api}/my-cards`, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
}

export function addNewCard(newCard: Card) {
  return axios.post(api, newCard, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
}

export function updateCard(updatedCard: Card, _id: string) {
  return axios.put(`${api}/${_id}`, updatedCard, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
}

export function deleteCard(_id: string) {
  return axios.delete(`${api}/${_id}`, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
}

// Update card properity 
export async function updateCardProps(cardId: string, propName: any, newValue: any) {
  try {
    const propsObject: Record<string, any> = {
      [propName]: newValue
    };
    return axios.patch(`${api}/${cardId}`, propsObject, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}