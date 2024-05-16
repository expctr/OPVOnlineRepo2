"use strict";
class CloudinessCell {
    constructor(geomagneticLatitude, mlt) {
        this.geomagneticLatitude = geomagneticLatitude;
        this.mlt = mlt;
    }
    set(geomagneticLatitude, mlt) {
        this.geomagneticLatitude = geomagneticLatitude;
        this.mlt = mlt;
    }
    getStandardPolarDistance(displayWidth) {
        return (90 - this.geomagneticLatitude) / 80 * displayWidth;
    }
    getStandardPolarAngle() {
        return (this.mlt - 6) * Math.PI / 12;
    }
    getStandardX(displayWidth) {
        return this.getStandardPolarDistance(displayWidth)
            * Math.cos(this.getStandardPolarAngle());
    }
    getStandardY(displayWidth) {
        return this.getStandardPolarDistance(displayWidth)
            * Math.sin(this.getStandardPolarAngle());
    }
    static getColor(value) {
        return new Color(220, 220, 220, value / 100);
    }
}
CloudinessCell.firstCloudinessCell = new CloudinessCell(0, 0);
CloudinessCell.secondCloudinessCell = new CloudinessCell(0, 0);
CloudinessCell.thirdCloudinessCell = new CloudinessCell(0, 0);
CloudinessCell.fourthCloudinessCell = new CloudinessCell(0, 0);
