export interface IReservation {
  _id: string;
  date?: Date;
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  table: string;
}

export interface ITable {
  _id: string;
  index: number;
  referenceNumber: number;
  seats: number;
  restaurant: IRestaurant;
  reservations: Array<IReservation>;
}


export interface IRestaurant {
  _id: string;
  name: string;
  tables: Array<ITable>;
  manager: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  restaurant: string;
}

export interface ILoginFormType {
  email: string;
  password: string;
}

export interface ISignUpFormType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
