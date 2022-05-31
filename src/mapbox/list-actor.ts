import { IStore } from "sim-redux";
import { IState } from "./store";
import { produce } from "immer";
import moment from "moment";

import { IP, segmentsIntersect, isFinishLinePassed } from "../libs";

const listActor = (store: IStore<IState>) => ({

  /** 初始化一条todo */
  init: async () => {
    console.log("actor init");
    return new Promise((r) => {

      const newState = produce(store.getState(), (draft) => {
        draft.geojosn.geometry.coordinates = [];

        console.log("draft.txt.length=", draft.txt.length);
        if (draft.txt.length == 0) {
          let d = data.split("\n");
          //console.log("d=", d);
          if (d[d.length - 1] == "") {
            d.pop();
          }
          draft.txt = d;
        }

        // console.log("draft.txt ", draft.txt)
        let cfg = { "lat1": "32.1053905", "lng1": "118.863382", "lat2": "32.105466", "lng2": "118.8633663", "trackname": "" };
        if (draft.finishline.geometry.coordinates.length == 0) {
          // {"lat1":"32.1053905","lng1":"118.863382","lat2":"32.105466","lng2":"118.8633663","trackname":""}
          draft.finishline.geometry.coordinates.push([parseFloat(cfg.lng1), parseFloat(cfg.lat1)]);
          draft.finishline.geometry.coordinates.push([parseFloat(cfg.lng2), parseFloat(cfg.lat2)]);
        }


        draft.txt.forEach(d => {
          let pos = d.split(",")
          //console.log(pos)
          draft.geojosn.geometry.coordinates.push([parseFloat(pos[2]), parseFloat(pos[1])])
        })

      });

      r(newState);

    });
  },
  lapcomputer: async () => {
    console.log("actor lapcomputer");
    return new Promise((r) => {
      const newState = produce(store.getState(), (draft) => {


        let prev = null;
        let lastdatetime = 0;
        let cfg = { "lat1": 32.1053905, "lng1": 118.863382, "lat2": 32.105466, "lng2": 118.8633663, "trackname": "" };

        store.getState().txt.forEach((item) => {
          //console.log("item1", item);
          let pos = item.split(",");
          // console.log(pos)
          // draft.geojosn.geometry.coordinates.push([parseFloat(pos[2]), parseFloat(pos[1])])
          if (prev) {
            let isChecked = segmentsIntersect(parseFloat(pos[1]), parseFloat(pos[2]), parseFloat(prev[1]), parseFloat(prev[2]), cfg.lat1, cfg.lng1, cfg.lat2, cfg.lng2);
            if (isChecked) {
              console.log("isChecked ", pos, prev);

              if (lastdatetime != 0) {
                console.log("laptimer ", moment(pos[0], 'YYYY-MM-DDHH:mm:ss.SSS') - moment(lastdatetime, 'YYYY-MM-DDHH:mm:ss.SSS'));

              }
              lastdatetime = pos[0];
            }

            let isChecked2 = isFinishLinePassed({ lat: parseFloat(pos[1]), lng: parseFloat(pos[2]) }, { lat: parseFloat(prev[1]), lng: parseFloat(prev[2]) }, { lat: cfg.lat1, lng: cfg.lng1 }, { lat: cfg.lat2, lng: cfg.lng2 });
            if (isChecked2 != 0) {
              console.log("ischecked2 ", pos, isChecked2)
            }


          }

          prev = pos;
          // prevlat = parseFloat(pos[1]);
          // prevlng = parseFloat(pos[2]);

        })


      });

      r(newState);

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

  /** get file list*/
  getMcuCfg: async () => {
    console.log("getMcuCfg init");
    const response = await fetch(
      IP + '/getmcucfg'
    );
    const ret = await response.json();
    console.log("json", ret);

    // console.log("ret=", JSON.parse(json))
    const newState = produce(store.getState(), (draft) => {
      draft.finishline.geometry.coordinates = [];
      if (ret.e.code > 0) {
        draft.finishline.geometry.coordinates.push([parseFloat(ret.data.lng1), parseFloat(ret.data.lat1)]);
        draft.finishline.geometry.coordinates.push([parseFloat(ret.data.lng2), parseFloat(ret.data.lat2)]);
      }

    });
    return (newState);
  },

  changeActionSheet: async (b) => {

    const newState = produce(store.getState(), (draft) => {
      draft.view.actionsheet.isopen = b;

    });
    return (newState);
  },
});

export { listActor };

export type IlistActor = typeof listActor;

