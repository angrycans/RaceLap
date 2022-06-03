import { IStore } from "sim-redux";
import { IState } from "./list-store";
import { produce } from "immer";
import moment from "moment";
import RNFS, { downloadFile, readDir } from "react-native-fs"

import { IP, segmentsIntersect, isFinishLinePassed, defaultRLDATAPath, msg } from "../libs";

function file_size(bytes: number) {
  let fsize: string = "";
  if (bytes < 1024)
    fsize = bytes + " B";
  else if (bytes < (1024 * 1024))
    fsize = bytes / 1024 + " KB";
  else if (bytes < (1024 * 1024 * 1024))
    fsize = bytes / 1024.0 / 1024.0 + " MB";
  else
    fsize = bytes / 1024.0 / 1024.0 / 1024.0 + " GB";
  return fsize;
}

const listActor = (store: IStore<IState>) => ({

  /** get file list*/
  listfile: async () => {
    console.log("list listfile");
    let ret;
    try {
      const response = await fetch(
        IP + '/listsdjson'
      );
      ret = await response.text();

      console.log("json", ret);
    } catch (e) {
      console.log("listfile err" + e);
      const newState = produce(store.getState(), (draft) => {


      });
      return (newState);
    }

    // console.log("ret=", JSON.parse(json))
    const newState = produce(store.getState(), (draft) => {

      let dret = ret.slice(0, -1);

      draft.serverfiles = dret.split(",").map(rowStr => {
        let pos = rowStr.lastIndexOf("_");
        //const col = rowStr.split("_");
        return [rowStr.substring(0, pos), +rowStr.substring(pos + 1, rowStr.length)]
      });


      console.log("draft.serverfiles", draft.serverfiles)
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

  /** getlocal file */
  getLocalFile: async () => {
    console.log("getLocalFile ...");

    const reader = await RNFS.readDir(defaultRLDATAPath);
    console.log("reader", reader);

    const newState = produce(store.getState(), (draft) => {
      draft.localfiles = [];
      draft.localfiles = reader.map(({ name, size, mtime, ctime, isDirectory, path }) => {
        //console.log(item);
        if (!isDirectory()) {
          return { name, mtime, ctime, path, size };
        }
      })

      console.log("draft.localfiles=>", draft.localfiles)

      if (store.getState()?.serverfiles) {
        for (let i = 0; i < store.getState()?.serverfiles.length; i++) {
          if ((store.getState()?.serverfiles[i][0] == "/RLDATA/track.txt") || (store.getState()?.serverfiles[i][0] == "/RLDATA/log.txt")) {
            //continue;
          }
          //console.log("store.getState()?.serverfiles[i]", i);
          let finditem = draft.localfiles.find((item) => {
            let name = store.getState()?.serverfiles[i][0];
            let size = store.getState()?.serverfiles[i][1];
            //console.log("l s name ", item.name, name.substring(name.lastIndexOf("/") + 1, name.length), item.size, size);
            return store.getState()?.serverfiles[i][0] == "/RLDATA/" + item.name && item.size == store.getState()?.serverfiles[i][1]

          });

          //console.log("finditem", finditem)
          if (!finditem) {
            draft.localfiles.push({
              name: store.getState().serverfiles[i][0],
              size: +store.getState().serverfiles[i][1],
              isserver: 1,
              progress: -1
            });
          }
        }
      }

      console.log("draft.localfiles2=>", draft.localfiles)


    });
    return (newState);
  },
  downLocalFilefromserver: async (item) => {
    console.log("getLocalFilefromserver ...");

    //for (let i = 0; i < store.getState().localfiles.length; i++) {

    // let name = store.getState().localfiles[i].name;
    let name = item.name;
    let realname = name.substring(name.lastIndexOf("/") + 1, name.length);

    console.log(realname);

    const options = {
      fromUrl: IP + "/down?file=" + name,
      toFile: defaultRLDATAPath + realname,
      background: true,
      begin: (res) => {
        //  console.log('begin', res);
        //console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
      },
      progress: (res) => {
        if (realname == "log.txt") {
          let pro = res.bytesWritten / res.contentLength;
          console.log("down progress " + pro);
        }
        // let pro = res.bytesWritten / res.contentLength;
        //  console.log("down progress " + pro);
      }
    };


    let ret = 0;
    let res =
      await RNFS.downloadFile(options).promise
        .then(() => {
          ret = 1;
        })
        .catch((err) => {
          console.log("downLocalFilefromserver", err.message);
          ret = 0;
        })


    console.log("downLocalFilefromserver end")
    const newState = produce(store.getState(), (draft) => {

      draft.localfiles.find(l => {

        if (l.name == name) {
          l.name = realname;
          l.progress = 100;
          l.isserver = 0;
        }
      })
    })

    return (newState);

    //  }

  },
  /**  changeTab */
  changeTab: async (b) => {
    console.log("changeTab ....");

    const newState = produce(store.getState(), (draft) => {

      draft.tabIndx = b;
    });
    return (newState);
  },
  /**  delfile */
  delfile: async (filename) => {
    console.log("delfile ....", filename);

    const response = await fetch(
      IP + '/del?file=' + filename
    );
    const ret = await response.json();

    console.log("ret", ret);
    // return;

    const newState = produce(store.getState(), (draft) => {

      //draft.tabIndx = b;
      if (ret.e.code == 1) {
        draft.serverfiles.splice(draft.serverfiles.findIndex(item => {
          console.log("item[0]", item[0])
          return item[0] == filename;
        }), 1)
      }


    });
    return (newState);
  },
  delfilefromlocal: async (file) => {
    console.log("delfilefromlocal ....", file.name);

    const filePath = defaultRLDATAPath + file.name;
    try {
      await RNFS.unlink(filePath)
    } catch (e) {
      console.error("delfilefromlocal", e);
      return store.getState();
    }
    const newState = produce(store.getState(), (draft) => {

      draft.localfiles.splice(draft.localfiles.findIndex(item => {
        return item.name == file.name;
      }), 1)

    });
    return (newState);
  }
});

export { listActor };

export type IlistActor = typeof listActor;


/*
 const options = {
            fromUrl: IP + "/down?file=" + item[0],
            toFile: defaultFSPath + "/" + item[0],
            background: true,
            begin: (res) => {
              console.log('begin', res);
              console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
            },
            progress: (res) => {

              let pro = res.bytesWritten / res.contentLength;
              console.log("down progress " + pro);

              // this.setState({
              //     progressNum: pro,
              // });
            }
          };
          try {
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {
              console.log('success', res);
            }).catch(err => {
              console.log('err', err);
            });
          }
*/
/*
    const options = {
      fromUrl: IP + "/down?file=/RLDATA/track.txt",
      toFile: defaultFSPath + "/RLDATA/track.txt",
      background: true,
      begin: (res) => {
        console.log('begin', res);
        console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
      },
      progress: (res) => {

        let pro = res.bytesWritten / res.contentLength;
        console.log("down progress " + pro);

        // this.setState({
        //     progressNum: pro,
        // });
      }
    };

    const ret = RNFS.downloadFile(options);
    ret.promise.then(res => {
      console.log('success', res);
    }).catch(err => {
      console.log('err', err);
    });

*/