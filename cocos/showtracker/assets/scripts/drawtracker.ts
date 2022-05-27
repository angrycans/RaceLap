import { _decorator, Component, screen, Graphics, view, resources, TextAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('drawtracker')
export class drawtracker extends Component {
    start() {
        let ctx = this.getComponent(Graphics)

        console.log("screen.windowSize", screen.windowSize)
        console.log("view", view.getVisibleSize())

        let width = view.getVisibleSize().width
        let height = view.getVisibleSize().height

        var myPoints = [[2.809510437833253, 49.408625488749216], [2.8095461924850422, 49.40864172401838], [2.8095226856172806, 49.40866595550704], [2.809565304449213, 49.40868849340382], [2.8097185865450465, 49.40858536874469], [2.809677338568488, 49.40856463072128], [2.8096442193374154, 49.408580757620854], [2.809609885351463, 49.40855283978645], [2.809510437833253, 49.408625488749216]]

        var minX, minY, maxX, maxY;
        myPoints.forEach((p, i) => {
            if (i === 0) { // if first point 
                minX = maxX = p[0];
                minY = maxY = p[1];
            } else {
                minX = Math.min(p[0], minX);
                minY = Math.min(p[1], minY);
                maxX = Math.max(p[0], maxX);
                maxY = Math.max(p[1], maxY);
            }
        });
        // now get the map width and heigth in its local coords
        const mapWidth = maxX - minX;
        const mapHeight = maxY - minY;
        const mapCenterX = (maxX + minX) / 2;
        const mapCenterY = (maxY + minY) / 2;

        // // to find the scale that will fit the canvas get the min scale to fit height or width
        const scale = Math.min(width / mapWidth, height / mapHeight);

        // ctx.beginPath();
        // myPoints.forEach(p => {
        //     ctx.lineTo(
        //         (p[0] - mapCenterX) * scale + canvas.width / 2,
        //         (p[1] - mapCenterY) * scale + canvas.height / 2
        //     );
        // });
        // ctx.stroke();

        // // Now you can draw the map centered on the cavas
        ctx.lineWidth = 2;
        ctx.strokeColor.fromHEX('#ff0000');

        // ctx.moveTo(
        //     (myPoints[0][0] - mapCenterX) * scale,
        //     (myPoints[0][1] - mapCenterY) * scale
        // );
        // myPoints.forEach(p => {
        //     console.log((p[0] - mapCenterX) * scale,
        //         (p[1] - mapCenterY) * scale)
        //     ctx.lineTo(
        //         (p[0] - mapCenterX) * scale,
        //         (p[1] - mapCenterY) * scale
        //     );
        // });

        // ctx.close();
        // ctx.stroke();


        // ctx.moveTo(-40, 0);
        // ctx.lineTo(0, -80);
        // ctx.lineTo(40, 0);
        // ctx.lineTo(0, 80);
        // ctx.close();
        // ctx.stroke();



        resources.load("05021404-1", TextAsset, (err: any, data: TextAsset) => {

            let str = data.text.split("\n")
            console.log(str[0])




            let bounds = [];
            str.forEach(s => {
                let item = s.split(",");
                //  console.log(lonLat2WebMercator(item[2], item[3]), s)
                bounds.push([item[2], item[3]])
            })




            let maxLongitude = 0;
            let minLongitude = 0;
            let maxLatitude = 0;
            let minLatitude = 0;
            bounds.forEach(x => {
                console.log(x)
                if (x[0] > maxLongitude) {
                    maxLongitude = x[0]
                    if (minLongitude == 0) {
                        minLongitude = x[0]
                    }
                } else if (x[0] < minLongitude) {
                    minLongitude = x[0]
                }
                if (x[1] > maxLatitude) {
                    maxLatitude = x[1]
                    if (minLatitude == 0) {
                        minLatitude = x[1]
                    }
                } else if (x[1] < minLatitude) {
                    minLatitude = x[1]
                }
                // })
            })

            console.log(maxLongitude, minLongitude, maxLatitude, minLatitude)
            let xScale = (view.getVisibleSize().width) / Math.abs(maxLongitude - minLongitude)
            let yScale = (view.getVisibleSize().height) / Math.abs(maxLatitude - minLatitude)
            let scale = xScale < yScale ? xScale : yScale
            let xoffset = - Math.abs(maxLongitude - minLongitude) * scale + 100
            let yoffset = - Math.abs(maxLatitude - minLatitude) / 2 * scale

            console.log(xScale, yScale, xoffset, yoffset)

            // var dimensions = {
            //     width: view.getVisibleSize().width,
            //     height: view.getVisibleSize().height
            // }

            // function getX(x) {
            //     var position = (x - minLongitude) / (maxLongitude - minLongitude);
            //     return dimensions.width * position - dimensions.width / 2;
            // }
            // function getY(y) {
            //     var position = (maxLatitude - y) / (maxLatitude - minLatitude);
            //     return dimensions.height * position - dimensions.height / 2;
            // }


            // let firstpos = bounds[0]
            // ctx.moveTo(getX(firstpos[0]), getY(firstpos[1]));
            // bounds.forEach(y => {
            //     //console.log((y[0] - minLongitude) * scale + xoffset, (maxLatitude - y[1]) * scale + yoffset);
            //     ctx.lineTo(getX(y[0]), getY(y[1]));

            // })

            let firstpos = bounds[0]
            ctx.moveTo(firstpos[0], firstpos[1]);
            bounds.forEach(y => {
                //console.log((y[0] - minLongitude) * scale + xoffset, (maxLatitude - y[1]) * scale + yoffset);
                ctx.lineTo((y[0] - minLongitude) * scale + xoffset, (maxLatitude - y[1]) * scale + yoffset);

            })
            // // ctx.close();
            ctx.stroke()

        });

    }

    update(deltaTime: number) {

    }
}

