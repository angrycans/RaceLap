/* eslint-disable prettier/prettier */
import { createStore } from "sim-redux";
import { GPSPOSTION } from "../libs";

const logger = (store) => (next) => (action) => {
  console.log("current state", store.getState());
  return next(action);
};

export interface IState {
  title: "hello",
  files: string[],
  txt: string[],
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
  files: [],
  txt: [],
  geojosn: {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [-77.044211, 38.852924],

      ],
    }
  }
};

const store = createStore(defalutStates, [logger]);

export { store, defalutStates };
