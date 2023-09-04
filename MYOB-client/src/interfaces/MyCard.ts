import Card from "./Card";

export default interface MyCard {
  id?: string;
  userId: string;
  products: Card[];
  isActive: boolean;
}
