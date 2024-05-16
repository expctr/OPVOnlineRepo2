"use strict";
/*
 * В данном файле содержится класс для преобразования координат.
 */
/**
 * Класс для преобразования координат.
 * @author Иван Шагурин
 */
class CoordinateAdapter {
    /**
     * Конструктор - создание нового объекта.
     * @param display дисплей.
     */
    constructor() {
        /**
         * Дисплей.
         */
        this.display = null;
        /**
         * Координата x в системе отсчета холста.
         */
        this.xInCanvas = 0;
        /**
         * Координата y в системе отсчета холста.
         */
        this.yInCanvas = 0;
    }
    setDisplay(display) {
        this.display = display;
    }
    /**
     * Устанавливаем коордианты.
     * @param x координата x.
     * @param y координата y.
     * @param coordinateSystem система отсчета, в которой заданы упомянутые координаты.
     */
    set(x, y, coordinateSystem) {
        switch (coordinateSystem) {
            case CoordinateSystem.CANVAS:
                this.xInCanvas = x;
                this.yInCanvas = y;
                break;
            case CoordinateSystem.DISPLAY_ROTATED:
                let xD = x * Math.cos(-this.display.getRotationAngleInRadians())
                    - y * Math.sin(-this.display.getRotationAngleInRadians());
                let yD = x * Math.sin(-this.display.getRotationAngleInRadians())
                    + y * Math.cos(-this.display.getRotationAngleInRadians());
                this.xInCanvas = xD + this.display.getOffsetX();
                this.yInCanvas = -yD + this.display.getOffsetY();
                break;
            case CoordinateSystem.DISPLAY_NOT_ROTATED:
                this.xInCanvas = x + this.display.getOffsetX();
                this.yInCanvas = -y + this.display.getOffsetY();
                break;
            default:
                alert('Неизвестная система координат');
        }
    }
    /**
     * Получаем координату x в заданной системе отсчета.
     * @param coordinateSystem упомянутая система отсчета.
     * @returns упомянутая координата x.
     */
    getX(coordinateSystem) {
        switch (coordinateSystem) {
            case CoordinateSystem.CANVAS:
                return this.xInCanvas;
            case CoordinateSystem.DISPLAY_ROTATED:
                let xD = this.xInCanvas - this.display.getOffsetX();
                let yD = -this.yInCanvas + this.display.getOffsetY();
                return xD * Math.cos(this.display.getRotationAngleInRadians())
                    - yD * Math.sin(this.display.getRotationAngleInRadians());
            case CoordinateSystem.DISPLAY_NOT_ROTATED:
                return this.xInCanvas - this.display.getOffsetX();
            default:
                alert('Неизвестная система координат');
                return 0;
        }
    }
    /**
     * Получаем координату y в заданной системе отсчета.
     * @param coordinateSystem упомянутая система отсчета.
     * @returns упомянутая координата y.
     */
    getY(coordinateSystem) {
        switch (coordinateSystem) {
            case CoordinateSystem.CANVAS:
                return this.yInCanvas;
            case CoordinateSystem.DISPLAY_ROTATED:
                let xD = this.xInCanvas - this.display.getOffsetX();
                let yD = -this.yInCanvas + this.display.getOffsetY();
                return xD * Math.sin(this.display.getRotationAngleInRadians())
                    + yD * Math.cos(this.display.getRotationAngleInRadians());
            case CoordinateSystem.DISPLAY_NOT_ROTATED:
                return -this.yInCanvas + this.display.getOffsetY();
            default:
                alert('Неизвестная система координат');
                return 0;
        }
    }
}
CoordinateAdapter.firstCoordinateAdapter = new CoordinateAdapter();
CoordinateAdapter.secondCoordinateAdapter = new CoordinateAdapter();
CoordinateAdapter.thirdCoordinateAdapter = new CoordinateAdapter();
CoordinateAdapter.fourthCoordinateAdapter = new CoordinateAdapter();
