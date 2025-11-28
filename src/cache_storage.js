import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKS_KEY = "books_data";

export const saveBooks = async (booksArray) => {
  try {
    const jsonValue = JSON.stringify(booksArray);
    await AsyncStorage.setItem(BOOKS_KEY, jsonValue);
  } catch (e) {
    console.log("Error saving books:", e);
  }
};

export const getBooks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(BOOKS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log("Error reading books:", e);
    return [];
  }
};

export const clearBooks = async () => {
  try {
    await AsyncStorage.removeItem(BOOKS_KEY);
  } catch (e) {
    console.log("Error clearing books:", e);
  }
};
