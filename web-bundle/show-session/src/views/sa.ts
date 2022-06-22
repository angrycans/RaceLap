function sessionTxtFromSa(_sessionTxt) {
  //`31.934460,118.986024,0,0,0,0,38,-80,9,1,0
  //20220612091229060,31.93409900,118.98616917,36.80,36.13,235.73,4088318
  let sessionTxt;

  if (_sessionTxt.indexOf("\r\n") > 0) {
    sessionTxt = _sessionTxt.split("\r\n");
  } else {
    sessionTxt = _sessionTxt.split("\n");
  }

  if (sessionTxt[sessionTxt.length - 1] === "") {
    sessionTxt.pop();
  };

  let ret = "";
  let last = 0;
  for (let idx = 0; idx < sessionTxt.length; idx++) {
    let item = sessionTxt[idx].split(",");

    ret += (`20220612091229060,${item[0]}, ${item[1]},0,${(+item[6] * 1.609344).toFixed(3)},0,${last}\r\n`);

    //last += +item[8] * 10;
    last += 100;

  }

  //console.log("ret", ret);


  return ret;
}

function finishTxtFromSa(txt) {

}

export {
  sessionTxtFromSa,
  finishTxtFromSa
}