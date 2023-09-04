import Card from "./Card";

export default interface Favorite {
  id?: string;
  userId: string;
  cards: Card[];
}
