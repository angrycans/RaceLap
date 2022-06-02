/* eslint-disable prettier/prettier */
import { createStore } from "sim-redux";

const logger = (store) => (next) => (action) => {
  console.log("current state", store.getState());
  return next(action);
};

export interface IState {

  serverfiles: [string, number][],
  localfiles: { name: string, size: number, ctime?: Date, mtime?: Date, path?: string, isserver?: number, progress?: number, dtime?: Date }[],
  tabIndx: number;

}

const defalutStates = {

  serverfiles: [],
  localfiles: [],
  tabIndex: 0

};

const store = createStore(defalutStates, [logger]);

export { store, defalutStates };
