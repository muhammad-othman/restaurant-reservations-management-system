import { ILoginFormType, IRestaurant, ISignUpFormType, ITable, IUser } from "../types";
import { authAxios, axios } from "./axiosConfig";


export const login = async (data: ILoginFormType): Promise<{ token: string, user: IUser }> => {
    return axios
        .post('auth/login', data)
        .then(response => response.data)
};

export const signUp = async (data: ISignUpFormType): Promise<{ token: string, user: IUser }> => {
    return axios
        .post('auth/signup', data)
        .then(response => response.data)
};

export const createRestaurant = async (name: string): Promise<IRestaurant> => {
    return authAxios
        .post('restaurant', { name })
        .then(response => response.data)
};

export const getRestaurant = async (): Promise<IRestaurant> => {
    return authAxios
        .get('restaurant')
        .then(response => response.data)
};

export const updateTable = async (table: ITable): Promise<ITable> => {
    return authAxios
        .put(`tables/${table._id}`, table)
        .then(response => response.data)
};
