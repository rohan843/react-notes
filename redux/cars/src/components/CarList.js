import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { removeCar } from "../store";

function CarList() {
  const dispatch = useDispatch();
  const selectData = (state) => state.cars.data;
  const selectSearchTerm = (state) => state.cars.searchTerm;
  const memoizedFiltering = createSelector(
    [selectData, selectSearchTerm],
    (data, searchTerm) => {
      return data.filter((car) =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  );
  const cars = useSelector((state) => {
    return memoizedFiltering(state);
  });

  const handleCarDelete = (car) => {
    dispatch(removeCar(car.id));
  };

  const renderedCars = cars.map((car) => {
    return (
      <div key={car.id} className="panel">
        <p>
          {car.name} - ${car.cost}
        </p>
        <button
          className="button is-danger"
          onClick={() => handleCarDelete(car)}
        >
          Delete
        </button>
      </div>
    );
  });

  return (
    <div className="car-list">
      {renderedCars}
      <hr />
    </div>
  );
}

export default CarList;
