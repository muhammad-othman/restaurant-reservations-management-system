import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { IRestaurant } from '../types';
import { getRestaurant } from '../utils/api';
import AuthContext from './AuthContext';
import LoadingContext from './LoadingContext';



type RestaurantProviderProps = {
  userRestaurant: IRestaurant;
  setUserRestaurant: Dispatch<SetStateAction<IRestaurant>>;
};

const RestaurantContext = createContext<RestaurantProviderProps>(null as any);

export const RestaurantProvider: React.FC = ({ children }) => {
  const [userRestaurant, setUserRestaurant] = useState<IRestaurant>();
  const { currentUser } = useContext(AuthContext);
  const { stopLoading, startLoading } = useContext(LoadingContext);


  useEffect(() => {
    if (!currentUser) {
      setUserRestaurant(null);
      return;
    }

    if (!currentUser.restaurant || userRestaurant) return;

    startLoading();
    getRestaurant().then(r => {
      if (r)
        setUserRestaurant(r);
      stopLoading();
    }).catch(() => {
      stopLoading();
    });

  }, [currentUser, userRestaurant, startLoading, stopLoading]);




  return (
    <RestaurantContext.Provider
      value={{
        userRestaurant,
        setUserRestaurant,
      }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export default RestaurantContext;
