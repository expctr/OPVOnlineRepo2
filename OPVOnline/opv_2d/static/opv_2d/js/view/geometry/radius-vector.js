"use strict";
/*
 * В данном файле содержится реализация радиус-вектора.
 */
/**
 * Радиус-вектор.
 * @author Иван Шагурин
 */
class RadiusVector {
    /**
     * Получаем координату x конца радиус-вектора.
     * @returns упомянутая координата x.
     */
    getArrowheadX() {
        return this.arrowhead.x;
    }
    /**
     * Получаем координату y конца радиус-вектора.
     * @returns упомянутая координата y.
     */
    getArrowheadY() {
        return this.arrowhead.y;
    }
    /**
     * Получаем длину радиус-вектора.
     * @returns упомянутая длина.
     */
    getLength() {
        return Math.sqrt(this.arrowhead.x * this.arrowhead.x
            + this.arrowhead.y * this.arrowhead.y);
    }
    /**
     * Конструктор - создание нового объекта.
     * @param xFrom координата x начала.
     * @param yFrom координата y начала.
     * @param xTo координата x конца.
     * @param yTo координата y конца.
     */
    constructor(xFrom, yFrom, xTo, yTo) {
        /**
         * Конец радиус-вектора.
         */
        this.arrowhead = new Point(0, 0);
        this.arrowhead = new Point(xTo - xFrom, yTo - yFrom);
    }
    /**
     * Применяем поворот к радиус-вектору.
     * @param angle угол поворота.
     */
    applyRotation(angle) {
        let xRotated = this.arrowhead.x * Math.cos(angle)
            - this.arrowhead.y * Math.sin(angle);
        let yRotated = this.arrowhead.x * Math.sin(angle)
            + this.arrowhead.y * Math.cos(angle);
        this.arrowhead.x = xRotated;
        this.arrowhead.y = yRotated;
    }
    /**
     * Применяем гомотетию к радиус-вектору.
     * @param ratio коэффициент гомотетии.
     */
    applyHomothety(ratio) {
        this.arrowhead.x *= ratio;
        this.arrowhead.y *= ratio;
    }
}
