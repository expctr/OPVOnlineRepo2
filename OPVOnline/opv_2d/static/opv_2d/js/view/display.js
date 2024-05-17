"use strict";
/*
 * В данном файле содержится дисплей для визуализации.
 */
/**
 * Дисплей.
 * @author Иван Шагурин
 */
class Display {
    /**
     * Конструктор - создание нового объекта.
     * @param canvas холст.
     * @param width ширина холста.
     * @param height высота холста.
     * @param squareSizes флаг, который поднят, если размеры
     *                    дисплея должны быть квадратными. Иначе
     *                    его ширина и высота пропорциональны ширине
     *                    и высоте холста.
     */
    constructor(canvas, width, height, squareSizes, comprassionRatio) {
        /**
         * Холст.
         */
        this.canvas = null;
        /**
         * Объект для рисования на холсте.
         */
        this.context = null;
        this.gl = null;
        /**
         * Ширина.
         */
        this.width = 0;
        /**
         * Высота.
         */
        this.height = 0;
        /**
         * Сдвиг по оси X.
         */
        this.offsetX = 0;
        /**
         * Сдвиг по оси Y.
         */
        this.offsetY = 0;
        this.rotationAngleInRadians = 0;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        this.makeDefaulOffsetAndtSizes(squareSizes, comprassionRatio);
    }
    getContext() {
        return this.context;
    }
    /**
     * Устанавливаем сдвиг и размеры дисплея по умолчанию.
     * @param squareSizes флаг, который поднят, если размеры
     *                    дисплея должны быть квадратными. Иначе
     *                    его ширина и высота пропорциональны ширине
     *                    и высоте холста.
     * @returns
     */
    makeDefaulOffsetAndtSizes(squareSizes, comprassionRatio) {
        if (this.canvas == null) {
            return;
        }
        if (squareSizes) {
            this.width = Math.min(this.canvas.width, this.canvas.height) * comprassionRatio;
            this.height = Math.min(this.canvas.width, this.canvas.height) * comprassionRatio;
        }
        else {
            this.width = this.canvas.width * comprassionRatio;
            this.height = this.canvas.height * comprassionRatio;
        }
        this.offsetX = this.canvas.width * Display.DEFAULT_POSITION_RATIO;
        this.offsetY = this.canvas.height * Display.DEFAULT_POSITION_RATIO;
    }
    /**
     * Задаем холсту указанные размеры.
     * @param width ширина холста.
     * @param height высота холста.
     * @returns
     */
    adjustCanvasSizes(width, height) {
        if (this.canvas == null) {
            return;
        }
        this.canvas.width = width;
        this.canvas.height = height;
    }
    /**
     * Получаем сдвиг по оси X.
     * @returns упомянутый свдиг.
     */
    getOffsetX() {
        return this.offsetX;
    }
    /**
     * Получаем сдвиг по оси Y.
     * @returns упомянутый сдвиг.
     */
    getOffsetY() {
        return this.offsetY;
    }
    /**
     * Получаем ширину.
     * @returns упомянутая ширина.
     */
    getWidth() {
        return this.width;
    }
    /**
     * Получаем высоту.
     * @returns упомянутая высота.
     */
    getHeight() {
        return this.height;
    }
    getCanvasWidth() {
        return this.canvas.width;
    }
    getCanvasHeight() {
        return this.canvas.height;
    }
    /**
     * Меняем сдвиг на указанные расстояния по оси X и Y.
     * @param deltaX сдвиг по оси X.
     * @param deltaY сдвиг по сои Y.
     */
    changeOffset(deltaX, deltaY) {
        if ((Display.MIN_OFFSET_X <= this.offsetX + deltaX)
            && (this.offsetX + deltaX <= Display.MAX_OFFSET_X)) {
            this.offsetX += deltaX;
        }
        if ((Display.MIN_OFFSET_Y <= this.offsetY + deltaY)
            && (this.offsetY + deltaY <= Display.MAX_OFFSET_Y)) {
            this.offsetY += deltaY;
        }
    }
    /**
     * Увеличиваем размеры, если это возможно.
     * @returns true, если размеры были увеличины. Иначе - false.
     */
    increaseSizes() {
        if ((this.width * Display.INCREASE_SIZE_RATIO > Display.MAX_WIDTH)
            || (this.height * Display.INCREASE_SIZE_RATIO > Display.MAX_HEIGHT)) {
            return false;
        }
        else {
            this.width *= Display.INCREASE_SIZE_RATIO;
            this.height *= Display.INCREASE_SIZE_RATIO;
            return true;
        }
    }
    /**
     * Уменьшаем размеры, если это возможно.
     * @returns true, если размеры были уменьшены. Иначе - false.
     */
    decreaseSizes() {
        if ((this.width / Display.INCREASE_SIZE_RATIO < Display.MIN_WIDTH)
            || (this.height / Display.INCREASE_SIZE_RATIO) < Display.MIN_HEIGHT) {
            return false;
        }
        else {
            this.width /= Display.INCREASE_SIZE_RATIO;
            this.height /= Display.INCREASE_SIZE_RATIO;
            return true;
        }
    }
    setRotationAngleInRadians(rotationAngleInRadians) {
        this.rotationAngleInRadians = rotationAngleInRadians;
    }
    getRotationAngleInRadians() {
        return this.rotationAngleInRadians;
    }
    hideCanvas() {
        this.canvas.style.display = "none";
    }
    showCanvas() {
        this.canvas.style.display = "inline";
    }
    canvasIsVisible() {
        return this.canvas.style.display != "none";
    }
}
/**
 * Коэффициент сжатия изображения по умолчанию.
 */
// private static readonly DEFAULT_COMPRESSION_RATIO: number = 0.85
/**
 * Коэффициент, который задает позицию изображения по умолчанию.
 */
Display.DEFAULT_POSITION_RATIO = 0.5;
/**
 * Коэффициент увеличения размеров дисплея при
 * однократной прокрутке колесика мыши.
 */
Display.INCREASE_SIZE_RATIO = 1.2;
/**
 * Минимальная ширина.
 */
// private static readonly MIN_WIDTH: number = 1567
Display.MIN_WIDTH = 1000;
/**
 * Минимальная высота.
 */
// private static readonly MIN_HEIGHT: number = 1567
Display.MIN_HEIGHT = 100;
/**
 * Максимальная ширина.
 */
Display.MAX_WIDTH = 9705;
/**
 * Максмальная высота.
 */
Display.MAX_HEIGHT = 9705;
/**
 * Минимальный сдвиг по оси X.
 */
Display.MIN_OFFSET_X = -5254;
/**
 * Максимальный сдвиг по оси X.
 */
Display.MAX_OFFSET_X = 7585;
/**
 * Минимальный сдвиг по оси Y.
 */
Display.MIN_OFFSET_Y = -5309;
/**
 * Максимальный сдвиг по оси Y.
 */
Display.MAX_OFFSET_Y = 7140;
