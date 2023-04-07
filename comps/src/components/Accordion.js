import { useState } from "react";
import { GoChevronDown, GoChevronLeft } from "react-icons/go";

function Accordion({ items }) {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const renderedItems = items.map((item, index) => {
    const isExpanded = index === expandedIndex;

    const icon = (
      <span className="text-xl">{isExpanded ? <GoChevronDown /> : <GoChevronLeft />}</span>
    );

    return (
      <div key={item.id}>
        <div
          className="flex p-3 bg-gray-50 border-b items-center cursor-pointer justify-between"
          onClick={() => {
            setExpandedIndex((current) => {
              return (current === index) ? -1 : index;
            });
          }}
        >
          {item.label}
          {icon}
        </div>
        {isExpanded && <div className="border-b p-5">{item.content}</div>}
      </div>
    );
  });
  return <div className="border-x border-b rounded">{renderedItems}</div>;
}

export default Accordion;
