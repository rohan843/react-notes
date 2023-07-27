import { produce } from "immer";
import { useReducer } from "react";
import Button from "../components/Button";
import Panel from "../components/Panel";

const INCREMENT = "increment";
const DECREMENT = "decrement";
const UPDATE_VALUE = "update-value";
const UPDATE_COUNT_WITH_VALUE = "update-count";

const reducer = (state, action) => {
  switch (action.type) {
    case INCREMENT:
      state.count += 1;
      break;
    case DECREMENT:
      state.count -= 1;
      break;
    case UPDATE_COUNT_WITH_VALUE:
      state.count += state.valueToAdd;
      state.valueToAdd = 0;
      break;
    case UPDATE_VALUE:
      state.valueToAdd = action.payload;
      break;
    default:
      break;
  }
};

function CounterPage({ initialCount }) {
  const [state, dispatch] = useReducer(produce(reducer), {
    count: initialCount,
    valueToAdd: 0,
  });

  const increment = () => {
    dispatch({
      type: INCREMENT,
    });
  };

  const decrement = () => {
    dispatch({
      type: DECREMENT,
    });
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    dispatch({
      type: UPDATE_VALUE,
      payload: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: UPDATE_COUNT_WITH_VALUE,
    });
  };

  return (
    <Panel className="m-3">
      <h1 className="text-lg">{state.count}</h1>
      <div className="flex flex-row">
        <Button outline onClick={increment}>
          Increment
        </Button>
        <Button outline onClick={decrement}>
          Decrement
        </Button>
      </div>
      <form onSubmit={handleSubmit}>
        <label>Add a lot!</label>
        <input
          type="number"
          className="p-1 m-3 bg-gray-50 border border-gray-300"
          value={state.valueToAdd || ""}
          onChange={handleChange}
        />
        <Button outline>Add it!</Button>
      </form>
    </Panel>
  );
}

export default CounterPage;
