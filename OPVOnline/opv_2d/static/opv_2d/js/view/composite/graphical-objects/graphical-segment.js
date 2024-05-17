"use strict";
/*
 * В данном файле содержится реализация графического объекта, который соответствует
 * отрезку.
 */
class GraphicalSegment {
    constructor(lineWidth, color, x1, y1, x2, y2) {
        this.lineWidth = lineWidth;
        this.color = color;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    doTraversal(visitor) {
        visitor.visitGraphicalSegment(this);
    }
    draw(context, display) {
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.color.toString();
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(display);
        CoordinateAdapter.secondCoordinateAdapter.setDisplay(display);
        CoordinateAdapter.firstCoordinateAdapter.set(this.x1, this.y1, CoordinateSystem.DISPLAY_ROTATED);
        CoordinateAdapter.secondCoordinateAdapter.set(this.x2, this.y2, CoordinateSystem.DISPLAY_ROTATED);
        context.beginPath();
        context.moveTo(Math.ceil(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS)), Math.ceil(CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS)));
        context.lineTo(Math.ceil(CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS)), Math.ceil(CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS)));
        context.closePath();
        context.stroke();
    }
}
