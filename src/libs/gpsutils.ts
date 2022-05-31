//Calculates if finish line was crossed
//https://github.com/rgmorales/MiniLapTimer/blob/master/LapTimerMini.ino

function segmentsIntersect(lat1: number, lon1: number, lat2: number, lon2: number, finishLineLat1: number, finishLineLon1: number, finishLineLat2: number, finishLineLon2: number) {
	// does line(p1, p2) intersect line(p3, p4)
	let fDeltaX = lat2 - lat1;
	let fDeltaY = lon2 - lon1;
	let da = finishLineLat2 - finishLineLat1;
	let db = finishLineLon2 - finishLineLon1;
	if ((da * fDeltaY - db * fDeltaX) == 0) {
		//The segments are parallel
		return false;

	}
	let s = (fDeltaX * (finishLineLon1 - lon1) + fDeltaY * (lat1 - finishLineLat1)) / (da * fDeltaY - db * fDeltaX);
	let t = (da * (lon1 - finishLineLon1) + db * (finishLineLat1 - lat1)) / (db * fDeltaX - da * fDeltaY);

	return (s >= 0) && (s <= 1) && (t >= 0) && (t <= 1);
}

class GpsPoint {
	lat: number;
	lng: number;
}

function isFinishLinePassed(start: GpsPoint, finish: GpsPoint, finishLinePoint1: GpsPoint, finishLinePoint2: GpsPoint) {


	// delta0 = (y4-y3)*(x2-x1) - (x4-x3)*(y2-y1)
	let delta0 = (finishLinePoint1.lat - finishLinePoint2.lat) * (finish.lng - start.lng) -
		(finishLinePoint1.lng - finishLinePoint2.lng) * (finish.lat - start.lat);



	if (delta0 == 0.0 || delta0 == -0.0) {
		//	console.log("delta==0");

		return 0;
	}

	// delta1 = (x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)
	let delta1 = (finishLinePoint1.lng - finishLinePoint2.lng) * (start.lat - finishLinePoint2.lat) -
		(finishLinePoint1.lat - finishLinePoint2.lat * (start.lng - finishLinePoint2.lng));


	// delta2 = (x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)
	let delta2 = (finish.lng - start.lng) * (start.lat - finishLinePoint2.lat) -
		(finish.lat - start.lat) * (start.lng - finishLinePoint2.lng);


	// ka = Delta1/Delta0
	let ka = delta1 / delta0;
	// kb = Delta2/Delta0
	let kb = delta2 / delta0;

	if (ka < 0 || ka > 1 || kb < 0 || kb > 1) {

		return 0;
	}

	// x= x1+ ka*(x2-x1)
	let lng = start.lng + ka * (finish.lng - start.lng);

	// y= y1+ ka*(y2-y1)
	let lat = start.lat + ka * (finish.lat - start.lat);

	console.log("delta3");

	return { lat, lng };
}


export { segmentsIntersect, isFinishLinePassed }