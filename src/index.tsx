import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  initialize,
  createActions,
  createEpic,
  createReducer,
  useModule,
  useActions,
  useMappedState
} from "typeless";

const MODULE = "counter";

const CounterActions = createActions(MODULE, {
  increment: (count: number) => ({ payload: { count } }),
  decrement: (count: number) => ({ payload: { count: -count } })
});

interface CounterState {
  count: number;
}

declare module "typeless/types" {
  interface DefaultState {
    counter: CounterState;
  }
}

const epic = createEpic(MODULE);

const initialState: CounterState = {
  count: 0
};

const reducer = createReducer(initialState)
  .on(CounterActions.increment, (state, { count }) => {
    state.count += count;
  })
  .on(CounterActions.decrement, (state, { count }) => {
    if (state.count + count >= 0) state.count += count;
  });

function CounterModule() {
  useModule({
    epic,
    reducer,
    reducerPath: ["counter"]
  });
  return <Counter />;
}

function Counter() {
  const { increment, decrement } = useActions(CounterActions);
  const { count } = useMappedState(state => state.counter);

  return (
    <div>
      <button onClick={() => increment(1)}>Increment</button>
      <button onClick={() => decrement(1)}>Decrement</button>
      <div>Count: {count}</div>
    </div>
  );
}

const { TypelessProvider } = initialize();

ReactDOM.render(
  <TypelessProvider>
    <CounterModule />
  </TypelessProvider>,
  document.getElementById("app")
);
