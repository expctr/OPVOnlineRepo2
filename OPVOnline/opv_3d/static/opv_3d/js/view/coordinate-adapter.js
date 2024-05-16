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
            case CoordinateSystem.DISPLAY:
                this.xInCanvas = x + this.display.getOffsetX();
                this.yInCanvas = -y + this.display.getOffsetY();
                break;
            case CoordinateSystem.WEBGL:
                this.xInCanvas = x * 4;
                this.yInCanvas = y * 4;
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
            case CoordinateSystem.DISPLAY:
                return this.xInCanvas - this.display.getOffsetX();
            case CoordinateSystem.WEBGL:
                return this.xInCanvas / 4;
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
            case CoordinateSystem.DISPLAY:
                return -this.yInCanvas + this.display.getOffsetY();
            case CoordinateSystem.WEBGL:
                return this.yInCanvas / 4;
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
