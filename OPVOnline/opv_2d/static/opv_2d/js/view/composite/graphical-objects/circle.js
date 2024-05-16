"use strict";
class Circle {
    constructor(x1, y1, x2, y2, color, fill, lineWidth) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
        this.fill = fill;
        this.lineWidth = lineWidth;
    }
    doTraversal(visitor) {
        visitor.visitEllipse(this);
    }
    draw(context, display) {
        if (this.fill) {
            this.drawFill(context, display);
        }
        else {
            this.drawContour(context, display);
        }
    }
    drawContour(context, display) {
        context.strokeStyle = this.color.toString();
        context.lineWidth = this.lineWidth;
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(display);
        CoordinateAdapter.secondCoordinateAdapter.setDisplay(display);
        CoordinateAdapter.firstCoordinateAdapter.set(this.x1, this.y1, CoordinateSystem.DISPLAY_ROTATED);
        CoordinateAdapter.secondCoordinateAdapter.set(this.x2, this.y2, CoordinateSystem.DISPLAY_ROTATED);
        let x = (CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS)
            + CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS))
            / 2;
        let y = (CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS)
            + CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS))
            / 2;
        // let radiusX
        //     = Math.abs((CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS)
        //         - CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS))
        //         / 2)
        // let radiusY
        //     = Math.abs((CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS)
        //         - CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS))
        //         / 2)
        let diagonal = Math.sqrt(Math.pow(CoordinateAdapter
            .firstCoordinateAdapter.getX(CoordinateSystem.CANVAS)
            - CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS), 2) +
            Math.pow(CoordinateAdapter
                .firstCoordinateAdapter.getY(CoordinateSystem.CANVAS)
                - CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS), 2));
        let radius = diagonal / Math.sqrt(8);
        let rotation = 0;
        let startAngle = 0;
        let endAngle = 2 * Math.PI;
        context.beginPath();
        context.ellipse(x, y, radius, radius, rotation, startAngle, endAngle);
        context.closePath();
        context.stroke();
    }
    drawFill(context, display) {
        context.fillStyle = this.color.toString();
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(display);
        CoordinateAdapter.secondCoordinateAdapter.setDisplay(display);
        CoordinateAdapter.firstCoordinateAdapter.set(this.x1, this.y1, CoordinateSystem.DISPLAY_ROTATED);
        CoordinateAdapter.secondCoordinateAdapter.set(this.x2, this.y2, CoordinateSystem.DISPLAY_ROTATED);
        let x = (CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS)
            + CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS))
            / 2;
        let y = (CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS)
            + CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS))
            / 2;
        // let radiusX
        //     = Math.abs((CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS)
        //         - CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS))
        //         / 2)
        // let radiusY
        //     = Math.abs((CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS)
        //         - CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS))
        //         / 2)
        let diagonal = Math.sqrt(Math.pow(CoordinateAdapter
            .firstCoordinateAdapter.getX(CoordinateSystem.CANVAS)
            - CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS), 2) +
            Math.pow(CoordinateAdapter
                .firstCoordinateAdapter.getY(CoordinateSystem.CANVAS)
                - CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS), 2));
        let radius = diagonal / Math.sqrt(8);
        let rotation = 0;
        let startAngle = 0;
        let endAngle = 2 * Math.PI;
        context.beginPath();
        context.ellipse(x, y, radius, radius, rotation, startAngle, endAngle);
        context.closePath();
        context.fill();
    }
}
