import { useState } from "react";

function useSort(data, config) {
  const [sortOrder, setSortOrder] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  const setSortLabel = (label) => {
    if (label === sortBy) {
      if (sortOrder === null) {
        setSortOrder("asc");
        setSortBy(label);
      } else if (sortOrder === "asc") {
        setSortOrder("desc");
        setSortBy(label);
      } else if (sortOrder === "desc") {
        setSortOrder(null);
        setSortBy(null);
      }
    } else {
      setSortBy(label);
      setSortOrder("asc");
    }
  };

  let sortedData = data;
  if (sortOrder && sortBy) {
    const { sortValue } = config.find((column) => column.label === sortBy);
    sortedData = [...data];
    sortedData.sort((a, b) => {
      const valA = sortValue(a);
      const valB = sortValue(b);
      const reverseOrder = sortOrder === "asc" ? 1 : -1;
      if (typeof valA === "string") {
        return valA.localeCompare(valB) * reverseOrder;
      } else {
        return (valA - valB) * reverseOrder;
      }
    });
  }

  return { sortBy, sortOrder, setSortLabel, sortedData };
}

export default useSort;
