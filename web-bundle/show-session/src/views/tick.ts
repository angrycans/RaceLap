import * as turf from '@turf/turf'

function tick(_sessionData, _lapIdx, _trackJosn, _route, _map, _marker, _popup, _panto = true) {

  let aniIdx = 0;
  let start = 0;
  let aniIdx_session;
  let lapStartTime = 0;
  let lapEndTime = 0;
  // let difflngLat = {};
  let difftime = 0;
  let lasttime = 0;
  let pause = false;


  function frame(time: number) {

    let usepause = false;
    if (start == 0) {
      start = time;
      if (!lapStartTime) {
        lapStartTime = time;
        console.log("lapStartTime", lapStartTime.toFixed())
        console.log(_sessionData, _lapIdx, _trackJosn, _route);
      }
      start -= lasttime == 0 ? 17 : time - lasttime; //因为每次开始点都从路由的第一个点开始,而每次点都在开始位置,所以跳过一帧.
    }

    aniIdx_session = _trackJosn.lap[_lapIdx].prv + aniIdx;
    let pinRoute = [];
    let animationDuration: number;
    if (difftime > 0) {
      // pinRoute = [[difflngLat.lng, difflngLat.lat], coords[aniIdx + 1]];
      pinRoute = [_route[aniIdx], _route[aniIdx + 1]];
      animationDuration = +_sessionData[aniIdx_session][8] - difftime;
    } else {
      pinRoute = [_route[aniIdx], _route[aniIdx + 1]];
      animationDuration = +_sessionData[aniIdx_session][8];
      // console.log("diff2", diff2, sessionData[aniIdx_session][8], animationDuration.toFixed())
    }

    // pinRoute = [coords[aniIdx], coords[aniIdx + 1]];
    //animationDuration = sessionData[aniIdx_session][8] + diff2;//4090528 - 4090328;
    let path = turf.lineString(pinRoute);
    let pathDistance = turf.lineDistance(path);


    let animationPhase = (time - start) / animationDuration;

    let diff = (time - start) - animationDuration;
    //console.log("timer", aniIdx, coords.length, start.toFixed(), time, sessionData[aniIdx_session][8], animationDuration.toFixed(), animationPhase.toFixed(2), (time - start).toFixed(), difftime, time.toFixed());
    //console.log("timer", start.toFixed(), time.toFixed(), _sessionData[aniIdx_session][8], animationDuration.toFixed(), animationPhase.toFixed(2), (time - start).toFixed(), difftime, time.toFixed(), (lasttime == 0 ? 17 : time - lasttime).toFixed());
    lasttime = time;

    if (diff >= 0) {
      difftime = diff;
      animationPhase = 1;

      // difflngLat = marker.getLngLat();

      //console.log("point route end to next", aniIdx, _sessionData[aniIdx_session][8], _sessionData[aniIdx_session + 1][6] - _sessionData[_trackJosn.lap[_lapIdx].prv][6], (time - start).toFixed(), diff, (time - lapStartTime).toFixed());
      //console.log("point ", _sessionData[aniIdx_session]);
      //console.log("point ", _sessionData[aniIdx_session + 1]);

      aniIdx++;
      start = 0;
      //window.requestAnimationFrame(frame);
      //return;

      if (aniIdx === _route.length - 1) {
        // window.requestAnimationFrame(frame);
        //console.log("aniIdx > coords.length", aniIdx, _route.length)
        lapEndTime = time;
        aniIdx = 0;
        //console.log("endtime", _sessionData[_trackJosn.lap[_lapIdx].idx][6] - _sessionData[_trackJosn.lap[_lapIdx].prv][6], lapEndTime - lapStartTime)
        //console.log("performance", performance.now() - stime)
        return;
      }
      if (pause) {
        console.log("start pause")
        usepause = true;
      }

    } else {
      // difftime = 0;
    }

    // Get the new latitude and longitude by sampling along the path
    const alongPath = turf.along(path, pathDistance * animationPhase)
      .geometry.coordinates;
    const lngLat = {
      lng: alongPath[0],
      lat: alongPath[1]
    };

    //console.log(alongPath);
    // Update the popup altitude value and marker location
    _popup.setHTML(_sessionData[aniIdx_session][4] + ' ' + _sessionData[aniIdx_session][7]);
    _marker.setLngLat(lngLat);
    _panto && _map.panTo(lngLat, { animate: true, duration: 10 });
    //_panto && _map.jumpTo(lngLat);
    //_map.jumpTo(lngLat);

    // _setTrackSession(draft => {
    //   draft.actPoint = alongPath;
    //   draft.actPointIdx = aniIdx_session;
    // })


    if (!usepause) {
      requestAnimationFrame(frame);
    }

  }

  return {
    play: () => {

      if (aniIdx !== 0 && !pause) {
        console.log("tick is runing")
        return;
      }
      pause = false;
      start = 0;
      lasttime = 0;
      // aniIdx = 0;
      requestAnimationFrame(frame)
    },
    pause: () => {
      pause = true;
      console.log("tick pause", aniIdx)
    },
    resume: () => {
      // pause = false;
      // start = 0;
      // lasttime = 0;
      // window.requestAnimationFrame(frame)
    }
  }

}


export {
  tick
}
