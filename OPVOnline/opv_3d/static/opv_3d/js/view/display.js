"use strict";
/*
 * В данном файле содержится дисплей.
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
    constructor(canvas, width, height, squareSizes, comressionRatio) {
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
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        this.makeDefaulOffsetAndtSizes(squareSizes, comressionRatio);
    }
    /**
     * Устанавливаем сдвиг и размеры дисплея по умолчанию.
     * @param squareSizes флаг, который поднят, если размеры
     *                    дисплея должны быть квадратными. Иначе
     *                    его ширина и высота пропорциональны ширине
     *                    и высоте холста.
     * @returns
     */
    makeDefaulOffsetAndtSizes(squareSizes, compressionRatio) {
        if (this.canvas == null) {
            return;
        }
        if (squareSizes) {
            this.width = Math.min(this.canvas.width, this.canvas.height) * compressionRatio;
            this.height = Math.min(this.canvas.width, this.canvas.height) * compressionRatio;
        }
        else {
            this.width = this.canvas.width * compressionRatio;
            this.height = this.canvas.height * compressionRatio;
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
    /**
     * Очищаем изображение.
     * @returns
     */
    clear() {
        // console.log("context:")
        // console.log(this.context)
        // console.log("canvas:")
        // console.log(this.canvas)
        if (this.context == null) {
            return;
        }
        if (this.canvas == null) {
            return;
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = 'rgb(39, 39, 39)';
        this.context.moveTo(0, 0);
        this.context.lineTo(this.canvas.width, 0);
        this.context.lineTo(this.canvas.width, this.canvas.height);
        this.context.lineTo(0, this.canvas.height);
        this.context.lineTo(0, 0);
        this.context.closePath();
        this.context.fill();
        // console.log("ok")
    }
    /**
     * Закрашиваем эллипс.
     * @param x1 координата x левой верхней вершины прямоугольника, в который должен быть вписан эллипс.
     * @param y1 координата y левой верхней вершины прямоугольника, в который должен быть вписан эллипс.
     * @param x2 координата x правой нижней вершины прямоугольника, в который должен быть вписан эллипс.
     * @param y2 координата y правой нижней вершины прямоугольника, в который должен быть вписан эллипс.
     * @param color строковое представление цвета, в который надо закрасить эллипс.
     * @returns
     */
    fillEllipse(x1, y1, x2, y2, color) {
        if (!this.context) {
            return;
        }
        this.context.fillStyle = color;
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.secondCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.firstCoordinateAdapter.set(x1, y1, CoordinateSystem.DISPLAY);
        CoordinateAdapter.secondCoordinateAdapter.set(x2, y2, CoordinateSystem.DISPLAY);
        let x = (CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS)
            + CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS))
            / 2;
        let y = (CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS)
            + CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS))
            / 2;
        let radiusX = (CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS)
            - CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS))
            / 2;
        let radiusY = (CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS)
            - CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS))
            / 2;
        let rotation = 0;
        let startAngle = 0;
        let endAngle = 2 * Math.PI;
        this.context.beginPath();
        this.context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
        this.context.closePath();
        this.context.fill();
    }
    /**
     * Закрашиваем прямоугольник.
     * @param x1 координата x левой верхней вершины прямоугольника.
     * @param y1 координата y левой верхней вершины прямоугольника.
     * @param x2 коррдината x правой нижней вершины прямоугольника.
     * @param y2 координата y правой нижней вершины прямоугольника.
     * @param color строковое представление цвета, в который надо закрасить прямоугольник.
     * @returns
     */
    fillRectangle(x1, y1, x2, y2, color) {
        if (!this.context) {
            return;
        }
        this.context.fillStyle = color;
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.secondCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.firstCoordinateAdapter.set(x1, y1, CoordinateSystem.DISPLAY);
        CoordinateAdapter.secondCoordinateAdapter.set(x2, y2, CoordinateSystem.DISPLAY);
        this.context.beginPath();
        this.context.moveTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        this.context.lineTo(CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        this.context.lineTo(CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        this.context.lineTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        this.context.moveTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        this.context.closePath();
        this.context.fill();
    }
    /**
     * Пишем текст на холсте.
     * @param text текст, который нужно написать.
     * @param x координата x левой верхней вершины прямоугольника, в который нужно вписать текст.
     *          Координата задается в системе отсчета дисплея.
     * @param y координата y левой верхней вершины прямоугольника, в который нужно вписать текст.
     *          Координата задается в системе отсчета дисплея.
     * @param color строковое представление цвета, в который должен быть открашен текст.
     * @param font шрифт текста.
     * @returns
     */
    fillText(text, x, y, color, font) {
        if (!this.context) {
            return;
        }
        this.context.fillStyle = color;
        this.context.font = font;
        this.context.textBaseline = 'hanging';
        let width = this.context.measureText(text).width;
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.firstCoordinateAdapter.set(x, y, CoordinateSystem.DISPLAY);
        this.context.fillText(text, CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS) - width / 2, CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS) - width / 2);
    }
    fillText2(text, x, y, color, font) {
        if (!this.context) {
            return;
        }
        this.context.fillStyle = color;
        this.context.font = font;
        this.context.textBaseline = 'hanging';
        let width = this.context.measureText(text).width;
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.firstCoordinateAdapter.set(x, y, CoordinateSystem.DISPLAY);
        this.context.fillText(text, CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
    }
    /**
     * Пишем текст на холсте.
     * @param text текст, который нужно написать.
     * @param x координата x левой верхней вершины прямоугольника, в который нужно вписать текст.
     *          Координата задается в системе отсчета холста.
     * @param y координата y левой верхней вершины прямоугольника, в который нужно вписать текст.
     *          Координата задается в системе отсчета холста.
     * @param color строковое представление цвета, в который должен быть открашен текст.
     * @param font шрифт текста.
     * @returns
     */
    fillTextCanvas(text, x, y, color, font) {
        if (!this.context) {
            return;
        }
        this.context.fillStyle = color;
        this.context.font = font;
        this.context.textBaseline = 'hanging';
        this.context.fillRect(x, y, this.context.measureText(text).width, 48);
        this.context.fillText(text, x, y);
    }
    /**
     * Изображаем на холсте надпись с фоном.
     * @param text текст надписи.
     * @param x координата x левой верхней вершины прямоугольника, внутри которого нужно отобразить надпись.
     * @param y координата y левой верхней вершины прямоугольника, внутри которого нужно отобразить надпись.
     * @param labelColor цвет фона надписи.
     * @param textColor цвет текста надписи.
     * @param fontSize шрифт надписи.
     * @param fontName название шрифта надписи.
     * @returns
     */
    fillLabel(text, x, y, labelColor, textColor, fontSize, fontName) {
        if (!this.context) {
            return;
        }
        this.context.fillStyle = labelColor;
        this.context.fillRect(x - 5, y - 5, this.context.measureText(text).width - 60, fontSize);
        this.context.fillStyle = textColor;
        this.context.font = fontSize + 'px ' + fontName;
        this.context.textBaseline = 'hanging';
        this.context.fillText(text, x, y);
    }
    /**
     * Рисуем эллипс.
     * @param x1 координата x левой верхней вершины прямоугольника, в который нужно вписать эллипс.
     * @param y1 координата y левой верхней вершины прямоугольника, в который нужно вписать эллипс.
     * @param x2 координата x правой нижней вершины прямоугольника, в который нужно вписать эллипс.
     * @param y2 координата y правой нижней вершины прямоугольника, в который нужно вписать эллипс.
     * @param color строковое представление цвета эллипса.
     * @param lineWidth ширины линии.
     * @returns
     */
    drawEllipse(x1, y1, x2, y2, color, lineWidth) {
        if (!this.context) {
            return;
        }
        this.context.strokeStyle = color;
        this.context.lineWidth = lineWidth;
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.secondCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.firstCoordinateAdapter.set(x1, y1, CoordinateSystem.DISPLAY);
        CoordinateAdapter.secondCoordinateAdapter.set(x2, y2, CoordinateSystem.DISPLAY);
        let x = (CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS)
            + CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS))
            / 2;
        let y = (CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS)
            + CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS))
            / 2;
        let radiusX = (CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS)
            - CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS))
            / 2;
        let radiusY = (CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS)
            - CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS))
            / 2;
        let rotation = 0;
        let startAngle = 0;
        let endAngle = 2 * Math.PI;
        this.context.beginPath();
        this.context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
        this.context.closePath();
        this.context.stroke();
    }
    /**
     * Рисуем прямую линию.
     * @param x1 координата x первого конца линии.
     * @param y1  координата y первого конца линии.
     * @param x2 координата x второго конца линии.
     * @param y2 координата y второго конца линии.
     * @param lineWidth ширина линии.
     * @param color цвет линии.
     * @returns
     */
    drawLine(x1, y1, x2, y2, lineWidth, color) {
        if (!this.context) {
            return;
        }
        this.context.lineWidth = lineWidth;
        this.context.strokeStyle = color;
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.secondCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.firstCoordinateAdapter.set(x1, y1, CoordinateSystem.DISPLAY);
        CoordinateAdapter.secondCoordinateAdapter.set(x2, y2, CoordinateSystem.DISPLAY);
        this.context.beginPath();
        this.context.moveTo(Math.ceil(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS)), Math.ceil(CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS)));
        this.context.lineTo(Math.ceil(CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS)), Math.ceil(CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS)));
        this.context.closePath();
        this.context.stroke();
    }
    /**
     * Закрашиваем четырехугольник.
     * @param x1 координата x первой вершины прямоугольника.
     * @param y1 координата y первой вершины прямоугольника.
     * @param x2 координата x второй вершины прямоугольника.
     * @param y2 координата y второй вершины прямоугольника.
     * @param x3 координата x третей вершины прямоугольника.
     * @param y3 координата y третей вершины прямоугольника.
     * @param x4 координата x четвертой вершины прямоугольника.
     * @param y4 координата y четвертой вершины прямоугольника.
     * @param color строковое представление цвета четырехугольника.
     * @returns
     */
    fillTetragon(x1, y1, x2, y2, x3, y3, x4, y4, color) {
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.secondCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.thirdCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.fourthCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.firstCoordinateAdapter.set(x1, y1, CoordinateSystem.DISPLAY);
        CoordinateAdapter.secondCoordinateAdapter.set(x2, y2, CoordinateSystem.DISPLAY);
        CoordinateAdapter.thirdCoordinateAdapter.set(x3, y3, CoordinateSystem.DISPLAY);
        CoordinateAdapter.fourthCoordinateAdapter.set(x4, y4, CoordinateSystem.DISPLAY);
        if (this.context != null) {
            this.context.fillStyle = color.toString();
            this.context.lineWidth = 1;
            this.context.beginPath();
            this.context.moveTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
            this.context.lineTo(CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS));
            this.context.lineTo(CoordinateAdapter.thirdCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.thirdCoordinateAdapter.getY(CoordinateSystem.CANVAS));
            this.context.lineTo(CoordinateAdapter.fourthCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.fourthCoordinateAdapter.getY(CoordinateSystem.CANVAS));
            this.context.moveTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
            this.context.closePath();
            this.context.fill();
        }
        else if (this.gl != null) {
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
                CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.WEBGL),
                CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.WEBGL),
                CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.WEBGL),
                CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.WEBGL),
                CoordinateAdapter.fourthCoordinateAdapter.getX(CoordinateSystem.WEBGL),
                CoordinateAdapter.fourthCoordinateAdapter.getY(CoordinateSystem.WEBGL),
                CoordinateAdapter.fourthCoordinateAdapter.getX(CoordinateSystem.WEBGL),
                CoordinateAdapter.fourthCoordinateAdapter.getY(CoordinateSystem.WEBGL),
                CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.WEBGL),
                CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.WEBGL),
                CoordinateAdapter.thirdCoordinateAdapter.getX(CoordinateSystem.WEBGL),
                CoordinateAdapter.thirdCoordinateAdapter.getY(CoordinateSystem.WEBGL),
            ]), this.gl.STATIC_DRAW);
            //@ts-ignore
            this.gl.uniform4f(colorUniformLocation, color.getRedRatio(), color.getGreenRatio(), color.getBlueRatio(), 1);
            var primitiveType = this.gl.TRIANGLES;
            var offset = 0;
            var count = 6;
            this.gl.drawArrays(primitiveType, offset, count);
        }
    }
    fillPolygon(points, color) {
        if (this.context == null) {
            return;
        }
        this.context.fillStyle = color;
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.firstCoordinateAdapter.set(points[0].x, points[0].y, CoordinateSystem.DISPLAY);
        this.context.beginPath();
        this.context.moveTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        for (let i = 1; i < points.length; ++i) {
            CoordinateAdapter.firstCoordinateAdapter.set(points[i].x, points[i].y, CoordinateSystem.DISPLAY);
            this.context.lineTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        }
        CoordinateAdapter.firstCoordinateAdapter.set(points[0].x, points[0].y, CoordinateSystem.DISPLAY);
        this.context.lineTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        this.context.closePath();
        this.context.fill();
    }
    drawPolygon(points, lineWidth, color) {
        if (this.context == null) {
            return;
        }
        this.context.lineWidth = lineWidth;
        this.context.strokeStyle = color;
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.firstCoordinateAdapter.set(points[0].x, points[0].y, CoordinateSystem.DISPLAY);
        this.context.beginPath();
        this.context.moveTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        for (let i = 1; i < points.length; ++i) {
            CoordinateAdapter.firstCoordinateAdapter.set(points[i].x, points[i].y, CoordinateSystem.DISPLAY);
            this.context.lineTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        }
        CoordinateAdapter.firstCoordinateAdapter.set(points[0].x, points[0].y, CoordinateSystem.DISPLAY);
        this.context.lineTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        this.context.closePath();
        this.context.stroke();
    }
    drawBrokenLine(points, lineWidth, color) {
        if (this.context == null) {
            return;
        }
        this.context.lineWidth = lineWidth;
        this.context.strokeStyle = color;
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(this);
        CoordinateAdapter.firstCoordinateAdapter.set(points[0].x, points[0].y, CoordinateSystem.DISPLAY);
        this.context.beginPath();
        this.context.moveTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        for (let i = 1; i < points.length; ++i) {
            CoordinateAdapter.firstCoordinateAdapter.set(points[i].x, points[i].y, CoordinateSystem.DISPLAY);
            this.context.lineTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        }
        this.context.stroke();
        this.context.closePath();
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
