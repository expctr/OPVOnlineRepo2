"use strict";
/*
 * В данном файле содержится реализация графического объекта, который соответствует
 * надписи.
 */
class Label {
    // private deltaX: number
    // private deltaY: number
    constructor(x, y, 
    // deltaX: number,
    // deltaY: number,
    text, textColor, fillColor, fontSize, fontName, centerText, offsetX, offsetY) {
        this.x = x;
        this.y = y;
        // this.deltaX = deltaX
        // this.deltaY = deltaY
        this.text = text;
        this.textColor = textColor;
        this.fillColor = fillColor;
        this.fontSize = fontSize;
        this.fontName = fontName;
        this.centerText = centerText;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
    doTraversal(visitor) {
        visitor.visitLabel(this);
    }
    draw(context, display) {
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(display);
        CoordinateAdapter.firstCoordinateAdapter.set(this.x, this.y, CoordinateSystem.DISPLAY_ROTATED);
        let width = context.measureText(this.text).width;
        context.fillStyle = this.fillColor.toString();
        context.fillRect(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS) - 5, CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS) - 5, context.measureText(this.text).width + 90, this.fontSize);
        context.fillStyle = this.textColor.toString();
        context.font = this.fontSize + 'px ' + this.fontName;
        context.textBaseline = this.centerText ? 'middle' : 'hanging';
        context.fillText(this.text, CoordinateAdapter.firstCoordinateAdapter
            .getX(CoordinateSystem.CANVAS)
            - (this.centerText
                ? width / 2
                : 0)
            + this.offsetX, CoordinateAdapter.firstCoordinateAdapter
            .getY(CoordinateSystem.CANVAS)
            + this.offsetY); // - width / 2
    }
}
