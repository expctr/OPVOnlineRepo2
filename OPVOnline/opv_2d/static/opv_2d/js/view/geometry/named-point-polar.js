"use strict";
/*
 * В данном файле содержится реализация класса, который соответствует точек в полярной
 * системе координат. Приче у такой точки есть имя.
 */
class NamedPointPolar {
    constructor(name, polarDistance, polarAngle) {
        this.name = '';
        this.pointPolar = new PointPolar(0, 0);
        this.name = name;
        this.pointPolar = new PointPolar(polarDistance, polarAngle);
    }
    static parse(description) {
        let splitDescription = description.split(' ');
        return new NamedPointPolar(splitDescription[0], parseFloat(splitDescription[1]), parseFloat(splitDescription[2]));
    }
    getPoint(displayWidth) {
        return new Point(this.pointPolar.getStandardX(displayWidth), this.pointPolar.getStandardY(displayWidth));
    }
}
