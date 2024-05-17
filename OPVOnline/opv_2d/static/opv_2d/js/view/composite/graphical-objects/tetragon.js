"use strict";
/*
 * В данном файле содержится реализация графического объекта, который соответствует
 * четырехугольнику.
 */
class Tetragon {
    constructor(x1, y1, x2, y2, x3, y3, x4, y4, color) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
        this.x4 = x4;
        this.y4 = y4;
        this.color = color;
    }
    doTraversal(visitor) {
        visitor.visitTetragon(this);
    }
    draw(context, display) {
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(display);
        CoordinateAdapter.secondCoordinateAdapter.setDisplay(display);
        CoordinateAdapter.thirdCoordinateAdapter.setDisplay(display);
        CoordinateAdapter.fourthCoordinateAdapter.setDisplay(display);
        CoordinateAdapter.firstCoordinateAdapter.set(this.x1, this.y1, CoordinateSystem.DISPLAY_ROTATED);
        CoordinateAdapter.secondCoordinateAdapter.set(this.x2, this.y2, CoordinateSystem.DISPLAY_ROTATED);
        CoordinateAdapter.thirdCoordinateAdapter.set(this.x3, this.y3, CoordinateSystem.DISPLAY_ROTATED);
        CoordinateAdapter.fourthCoordinateAdapter.set(this.x4, this.y4, CoordinateSystem.DISPLAY_ROTATED);
        context.fillStyle = this.color.toString();
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        context.lineTo(CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        context.lineTo(CoordinateAdapter.thirdCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.thirdCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        context.lineTo(CoordinateAdapter.fourthCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.fourthCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        context.moveTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        context.closePath();
        context.fill();
    }
}
