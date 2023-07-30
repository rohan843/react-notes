import { useSelector } from "react-redux";

function CarValue() {
  const totalCost = useSelector(({ cars: { data, searchTerm } }) => {
    const filteredCars = data.filter((car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filteredCars.reduce((acc, car) => acc + car.cost, 0);
  });
  return <div className="car-value">Total Cost: ${totalCost}</div>;
}

export default CarValue;
