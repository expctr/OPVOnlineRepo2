"use strict";
class BrokenLine {
    constructor(fill, lineWidth, color, points) {
        this.lineWidth = lineWidth;
        this.color = color;
        this.points = points;
    }
    doTraversal(visitor) {
        visitor.visitBrokenLine(this);
    }
    draw(context, display) {
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.color.toString();
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(display);
        CoordinateAdapter.firstCoordinateAdapter.set(this.points[0].x, this.points[0].y, CoordinateSystem.DISPLAY_ROTATED);
        context.beginPath();
        context.moveTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        for (let i = 1; i < this.points.length; ++i) {
            CoordinateAdapter.firstCoordinateAdapter.set(this.points[i].x, this.points[i].y, CoordinateSystem.DISPLAY_ROTATED);
            context.lineTo(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS), CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS));
        }
        context.stroke();
        context.closePath();
    }
}
