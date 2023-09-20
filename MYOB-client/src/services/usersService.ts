import axios from "axios";
import User from "../interfaces/User";
import jwt_decode from "jwt-decode";
// import _ from "lodash";

let api: string = `${process.env.REACT_APP_API}/users`;

// get token details from local storage.
export function getTokenDetailes() {
  let token = JSON.parse(sessionStorage.getItem("token") as string).token;
  return jwt_decode(token)
}

// Get all Users
export function getAllUsers() {
  return axios.get(`${api}`, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}

//User signIn
export function userValidation(userTocheck: any) {
  return axios.post(`${api}/signin`, userTocheck);
}
//Get user after google signIn
export function getGoogleUser() {
  return axios.get(`${process.env.REACT_APP_API}/google-auth/login/success`, { withCredentials: true });
}
//Google signOut
export function getGooglSignOut() {
  return axios.get(`${process.env.REACT_APP_API}/google-auth/logout`);
}

//User Sign-up
export function addUser(newUser: User) {
  return axios.post(`${api}`, newUser);
}

//Get user details
export function getUserProfile() {
  return axios.get(`${api}/profile`, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
}
//Get user details by _id
export function getUserById(userId: string) {
  return axios.get(`${api}/${userId} `, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
}

// User Update
export function updateUser(updatedUser: User, userId: string) {
  return axios.put(`${api}/${userId}`, updatedUser, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
}

// Delete User
export function deleteUserById(userId: string) {
  return axios.delete(`${api}/${userId}`, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
}

// Update user properity (supports ALL Properties but password)
export async function updateUserProps(userId: string, propName: any, newValue: any) {
  try {
    const propsObject: Record<string, any> = {
      [propName]: newValue
    };

    return axios.patch(`${api}/${userId}`, propsObject, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}


