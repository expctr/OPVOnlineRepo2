"use strict";
/**
 * В данном файле содержится реализация единицы геоинформационных данных.
 */
/**
 * Единица геоинформационных данных.
 * @author Иван Шагурин
 */
class GeoinformationDataUnit {
    /**
     * Конструктор - создание нового объекта.
     * @param polarAngle полярный угол единицы геоинформационных
     * @param polarDistance полярное расстояние единицы геоинформационных данных.
     * @param value значение единицы геоинформационных данных.
     */
    constructor(polarAngle, polarDistance, value) {
        this.polarAngle = polarAngle;
        this.polarDistance = polarDistance;
        this.value = value;
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
    /**
     * Получаем значение.
     * @returns значение.
     */
    getValue() {
        return this.value;
    }
    /**
     * Получаем цвет.
     * @returns цвет.
     */
    getColor() {
        return GeoinformationDataUnit.getColor(this.value);
    }
    /**
     * Получаем цвет, который соответсвтует указанному значению.
     * @param value указанное значение.
     * @returns цвет, который соответсвтует указанному значению.
     */
    static getColor(value) {
        if (value > this.maxValue) {
            return GeoinformationDataUnit.FIRST_COLOR;
        }
        else if (value < 0) {
            return GeoinformationDataUnit.THIRD_COLOR;
        }
        else if (value > this.maxValue / 2) {
            return Color.getIntermediateColor(this.maxValue / 2, GeoinformationDataUnit.SECOND_COLOR, this.maxValue, GeoinformationDataUnit.FIRST_COLOR, value);
        }
        else {
            return Color.getIntermediateColor(0, GeoinformationDataUnit.THIRD_COLOR, this.maxValue / 2, GeoinformationDataUnit.SECOND_COLOR, value);
        }
        // if (value > this.maxValue) {
        //     return GeoinformationDataUnit.FIRST_COLOR
        // } else if (value > this.maxValue / 3 * 2.5) {
        //     return Color.getIntermediateColor(
        //         this.maxValue / 3 * 2.5, GeoinformationDataUnit.SECOND_COLOR,
        //         this.maxValue, GeoinformationDataUnit.FIRST_COLOR,
        //         value
        //     )
        // } else if (value > this.maxValue / 3 * 2) {
        //     return Color.getIntermediateColor(
        //         this.maxValue / 3 * 2, GeoinformationDataUnit.THIRD_COLOR,
        //         this.maxValue / 3 * 2.5, GeoinformationDataUnit.SECOND_COLOR,
        //         value
        //     )
        // } else if (value > this.maxValue / 3 * 1.5) {
        //     return Color.getIntermediateColor(
        //         this.maxValue / 3 * 1.5, GeoinformationDataUnit.FOURTH_COLOR,
        //         this.maxValue / 3 * 2, GeoinformationDataUnit.THIRD_COLOR,
        //         value
        //     )
        // } else if (value > this.maxValue / 3) {
        //     return Color.getIntermediateColor(
        //         this.maxValue / 3, GeoinformationDataUnit.FIFTH_COLOR,
        //         this.maxValue / 3 * 1.5, GeoinformationDataUnit.FOURTH_COLOR,
        //         value
        //     )
        // } else if (value > this.maxValue / 3 * 0.05) {
        //     return Color.getIntermediateColor(
        //         this.maxValue / 3 * 0.05, GeoinformationDataUnit.SIXTH_COLOR,
        //         this.maxValue / 3, GeoinformationDataUnit.FIFTH_COLOR,
        //         value
        //     )
        // } else if (value > 0) {
        //     return Color.getIntermediateColor(
        //         0, GeoinformationDataUnit.SEVENTH_COLOR,
        //         this.maxValue / 3 * 0.05, GeoinformationDataUnit.SIXTH_COLOR,
        //         value
        //     )
        // } else {
        //     return GeoinformationDataUnit.SEVENTH_COLOR
        // }
    }
    /**
     * Получаем первую вершину четырехугольника, который
     * приближает изображение единицы геоинформационных данных.
     * @param displayWidth ширина дисплея.
     * @returns упомянутая вершина.
     */
    getFirstPoint(displayWidth) {
        let x1 = this.getStandardX(displayWidth);
        let y1 = this.getStandardY(displayWidth);
        return new Point(x1, y1);
    }
    /**
     * Получаем вторую вершину четырехугольника, который
     * приближает изображение единицы геоинформационных данных.
     * @param displayWidth ширина дисплея.
     * @returns упомянутая вершина.
     */
    getSecondPoint(displayWidth) {
        let firstPoint = this.getFirstPoint(displayWidth);
        let radiusVector = new RadiusVector(0, 0, firstPoint.x, firstPoint.y);
        radiusVector.applyRotation(Math.PI / 48);
        let x2 = radiusVector.getArrowheadX();
        let y2 = radiusVector.getArrowheadY();
        return new Point(x2, y2);
    }
    /**
     * Получаем третью вершину четырехугольника, который
     * приближает изображение единицы геоинформационных данных.
     * @param displayWidth ширина дисплея.
     * @returns упомянутая вершина.
     */
    getThirdPoint(displayWidth) {
        let secondPoint = this.getSecondPoint(displayWidth);
        let radiusVector = new RadiusVector(0, 0, secondPoint.x, secondPoint.y);
        let l0 = displayWidth / 160;
        let ratio = (radiusVector.getLength() - l0) / radiusVector.getLength();
        radiusVector.applyHomothety(ratio);
        let x3 = radiusVector.getArrowheadX();
        let y3 = radiusVector.getArrowheadY();
        return new Point(x3, y3);
    }
    /**
     * Получаем четвертую вершину четырехугольника, который
     * приближает изображение единицы геоинформационных данных.
     * @param displayWidth ширина дисплея.
     * @returns упомянутая вершина.
     */
    getFourhtPoint(displayWidth) {
        let thirdPoint = this.getThirdPoint(displayWidth);
        let radiusVector = new RadiusVector(0, 0, thirdPoint.x, thirdPoint.y);
        radiusVector.applyRotation(-Math.PI / 48);
        let x4 = radiusVector.getArrowheadX();
        let y4 = radiusVector.getArrowheadY();
        return new Point(x4, y4);
    }
    /**
     * Получаем единицу геоинформационных данных по ее
     * строковому представлению.
     * @param str строковое представление единицы геоинформационных данных.
     * @returns полученная единица геоинформационных данных.
     */
    static parse(str) {
        let splitResult = str.split(' ').filter(element => element);
        let polarAngle = parseFloat(splitResult[0]);
        let polarDistance = parseFloat(splitResult[1]);
        let value = parseFloat(splitResult[2]);
        return new GeoinformationDataUnit(polarAngle, polarDistance, value);
    }
    /**
     * Получаем строковое представление координат.
     * @returns упомянутое строковое представление.
     */
    getCoordinatesRepresentation() {
        return this.polarAngle.toString() + ' ' + this.polarDistance.toString();
    }
}
// /**
//  * Первый граничный цвет для цветового индикатора.
//  */
// private static readonly FIRST_COLOR = new Color(255, 0, 0)
// /**
//  * Второй граничный цвет для цветового индикатора.
//  */
// private static readonly SECOND_COLOR = new Color(255, 165, 0)
// /**
//  * Третий граничный цвет для цветового индикатора.
//  */
// private static readonly THIRD_COLOR = new Color(255, 255, 0)
// /**
//  * Четвертый граничный цвет для цветового индикатора.
//  */
// private static readonly FOURTH_COLOR = new Color(0, 250, 154)
// /**
//  * Пятый граничный цвет для цветового индикатора.
//  */
// private static readonly FIFTH_COLOR = new Color(255, 0, 255)
// /**
//  * Шестой граничный цвет для цветового индикатора.
//  */
// private static readonly SIXTH_COLOR = new Color(100, 0, 100)
// /**
//  * Седьмой граничный цвет для цветового индикатора.
//  */
// private static readonly SEVENTH_COLOR = new Color(0, 0, 0)
/**
 * Первый граничный цвет для цветового индикатора.
 */
GeoinformationDataUnit.FIRST_COLOR = new Color(255, 0, 0, 1);
/**
 * Второй граничный цвет для цветового индикатора.
 */
GeoinformationDataUnit.SECOND_COLOR = new Color(0, 255, 0, 1);
GeoinformationDataUnit.THIRD_COLOR = new Color(70, 70, 70, 1);
/**
 * Значение единицы геоинформационных данных, которое соответствует
 * первому граничному цвету для цветового индикатора.
 */
GeoinformationDataUnit.maxValue = 5;
