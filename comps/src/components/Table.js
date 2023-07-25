import { Fragment } from "react";

function Table({ data, config, keyFn }) {
  const renderedColumns = config.map((column) => {
    if (column.header) {
      return <Fragment key={column.label}>{column.header()}</Fragment>;
    }
    return <th key={column.label}>{column.label}</th>;
  });

  const renderedRows = data.map((val) => {
    const renderedData = config.map((column) => {
      return (
        <td className="p-2" key={column.label}>
          {column.render(val)}
        </td>
      );
    });
    return (
      <tr className="border-b" key={keyFn(val)}>
        {renderedData}
      </tr>
    );
  });
  return (
    <table className="table-auto border-spacing-2">
      <thead>
        <tr className="border-b-2">{renderedColumns}</tr>
      </thead>
      <tbody>{renderedRows}</tbody>
    </table>
  );
}

export default Table;
