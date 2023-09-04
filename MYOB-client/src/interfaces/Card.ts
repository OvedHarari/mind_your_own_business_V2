export default interface Card {
  _id?: string;
  owner?: string;
  title: string;
  subtitle?: string;
  description: string;
  phone: string;
  email: string;
  webSite: string;
  businessImage: {
    url?: string;
    alt?: string;
  };
  address: {
    country: string;
    state?: string;
    city: string;
    street: string;
    houseNumber: string;
    zipcode: string;
    lat?: number;
    lng?: number;
  }
}
