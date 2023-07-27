import Table from "./Table";
import { GoArrowSmallDown, GoArrowSmallUp } from "react-icons/go";
import useSort from "../hooks/use-sort";

function SortableTable(props) {
  const { config, data } = props;
  const { sortBy, sortOrder, setSortLabel, sortedData } = useSort(data, config);
  
  const updatedConfig = config.map((column) => {
    if (!column.sortValue) return column;
    return {
      ...column,
      header: () => (
        <th
        className="cursor-pointer hover:bg-gray-200"
        onClick={() => setSortLabel(column.label)}
        >
          <div className="flex items-center">
            {getIcons(column.label, sortBy, sortOrder)}
            {column.label}
          </div>
        </th>
      ),
    };
  });
  
  
  return <Table {...props} config={updatedConfig} data={sortedData} />;
}

function getIcons(label, sortBy, sortOrder) {
  if (label !== sortBy || sortOrder === null) {
    return (
      <div>
        <GoArrowSmallUp />
        <GoArrowSmallDown />
      </div>
    );
  } else if (sortOrder === "asc") {
    return (
      <div>
        <GoArrowSmallUp />
      </div>
    );
  } else if (sortOrder === "desc") {
    return (
      <div>
        <GoArrowSmallDown />
      </div>
    );
  }
}

export default SortableTable;
