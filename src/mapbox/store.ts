/* eslint-disable prettier/prettier */
import { createStore } from "sim-redux";
import { GPSPOSTION } from "../libs";

const logger = (store) => (next) => (action) => {
  console.log("current state", store.getState());
  return next(action);
};

export interface IState {
  title: "hello",
  files: [string, number],
  view: {
    actionsheet: { isopen: boolean }
  },
  txt: string[],
  finishline: {
    type: string,
    geometry: {
      type: string,
      coordinates: [
        [number, number],

      ],
    }
  }
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
  //files: [],
  txt: [],
  view: {
    actionsheet: { isopen: true }
  },
  finishline: {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [],
    }
  },
  geojosn: {
    type: 'Feature',
    properties: { 'color': '#F7455D' },
    geometry: {
      type: 'LineString',
      coordinates: [],
    }
  }
};

const store = createStore(defalutStates, [logger]);

export { store, defalutStates };
