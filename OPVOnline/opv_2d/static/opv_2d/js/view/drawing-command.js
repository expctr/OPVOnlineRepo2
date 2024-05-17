"use strict";
/*
 * В данном файле содержится реализация команды для рисования из паттерна Command.
 */
class DrawingCommand {
    constructor(rebuildFlag) {
        this.rebuildFlag = true;
        this.imageLoadedFlag = false;
        this.geoinformationDataUnits = null;
        this.marginLevel = 0;
        this.middleMarginSegments = [];
        this.terminatorVertices = null;
        // public cloudinessImageSrc: string | null = null
        this.cloudinessImage = null;
        this.cloudinessMltRotationAngle = 0;
        this.continentsVertices = null;
        this.cities = null;
        this.totalMltRotationAngle = 0;
        this.mouseEvent = null;
        this.rebuildFlag = rebuildFlag;
    }
    set(geoinformationDataUnits, marginLevel, middleMarginSegments, terminatorVertices, cloudinessMltRotationAngle, continentsVertices, cities, totalMltRotationAngle, mouseEvent) {
        this.geoinformationDataUnits = geoinformationDataUnits;
        this.marginLevel = marginLevel;
        this.middleMarginSegments = middleMarginSegments;
        this.terminatorVertices = terminatorVertices;
        this.cloudinessMltRotationAngle = cloudinessMltRotationAngle;
        this.continentsVertices = continentsVertices;
        this.cities = cities;
        this.totalMltRotationAngle = totalMltRotationAngle;
        this.mouseEvent = mouseEvent;
    }
    setCloudinessImage(cloudinessImage) {
        this.cloudinessImage = cloudinessImage;
    }
    setLoadedImageFlagAsTrue() {
        this.imageLoadedFlag = true;
    }
}
