import Accordion from "../components/Accordion";

function AccordionPage() {
  const items = [
    {
      id: 1,
      label: "asdf",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur facilis deserunt laboriosam! Et eum accusamus optio alias doloribus nam repellat ad voluptatum asperiores amet! Veniam ipsum sed velit dolorem ex.",
    },
    {
      id: 2,
      label: "fsfvfsa",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur facilis deserunt laboriosam! Et eum accusamus optio alias doloribus nam repellat ad voluptatum asperiores amet! Veniam ipsum sed velit dolorem ex.",
    },
    {
      id: 3,
      label: "qwrr",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur facilis deserunt laboriosam! Et eum accusamus optio alias doloribus nam repellat ad voluptatum asperiores amet! Veniam ipsum sed velit dolorem ex.",
    },
  ];

  return <Accordion items={items} />;
}

export default AccordionPage;
