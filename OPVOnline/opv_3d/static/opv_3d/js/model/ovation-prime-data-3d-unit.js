"use strict";
class OvationPrimeData3DUnit {
    constructor(firstPointLat, firstPointLon, secondPointLat, secondPointLon, thirdPointLat, thirdPointLon, fourthPointLat, fourthPointLon, height, value, firstPointMlt, firstPointMagneticLat) {
        this.firstPointLat = 0;
        this.firstPointLon = 0;
        this.secondPointLat = 0;
        this.secondPointLon = 0;
        this.thirdPointLat = 0;
        this.thirdPointLon = 0;
        this.fourthPointLat = 0;
        this.fourthPointLon = 0;
        this.height = 0;
        this.value = 0;
        this.firstPointMlt = 0;
        this.firstPointMagneticLat = 50;
        this.firstPointLat = firstPointLat;
        this.firstPointLon = firstPointLon;
        this.secondPointLat = secondPointLat;
        this.secondPointLon = secondPointLon;
        this.thirdPointLat = thirdPointLat;
        this.thirdPointLon = thirdPointLon;
        this.fourthPointLat = fourthPointLat;
        this.fourthPointLon = fourthPointLon;
        this.height = height;
        this.value = value;
        this.firstPointMlt = firstPointMlt;
        this.firstPointMagneticLat = firstPointMagneticLat;
    }
    static parse(description) {
        let splitDescription = description.split(' ');
        let firstPointLat = parseFloat(splitDescription[0]);
        let firstPointLon = parseFloat(splitDescription[1]);
        let secondPointLat = parseFloat(splitDescription[2]);
        let secondPointLon = parseFloat(splitDescription[3]);
        let thirdPointLat = parseFloat(splitDescription[4]);
        let thirdPointLon = parseFloat(splitDescription[5]);
        let fourthPointLat = parseFloat(splitDescription[6]);
        let fourthPointLon = parseFloat(splitDescription[7]);
        let height = parseFloat(splitDescription[8]);
        let value = parseFloat(splitDescription[9]);
        let firstPointMlt = parseFloat(splitDescription[10]);
        let firstPointMagneticLat = parseFloat(splitDescription[11]);
        return new OvationPrimeData3DUnit(firstPointLat, firstPointLon, secondPointLat, secondPointLon, thirdPointLat, thirdPointLon, fourthPointLat, fourthPointLon, height, value, firstPointMlt, firstPointMagneticLat);
    }
    static getColor(value) {
        if (value > this.maxValue) {
            return OvationPrimeData3DUnit.FIRST_COLOR;
        }
        else if (value < 0) {
            return OvationPrimeData3DUnit.THIRD_COLOR;
        }
        else if (value > this.maxValue / 2) {
            return Color.getIntermediateColor(this.maxValue / 2, OvationPrimeData3DUnit.SECOND_COLOR, this.maxValue, OvationPrimeData3DUnit.FIRST_COLOR, value);
        }
        else {
            return Color.getIntermediateColor(0, OvationPrimeData3DUnit.THIRD_COLOR, this.maxValue / 2, OvationPrimeData3DUnit.SECOND_COLOR, value);
        }
    }
    getColor() {
        return OvationPrimeData3DUnit.getColor(this.value);
    }
    getValue() {
        return this.value;
    }
    getCoordinatesRepresentation() {
        return this.firstPointMlt.toString() + ' ' + this.firstPointMagneticLat.toString();
    }
    getFirstPoint() {
        return new PointOnShpere(this.firstPointLat, this.firstPointLon);
    }
    getSecondPoint() {
        return new PointOnShpere(this.secondPointLat, this.secondPointLon);
    }
    getFourthPoint() {
        return new PointOnShpere(this.fourthPointLat, this.fourthPointLon);
    }
}
OvationPrimeData3DUnit.FIRST_COLOR = new Color(255, 0, 0, 0.7);
OvationPrimeData3DUnit.SECOND_COLOR = new Color(0, 255, 0, 0.7);
OvationPrimeData3DUnit.THIRD_COLOR = new Color(100, 100, 100, 0);
OvationPrimeData3DUnit.maxValue = 5;
