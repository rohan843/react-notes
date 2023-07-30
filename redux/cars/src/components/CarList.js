import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { removeCar } from "../store";

function CarList() {
  const dispatch = useDispatch();
  const selectData = (state) => state.cars.data;
  const selectSearchTerm = (state) => state.cars.searchTerm;
  const selectForm = (state) => state.form;
  const memoizedSelection = createSelector(
    [selectData, selectSearchTerm, selectForm],
    (data, searchTerm, form) => {
      const filteredCars = data.filter((car) =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { cars: filteredCars, name: form.name };
    }
  );
  const { cars, name } = useSelector((state) => {
    return memoizedSelection(state);
  });

  const handleCarDelete = (car) => {
    dispatch(removeCar(car.id));
  };

  const renderedCars = cars.map((car) => {
    const bold = name && car.name.toLowerCase().includes(name.toLowerCase());
    return (
      <div key={car.id} className={`panel ${bold && "bold"}`}>
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
