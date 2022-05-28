import { IStore } from "sim-redux";
import { IState } from "./store";
import { produce } from "immer";


import { IP } from "../libs";

const listActor = (store: IStore<IState>) => ({

  /** 初始化一条todo */
  init: async () => {
    console.log("actor init");
    return new Promise((r) => {


      setTimeout(() => {
        const newState = produce(store.getState(), (draft) => {

          draft.geojosn.geometry.coordinates.splice(0, draft.geojosn.geometry.coordinates.length);
          draft.txt.forEach(d => {
            let pos = d.split(",")
            //console.log(pos)
            draft.geojosn.geometry.coordinates.push([parseFloat(pos[2]), parseFloat(pos[1])])
          })

        });

        r(newState);
      }, 0);
    });
  },
  /** get file list*/
  listfile: async () => {
    console.log("list init");
    const response = await fetch(
      IP + '/listsdjson'
    );
    const ret = await response.text();
    console.log("json", ret);

    // console.log("ret=", JSON.parse(json))
    const newState = produce(store.getState(), (draft) => {

      let d = ret.split(",");
      if (d[d.length - 1] == "") {
        d.pop();
      }
      draft.files = d;

    });
    return (newState);
  },
  /** get file list*/
  downfile: async (filename) => {
    console.log("list init");
    const response = await fetch(
      IP + '/down?file=' + filename
    );
    const ret = await response.text();
    // console.log("json", ret);

    // console.log("ret=", JSON.parse(json))
    const newState = produce(store.getState(), (draft) => {

      let d = ret.split("\r\n");
      if (d[d.length - 1] == "") {
        d.pop();
      }
      draft.txt = d;

    });
    return (newState);
  },

});

export { listActor };

export type IlistActor = typeof listActor;

