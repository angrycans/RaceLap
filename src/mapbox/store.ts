import { createStore } from "sim-redux";
import { GPSPOSTION } from "../libs";

const logger = (store) => (next) => (action) => {
  console.log("current state", store.getState());
  return next(action);
};

export interface ITodo {
  id: number;
  text: string;
  done: boolean;

}

export interface IState {
  title: "hello",
  geojosn: {
    type: string,
    geometry: {
      type: string,
      coordinates: [
        [number, number],

      ],
    }
  };
}

const defalutStates = {
  title: "hello",
  geojosn: {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [-77.044211, 38.852924],
        [-77.045659, 38.860158],
        [-77.044232, 38.862326],
        [-77.040879, 38.865454],
        [-77.039936, 38.867698],
        [-77.040338, 38.86943],
        [-77.04264, 38.872528],
        [-77.03696, 38.878424],
        [-77.032309, 38.87937],
        [-77.030056, 38.880945],
        [-77.027645, 38.881779],
        [-77.026946, 38.882645],
        [-77.026942, 38.885502],
        [-77.028054, 38.887449],
        [-77.02806, 38.892088],
        [-77.03364, 38.892108],
        [-77.033643, 38.899926],
      ],
    }
  }
};

const store = createStore(defalutStates, [logger]);

export { store, defalutStates };
