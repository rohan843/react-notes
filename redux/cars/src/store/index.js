import { configureStore } from "@reduxjs/toolkit";
import {
  carsReducer,
  changeSearchTerm,
  addCar,
  removeCar,
} from "./slices/carsSlice";
import { changeCost, changeName, formReducer } from "./slices/formSlice";

const store = configureStore({
  reducer: {
    form: formReducer,
    cars: carsReducer,
  },
});

export { store, changeSearchTerm, addCar, removeCar, changeCost, changeName };
