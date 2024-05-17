"use strict";
/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за ломаную границу аврорального овала.
*/
class BrokenMarginBuilder {
    constructor() {
        this.graphicalComposite = new GraphicalComposite();
    }
    build(geoinformationDataUnits, marginLevel, color, visualizationDisplay) {
        this.graphicalComposite = new GraphicalComposite();
        this.buildRadialMarginLines(geoinformationDataUnits, marginLevel, color, visualizationDisplay);
        this.buildCircleMarginLines(geoinformationDataUnits, marginLevel, color, visualizationDisplay);
    }
    buildRadialMarginLines(geoinformationDataUnits, marginLevel, color, visualizationDisplay) {
        for (let polarAngle = 0; polarAngle <= 23.75; polarAngle += 0.25) {
            for (let polarDistance = 50; polarDistance <= 89.5; polarDistance += 0.5) {
                let first = geoinformationDataUnits[polarAngle.toString() + ' ' + polarDistance.toString()];
                if (first == undefined) {
                    continue;
                }
                let nextPolarAngle = polarAngle - 0.25;
                if (nextPolarAngle < 0) {
                    nextPolarAngle = 23.75;
                }
                let second = geoinformationDataUnits[nextPolarAngle.toString() + ' ' + polarDistance.toString()];
                if (second == undefined) {
                    continue;
                }
                if (this.marginIsLocated(first.getValue(), second.getValue(), marginLevel)) {
                    let firstPoint = first.getFirstPoint(visualizationDisplay.getWidth());
                    let fourthPoint = first.getFourhtPoint(visualizationDisplay.getWidth());
                    this.graphicalComposite.add(new GraphicalSegment(BrokenMarginBuilder.MARGIN_WIDTH, color, firstPoint.x, firstPoint.y, fourthPoint.x, fourthPoint.y));
                }
            }
        }
    }
    buildCircleMarginLines(geoinformationDataUnits, marginLevel, color, visualizationDisplay) {
        for (let polarAngle = 0; polarAngle <= 23.75; polarAngle += 0.25) {
            for (let polarDistance = 50.5; polarDistance <= 89.5; polarDistance += 0.5) {
                let first = geoinformationDataUnits[polarAngle.toString() + ' ' + polarDistance.toString()];
                if (first == undefined) {
                    continue;
                }
                let nextPolarDistance = polarDistance - 0.5;
                let second = geoinformationDataUnits[polarAngle.toString() + ' ' + nextPolarDistance.toString()];
                if (second == undefined) {
                    continue;
                }
                if (this.marginIsLocated(first.getValue(), second.getValue(), marginLevel)) {
                    let firstPoint = first.getFirstPoint(visualizationDisplay.getWidth());
                    let secondPoint = first.getSecondPoint(visualizationDisplay.getWidth());
                    this.graphicalComposite.add(new GraphicalSegment(BrokenMarginBuilder.MARGIN_WIDTH, color, firstPoint.x, firstPoint.y, secondPoint.x, secondPoint.y));
                }
            }
        }
    }
    marginIsLocated(firstValue, secondValue, marginLevel) {
        return (((firstValue >= marginLevel) && (secondValue < marginLevel))
            || ((firstValue < marginLevel) && (secondValue >= marginLevel)));
    }
    getGraphicalComponent() {
        return this.graphicalComposite;
    }
}
BrokenMarginBuilder.MARGIN_WIDTH = 10;
BrokenMarginBuilder.brokenMarginBuiler = new BrokenMarginBuilder();
