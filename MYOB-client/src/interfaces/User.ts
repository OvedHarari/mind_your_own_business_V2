export default interface User {
  _id?: string;
  name: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
  };
  phone?: string;
  email: string;
  password?: string;
  image: {
    url?: string;
    alt?: string;
  }
  gender?: string;
  role?: string;
  address: {
    country?: string;
    state?: string;
    city?: string;
    street?: string;
    houseNumber?: string;
    zipcode?: string;
  };
  isActive?: boolean;
}
