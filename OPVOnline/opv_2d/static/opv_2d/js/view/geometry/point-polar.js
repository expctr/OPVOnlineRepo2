"use strict";
/*
 * В данном файле содержится реализация класса, который соответствует точке в полярной
 * системе координат.
 */
class PointPolar {
    constructor(polarDistance, polarAngle) {
        this.polarDistance = 0;
        this.polarAngle = 0;
        this.polarDistance = polarDistance;
        this.polarAngle = polarAngle;
    }
    /**
 * Получаем полярный угол.
 * @returns полярный угол.
 */
    getPolarAngle() {
        return this.polarAngle;
    }
    /**
     * Получаем полярный угол в радианах.
     * @returns полярный угол в радианах.
     */
    getStandardPolarAngle() {
        return (this.polarAngle - 6) * Math.PI / 12;
    }
    /**
     * Получаем полярное расстояние.
     * @returns полярное расстояние.
     */
    getPolarDistance() {
        return this.polarDistance;
    }
    /**
     * Получаем стандартное полярное расстояние.
     * @param displayWidth ширина экрана.
     * @returns стандартное полярное расстояние.
     */
    getStandardPolarDistance(displayWidth) {
        return (90 - this.polarDistance) / 80 * displayWidth;
    }
    /**
     * Получаем стандартную координату x.
     * @param displayWidth ширина экрана.
     * @returns стандартная координата x.
     */
    getStandardX(displayWidth) {
        return this.getStandardPolarDistance(displayWidth)
            * Math.cos(this.getStandardPolarAngle());
    }
    /**
     * Получаем стандартную координату y.
     * @param displayWidth ширина экрана.
     * @returns стандартная координата y.
     */
    getStandardY(displayWidth) {
        return this.getStandardPolarDistance(displayWidth)
            * Math.sin(this.getStandardPolarAngle());
    }
}
