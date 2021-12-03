import { ITable } from "../types";

export const generateGridArray = (tables: Array<ITable>, size: number = 150): Array<ITable> => {
  const array: Array<ITable> = [];
  for (let i = 0; i < size; i++) {
    array.push(tables.find(e => e.index === i));
  }
  return array;
};

export const getDateString = (date: Date) => {
  const dateString = date.toLocaleString();
  return `${dateString.split(':')[0]} ${dateString.slice(dateString.length - 2)}`;
}