import { useState } from "react";
import Table from "./Table";

function SortableTable(props) {
  const { config, data } = props;
  const [sortOrder, setSortOrder] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  const handleClick = (label) => {
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

  const updatedConfig = config.map((column) => {
    if (!column.sortValue) return column;
    return {
      ...column,
      header: () => (
        <th onClick={() => handleClick(column.label)}>{column.label}</th>
      ),
    };
  });

  let sortedData = data;
  if (sortOrder && sortBy) {
    const { sortValue } = config.find((column) => column.label === sortBy);
    sortedData = [...data];
    sortedData.sort((a, b) => {
      const valA = sortValue(a);
      const valB = sortValue(b);
      const reverseOrder = (sortOrder === 'asc' ? 1 : -1)
      if(typeof(valA) === "string") {
        return valA.localeCompare(valB) * reverseOrder;
      } else {
        return (valA - valB) * reverseOrder;
      }
    })
  }

  return (
    <div>
      {sortOrder} - {sortBy}
      <br />
      <Table {...props} config={updatedConfig} data={sortedData} />
    </div>
  );
}

export default SortableTable;
