"use strict";
class View {
    constructor() {
        this.cesiumContainer = document.getElementById('cesiumContainer');
        this.showMarginCheckbox = document.getElementById('show-margin-checkbox');
        this.smoothMarginCheckbox = document.getElementById('smooth-margin-checkbox');
        this.datetimeInput = document.getElementById('datetime-input');
        this.showDayNightCheckbox = document.getElementById('show-day-night-checkbox');
        this.colorIndicatorCanvas = document.getElementById('color-indicator-canvas');
        this.COLOR_INDICATOR_LABELS_FONT = '60px Arial';
        this.showHeatmapCheckbox = document.getElementById('show-heatmap-checkbox');
        //@ts-ignore
        this.viewer = new Cesium.Viewer("cesiumContainer", {
            animation: false,
            geocoder: false,
            // navigationInstructionsInitiallyVisible: false,
            // timeline: false,
            // fullscreenButton: false
            // infoBox: true
            // requestRenderMode: true,
        });
        //@ts-ignore
        this.entities = this.viewer.entities;
        this.entityArray = [];
        this.colorIndicatorDisplay = new Display(this.colorIndicatorCanvas, 120 * 4, 461 * 4, false, 0.28);
        this.viewer.timeline.container.style.visibility = 'hidden';
        this.viewer.timeline.container.disabled = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
        this.viewer._fullscreenButton._container.style.left = '80%';
        this.viewer._fullscreenButton._container.style.width = '20%';
        this.viewer._navigationHelpButton.destroy();
        // this.viewer._navigationHelpButton._viewModel
        this.viewer._homeButton._element.style.visibility = 'hidden';
        // console.log(this.viewer)
    }
    show(ovationPrimeData3DUnits, marginLevel, middleMarginSegments) {
        var startTime = performance.now();
        console.log("show");
        this.clear();
        this.setCesiumTime();
        if (this.showHeatmapCheckbox.checked) {
            for (let i = 0; i < ovationPrimeData3DUnits.length; ++i) {
                this.showOvationPrimeData3DUnit(ovationPrimeData3DUnits[i]);
            }
        }
        if ((ovationPrimeData3DUnits != null) && (this.showMarginCheckbox.checked)) {
            if (this.smoothMarginCheckbox.checked) {
                this.paintSmoothMargin(middleMarginSegments);
            }
            else {
                this.paintMargin(this.convertOvationPrimeData3DUnits(ovationPrimeData3DUnits), marginLevel);
            }
        }
        if (this.showDayNightCheckbox.checked) {
            this.paintTerminator();
        }
        else {
            this.viewer.scene.globe.enableLighting = false;
        }
        this.colorIndicatorDisplay.clear();
        this.paintColorIndicator();
        this.paintColorIndicator();
        this.paintColorIndicator();
        this.paintColorIndicatorLabels();
        let endTime = performance.now();
        console.log(`Show took ${endTime - startTime} milliseconds`);
    }
    clear() {
        for (let i = 0; i < this.entityArray.length; ++i) {
            let currentEntity = this.entityArray[i];
            this.entities.remove(currentEntity);
        }
        this.entityArray = [];
    }
    showOvationPrimeData3DUnit(ovationPrimeData3DUnit) {
        let entity = this.entities.add({
            polygon: {
                //@ts-ignore
                hierarchy: new Cesium.PolygonHierarchy(
                //@ts-ignore
                Cesium.Cartesian3.fromDegreesArray([
                    ovationPrimeData3DUnit.firstPointLon,
                    ovationPrimeData3DUnit.firstPointLat,
                    ovationPrimeData3DUnit.secondPointLon,
                    ovationPrimeData3DUnit.secondPointLat,
                    ovationPrimeData3DUnit.thirdPointLon,
                    ovationPrimeData3DUnit.thirdPointLat,
                    ovationPrimeData3DUnit.fourthPointLon,
                    ovationPrimeData3DUnit.fourthPointLat,
                ])),
                height: View.HEIGHT,
                //@ts-ignore
                material: Cesium.Color.fromBytes(ovationPrimeData3DUnit.getColor().getRed(), ovationPrimeData3DUnit.getColor().getGreen(), ovationPrimeData3DUnit.getColor().getBlue(), ovationPrimeData3DUnit.getColor().getAlpha()),
            },
            description: 'Географические координаты: '
                + 'широта = '
                + ovationPrimeData3DUnit.firstPointLat.toFixed(4)
                + ', долгота = '
                + ovationPrimeData3DUnit.firstPointLon.toFixed(4)
                + '. Геомагнитные координаты: '
                + 'mlt = '
                + ovationPrimeData3DUnit.firstPointMlt
                + ', геомагнитная широта = '
                + ovationPrimeData3DUnit.firstPointMagneticLat
                + '. Значение = '
                + ovationPrimeData3DUnit.value
                + '.\n'
            // + (new SegmentOnSphere(ovationPrimeData3DUnit.getFirstPoint(),
            //     ovationPrimeData3DUnit.getSecondPoint(),
            //     null)).isBad(),
        });
        //@ts-ignore
        this.entityArray.push(entity);
    }
    convertOvationPrimeData3DUnits(ovationPrimeData3DUnits) {
        let result = {};
        for (let i = 0; i < ovationPrimeData3DUnits.length; ++i) {
            let currentOvationPrimeData3DUnit = ovationPrimeData3DUnits[i];
            result[currentOvationPrimeData3DUnit.getCoordinatesRepresentation()]
                = currentOvationPrimeData3DUnit;
        }
        return result;
    }
    paintMargin(ovationPrimeData3DUnits, marginLevel) {
        this.paintRadialMarginLines(ovationPrimeData3DUnits, marginLevel);
        this.paintCircleMarginLines(ovationPrimeData3DUnits, marginLevel);
    }
    paintRadialMarginLines(ovationPrimeData3DUnits, marginLevel) {
        if (Object.keys(ovationPrimeData3DUnits).length == 0) {
            return;
        }
        for (let polarAngle = 0; polarAngle <= 23.75; polarAngle += 0.25) {
            for (let polarDistance = 50; polarDistance <= 89.5; polarDistance += 0.5) {
                let first = ovationPrimeData3DUnits[polarAngle.toString() + ' ' + polarDistance.toString()];
                if (first == undefined) {
                    continue;
                }
                let nextPolarAngle = polarAngle - 0.25;
                if (nextPolarAngle < 0) {
                    nextPolarAngle = 23.75;
                }
                let second = ovationPrimeData3DUnits[nextPolarAngle.toString() + ' ' + polarDistance.toString()];
                if (second == undefined) {
                    continue;
                }
                if (this.marginIsLocated(first.getValue(), second.getValue(), marginLevel)) {
                    let firstPoint = first.getFirstPoint();
                    let fourthPoint = first.getFourthPoint();
                    let entity = this.entities.add({
                        polyline: {
                            //@ts-ignore
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                                firstPoint.lon,
                                firstPoint.lat,
                                View.HEIGHT,
                                fourthPoint.lon,
                                fourthPoint.lat,
                                View.HEIGHT
                            ]),
                            width: 3,
                            //@ts-ignore
                            material: Cesium.Color.BLACK,
                            description: "hello"
                        },
                    });
                    //@ts-ignore
                    this.entityArray.push(entity);
                }
            }
        }
    }
    paintCircleMarginLines(ovationPrimeData3DUnits, marginLevel) {
        if (Object.keys(ovationPrimeData3DUnits).length == 0) {
            return;
        }
        for (let polarAngle = 0; polarAngle <= 23.75; polarAngle += 0.25) {
            for (let polarDistance = 50.5; polarDistance <= 89.5; polarDistance += 0.5) {
                let first = ovationPrimeData3DUnits[polarAngle.toString() + ' ' + polarDistance.toString()];
                if (first == undefined) {
                    continue;
                }
                let nextPolarDistance = polarDistance - 0.5;
                let second = ovationPrimeData3DUnits[polarAngle.toString() + ' ' + nextPolarDistance.toString()];
                if (second == undefined) {
                    continue;
                }
                if (this.marginIsLocated(first.getValue(), second.getValue(), marginLevel)) {
                    let firstPoint = first.getFirstPoint();
                    let secondPoint = first.getSecondPoint();
                    let entity = this.entities.add({
                        polyline: {
                            //@ts-ignore
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                                firstPoint.lon,
                                firstPoint.lat,
                                View.HEIGHT,
                                secondPoint.lon,
                                secondPoint.lat,
                                View.HEIGHT
                            ]),
                            width: 3,
                            //@ts-ignore
                            material: Cesium.Color.BLACK,
                            description: "hello"
                        },
                    });
                    //@ts-ignore
                    this.entityArray.push(entity);
                }
            }
        }
    }
    marginIsLocated(firstValue, secondValue, marginLevel) {
        return (((firstValue >= marginLevel) && (secondValue < marginLevel))
            || ((firstValue < marginLevel) && (secondValue >= marginLevel)));
    }
    getSphericalDistance(lat1, lon1, lat2, lon2) {
        let arg = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2);
        return Math.acos(arg);
    }
    lonDifferenceIsAcceptable(lon1, lon2) {
        let lonDifference = Math.abs(lon1 - lon2);
        return (lonDifference < 10) || (Math.abs(lonDifference - 360) < 10);
    }
    paintSmoothMargin(middleMarginSegments) {
        var _a;
        for (let i = 0; i < middleMarginSegments.length; ++i) {
            let middleSegment = middleMarginSegments[i];
            // let entity = this.entities.add({
            //     polyline: {
            //         //@ts-ignore
            //         positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            //             middleSegment.getFirstEnd().lon,
            //             middleSegment.getFirstEnd().lat,
            //             200000.0,
            //             middleSegment.getSecondEnd().lon,
            //             middleSegment.getSecondEnd().lat,
            //             200000.0
            //         ]),
            //         width: 3,
            //         //@ts-ignore
            //         material: Cesium.Color.BLACK,
            //     },
            // });
            // //@ts-ignore
            // this.entityArray.push(entity)
            if (middleSegment.isBad()
                || middleSegment.getFirstNeighbour().isBad()) {
                if (this.lonDifferenceIsAcceptable(middleSegment.getFirstEnd().lon, middleSegment.getSecondEnd().lon)) {
                    let entity = this.entities.add({
                        polyline: {
                            //@ts-ignore
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                                middleSegment.getFirstEnd().lon,
                                middleSegment.getFirstEnd().lat,
                                View.HEIGHT,
                                middleSegment.getSecondEnd().lon,
                                middleSegment.getSecondEnd().lat,
                                View.HEIGHT
                            ]),
                            width: 3,
                            //@ts-ignore
                            material: Cesium.Color.BLACK,
                        },
                    });
                    //@ts-ignore
                    this.entityArray.push(entity);
                }
            }
            else {
                if (middleSegment.getFirstNeighbour() != null) {
                    this.drawBezierCurve(middleSegment.getFirstNeighbour().getMiddle(), middleSegment.getIntersectionWithFirstNeighbour(), middleSegment.getMiddle());
                }
            }
            if (middleSegment.isBad()
                || ((_a = middleSegment.getSecondNeighbour()) === null || _a === void 0 ? void 0 : _a.isBad())) {
                if (this.lonDifferenceIsAcceptable(middleSegment.getFirstEnd().lon, middleSegment.getSecondEnd().lon)) { // Math.abs(middleSegment.getFirstEnd().lon - middleSegment.getSecondEnd().lon) < Infinity
                    let entity = this.entities.add({
                        polyline: {
                            //@ts-ignore
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                                middleSegment.getFirstEnd().lon,
                                middleSegment.getFirstEnd().lat,
                                View.HEIGHT,
                                middleSegment.getSecondEnd().lon,
                                middleSegment.getSecondEnd().lat,
                                View.HEIGHT
                            ]),
                            width: 3,
                            //@ts-ignore
                            material: Cesium.Color.BLACK,
                            description: "hello"
                        },
                    });
                    // console.log("bad:")
                    // console.log(middleSegment.getFirstEnd().lon)
                    // console.log(middleSegment.getSecondEnd().lon)
                    // console.log("---------------------------------------------")
                    // console.log(middleSegment.getSecondNeighbour()!.getFirstEnd().lon)
                    // console.log(middleSegment.getSecondNeighbour()!.getSecondEnd().lon)
                    // console.log(Math.abs(middleSegment.getFirstEnd().lon - middleSegment.getSecondEnd().lon))
                    //@ts-ignore
                    this.entityArray.push(entity);
                }
            }
            else {
                if (middleSegment.getSecondNeighbour() != null) {
                    this.drawBezierCurve(middleSegment.getMiddle(), middleSegment.getIntersectionWithSecondNeighbour(), middleSegment.getSecondNeighbour().getMiddle());
                }
            }
        }
    }
    /**
     * Рисуем кривую Безье по трем точкам.
     * @param firstPoint первая точка для рисования кривой Безье.
     * @param secondPoint вторая точка для рисования кривой Безье.
     * @param thirdPoint третья точка для рисования кривой Безье.
     * @param color цвет кривой Безье.
     * @param lineWidth ширина линии.
     */
    drawBezierCurve(firstPoint, secondPoint, thirdPoint) {
        if (!firstPoint || !secondPoint || !thirdPoint) {
            return;
        }
        let firstSegment = new SegmentOnSphere(firstPoint, secondPoint, null);
        let secondSegment = new SegmentOnSphere(secondPoint, thirdPoint, null);
        let previousPoint = null;
        for (let t = 0; t <= 1; t += 0.2) {
            let maxDifference = -Infinity;
            let intermediateSegment = new SegmentOnSphere(firstSegment.getRatioPoint(t), secondSegment.getRatioPoint(t), null);
            let currentPoint = intermediateSegment.getRatioPoint(t);
            if (previousPoint != null
                && Math.abs(previousPoint.lon - currentPoint.lon) < 10
                && Math.abs(previousPoint.lat - currentPoint.lat) < 10) {
                // this.visualizationDisplay.drawLine(
                //     previousPoint.x,
                //     previousPoint.y,
                //     currentPoint.x,
                //     currentPoint.y,
                //     lineWidth,
                //     color
                // )
                if (Math.abs(previousPoint.lon - currentPoint.lon) < 1.5
                    && Math.abs(previousPoint.lat - currentPoint.lat) < 0.5) {
                    let entity = this.entities.add({
                        polyline: {
                            //@ts-ignore
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                                previousPoint.lon,
                                previousPoint.lat,
                                View.HEIGHT,
                                currentPoint.lon,
                                currentPoint.lat,
                                View.HEIGHT
                            ]),
                            width: 3,
                            //@ts-ignore
                            arcType: Cesium.ArcType.NONE,
                            //@ts-ignore
                            material: Cesium.Color.BLACK,
                            description: "hello"
                        },
                    });
                    // if (Math.abs(previousPoint.lon - currentPoint.lon) > 1) {
                    //     console.log(Math.abs(previousPoint.lon - currentPoint.lon))
                    // }
                    // console.log(previousPoint.lon - currentPoint.lon)
                    //@ts-ignore
                    this.entityArray.push(entity);
                }
            }
            previousPoint = currentPoint;
        }
    }
    setCesiumTime() {
        //@ts-ignore
        let currentTime = Cesium.JulianDate.fromDate(new Date(this.datetimeInput.value + ":00Z"));
        //@ts-ignore
        let endTime = Cesium.JulianDate.addDays(currentTime, 1, new Cesium.JulianDate());
        //@ts-ignore
        this.viewer.clock.currentTime = currentTime;
        //@ts-ignore
        this.viewer.timeline.zoomTo(currentTime, endTime);
    }
    paintTerminator() {
        //@ts-ignore
        var currentTime = Cesium.JulianDate.fromDate(new Date(this.datetimeInput.value));
        //@ts-ignore
        var endTime = Cesium.JulianDate.addDays(currentTime, 1, new Cesium.JulianDate());
        this.viewer.clock.currentTime = currentTime;
        this.viewer.timeline.zoomTo(currentTime, endTime);
        this.viewer.scene.globe.enableLighting = true;
        this.viewer.scene.globe.showGroundAtmosphere = true;
        this.viewer.scene.globe.dynamicAtmosphereLighting = true;
        // this.viewer.scene.globe.nightFadeOutDistance = 10000.0
        // this.viewer.scene.globe.nightFadeOutDistance *= 0.0001
        // this.viewer.scene.globe.nightFadeInDistance *= 0.6
        // this.viewer.scene.globe.lightingFadeInDistance *= 0.001
        // this.viewer.scene.globe.lightingFadeOutDistance *= 0.001
        // this.viewer.scene.globe.atmosphereBrightnessShift = 0.2
        this.viewer.scene.globe.nightFadeOutDistance = 10000000.0 * 0.0001;
        this.viewer.scene.globe.nightFadeInDistance = 50000000.0 * 0.6;
        this.viewer.scene.globe.lightingFadeInDistance = 20000000.0 * 0.001;
        this.viewer.scene.globe.lightingFadeOutDistance = 10000000.0 * 0.001;
        // this.viewer.scene.globe.atmosphereBrightnessShift = 0.2
        // this.viewer.scene.globe.nightFadeOutDistance = 100000.0
        // this.viewer.scene.globe.nightFadeInDistance = 500000.0
        // this.viewer.scene.globe.lightingFadeInDistance = 20000000.0
        // this.viewer.scene.globe.lightingFadeOutDistance = 10000000.0
        // this.viewer.scene.globe.atmosphereBrightnessShift = 0.1
        // //@ts-ignore
        // this.viewer.scene.globe.material = new Cesium.Material({
        //     fabric: {
        //         type: 'Color',
        //         uniforms: {
        //             //@ts-ignore
        //             color: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
        //         }
        //     }
        // });
        // console.log(this.viewer.globe.nightFadeOutDistance)
        // this.viewer.globe.nightFadeOutDistance = 18000000
        //@ts-ignore
        // this.viewer.scene.globe.fillHighlightColor = Cesium.Color.fromBytes(
        //                 100, 100, 100, 150
        //             )
        //@ts-ignore
        // let latlngsArray = L.terminator({ time: this.datetimeInput.value + ":00Z" })._latlngs
        // let latlngsArray = L.terminator({ time: this.datetimeInput.value + ":00Z" })._latlngs
        // let degreesArray: number[] = []
        // // console.log(latlngsArray[0][0])
        // for (let i = 0; i < latlngsArray[0].length; ++i) {
        //     if (Math.abs(latlngsArray[0][i].lng) > 180) {
        //         latlngsArray[0][i].lng -= 180
        //     }
        //     degreesArray.push(latlngsArray[0][i].lng)
        //     degreesArray.push(latlngsArray[0][i].lat)
        // }
        //     let entity = this.entities.add({
        //         polygon: {
        //             //@ts-ignore
        //             hierarchy: new Cesium.PolygonHierarchy(
        //                 //@ts-ignore
        //                 Cesium.Cartesian3.fromDegreesArray(degreesArray)
        //             ),
        //             height: 0,
        //             //@ts-ignore
        //             material: Cesium.Color.fromBytes(
        //                 100, 100, 100, 150
        //             ),
        //         }
        //     });
        //     //@ts-ignore
        //     this.entityArray.push(entity)
    }
    /**
 * Раскрашиваем цветовой индикатор.
 */
    paintColorIndicator() {
        let outerRectangle = new Rectangle(-this.colorIndicatorDisplay.getWidth() / 4, this.colorIndicatorDisplay.getHeight() / 2, this.colorIndicatorDisplay.getWidth() / 4, this.colorIndicatorDisplay.getHeight());
        let totalNumberOfInnerRectangles = 300;
        for (let i = 0; i < totalNumberOfInnerRectangles; ++i) {
            let innerRectangle = this.getInnerRectangle(outerRectangle, totalNumberOfInnerRectangles, i);
            let ratio = i / totalNumberOfInnerRectangles;
            let value = OvationPrimeData3DUnit.maxValue * (1 - ratio);
            let color = OvationPrimeData3DUnit.getColor(value);
            this.colorIndicatorDisplay.fillRectangle(innerRectangle.x, innerRectangle.y, innerRectangle.x + innerRectangle.width, innerRectangle.y - innerRectangle.height, color.toString());
        }
    }
    /**
     * Раскрашиваем надписи цветового индикатора.
     */
    paintColorIndicatorLabels() {
        let outerRectangle = new Rectangle(-this.colorIndicatorDisplay.getWidth() / 4, this.colorIndicatorDisplay.getHeight() / 2, this.colorIndicatorDisplay.getWidth() / 4, this.colorIndicatorDisplay.getHeight());
        this.colorIndicatorDisplay.fillText("ergs/cm2s", outerRectangle.x + outerRectangle.width * 1.7 - 50, outerRectangle.y - 50, 'white', this.COLOR_INDICATOR_LABELS_FONT);
        this.colorIndicatorDisplay.fillText(OvationPrimeData3DUnit.maxValue.toFixed(2).toString(), outerRectangle.x + outerRectangle.width * 1.7 + 50, outerRectangle.y - 50, 'white', this.COLOR_INDICATOR_LABELS_FONT);
        this.colorIndicatorDisplay.fillText((OvationPrimeData3DUnit.maxValue / 2).toFixed(2).toString(), outerRectangle.x + outerRectangle.width * 1.7 + 50, 0 - 50, 'white', this.COLOR_INDICATOR_LABELS_FONT);
        this.colorIndicatorDisplay.fillText((0).toFixed(2).toString(), outerRectangle.x + outerRectangle.width * 1.7 + 50, -outerRectangle.y - 50, 'white', this.COLOR_INDICATOR_LABELS_FONT);
    }
    /**
     * Получаем внутренний прямоугольник.
     * @param outerRectangle внешний прямоугольник.
     * @param totalNumberOfInnerRectangles общее число внутренний прямоугольников.
     * @param indexOfInnerRectangle индекс внутреннего прямогольника.
     * @returns упомянутый прямоугольник.
     */
    getInnerRectangle(outerRectangle, totalNumberOfInnerRectangles, indexOfInnerRectangle) {
        let innerRectangleHeight = outerRectangle.height / totalNumberOfInnerRectangles;
        let innerRectangleWidth = outerRectangle.width;
        let innerRectangleX = outerRectangle.x;
        let innerRectangleY = outerRectangle.y - innerRectangleHeight * indexOfInnerRectangle;
        return new Rectangle(innerRectangleX, innerRectangleY, innerRectangleWidth, innerRectangleHeight);
    }
    adjustCamera() {
        this.viewer.camera.flyTo({
            //@ts-ignore
            destination: Cesium.Cartesian3
                .fromDegrees(80, 60, 11000000), duration: 1
        });
    }
    hideColorIndicatorCanvas() {
        this.colorIndicatorDisplay.hideCanvas();
        this.cesiumContainer.style.left = "0";
        this.cesiumContainer.style.width = (120 + 578).toString() + "px";
        // this.visualizationDisplay.canvas!.width = 4 * (120 + 578)
        // this.visualizationDisplay.makeDefaulOffsetAndtSizes(true, 0.85)
        // this.showWithoutRebuild()
    }
    showColorIndicatorCanvas() {
        this.colorIndicatorDisplay.showCanvas();
        this.cesiumContainer.style.left = "120px";
        this.cesiumContainer.style.width = (578).toString() + "px";
        // this.visualizationDisplay.canvas!.width = 4 * 578
        // this.visualizationDisplay.makeDefaulOffsetAndtSizes(true, 0.85)
        // this.showWithoutRebuild()
    }
    changeColorIndicatorCanvasVisibility() {
        if (this.colorIndicatorDisplay.canvasIsVisible()) {
            this.hideColorIndicatorCanvas();
        }
        else {
            this.showColorIndicatorCanvas();
        }
    }
}
View.HEIGHT = 95000;
