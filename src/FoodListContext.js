import React, { createContext, useContext, useState, useCallback } from 'react';
import { getFoodInfo, deleteExpiredEntries } from './firebaseUtils';

const FoodListContext = createContext();

export const useFoodList = () => {
  return useContext(FoodListContext);
};

export const FoodListProvider = ({ children }) => {
  const [foodItems, setFoodItems] = useState([]);

  const fetchFoodItems = useCallback(async () => {
    await deleteExpiredEntries(); // Clean up expired entries
    const foodData = await getFoodInfo();
    if (foodData) {
      const foodArray = Object.keys(foodData).map((key) => ({
        foodId: key,
        ...foodData[key],
      }));
      setFoodItems(foodArray);
    }
  }, []);

  return (
    <FoodListContext.Provider value={{ foodItems, setFoodItems, fetchFoodItems }}>
      {children}
    </FoodListContext.Provider>
  );
};
