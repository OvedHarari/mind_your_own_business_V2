import axios from "axios";
import User from "../interfaces/User";
import jwt_decode from "jwt-decode";
// import _ from "lodash";

let api: string = `${process.env.REACT_APP_API}/users`;

//login
export function userValidation(userTocheck: any) {
  return axios.post(`${api}/login`, userTocheck);
}

//Sign-up
export function addUser(newUser: User) {
  return axios.post(`${api}`, newUser);
}

//??????
export function getUserByEmail(userEmail: string) {
  return axios.post(`${api}`, userEmail);
}

//Get user details
export function getUserProfile() {
  return axios.get(`${api}/profile`, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
}
//Get user details by _id
export function getUserById(userId: string) {
  return axios.get(`${api}/${userId} `, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
}


export function updateUser(updatedUser: User, userId: string) {
  return axios.put(`${api}/${userId}`, updatedUser, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
}

export function getAllUsers() {
  return axios.get(`${api}`, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}

export function deleteUserById(userId: string) {
  return axios.delete(`${api}/${userId}`, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
}

// export async function activateUser(userId:string, isActive:boolean){
// try {
//     const response = await getUserById(userId as string);
//     const userToUpdate = response.data; 
//     const updatedUser = { ...userToUpdate, isActive };
//     await updateUser(_.pick(updatedUser, [ "name", "phone","email","image","gender","role","address","isActive"]), userId);
//     // await updateUser(_.pick(updatedUser, [ "firstName", "middleName", "lastName", "phone","email","userImgURL","gender","role","country","state","city","street","houseNumber","zipcode","isActive"]), userId);
//     return updatedUser;
//   } catch (error) {
//     console.error('Error updating user:', error);
//     return null;
//   }
// }
// export async function activateUser(userId:string, isActive:boolean){
// try {
//     const response = await getUserProfile();
//     const userToUpdate = response.data; 
//     const updatedUser = { ...userToUpdate, isActive };
//     await updateUser(updatedUser, userId);
//     return updatedUser;
//   } catch (error) {
//     console.error('Error updating user:', error);
//     return null;
//   }
// }

// export async function changeUserRole(userId:string, role:string){
// try {
//     const response = await getUserById(userId);
//     const userToUpdate = response.data; 
//     const updatedUser = { ...userToUpdate, role };
//   await updateUser(_.pick(updatedUser, ["name", "phone", "email", "image", "gender", "role", "address", "isActive"]), userId);
//     // await updateUser(_.pick(updatedUser, [ "firstName", "middleName", "lastName", "phone","email","userImgURL","gender","role","country","state","city","street","houseNumber","zipcode","isActive"]), userId);
//     return updatedUser;
//   } catch (error) {
//     console.error('Error updating user:', error);
//     return null;
//   }
// }

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

// get token details from local storage.
export function getTokenDetailes() {
  let token = JSON.parse(sessionStorage.getItem("token") as string).token;
  return jwt_decode(token)
}