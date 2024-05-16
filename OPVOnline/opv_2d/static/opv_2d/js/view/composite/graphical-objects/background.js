"use strict";
class Background {
    constructor(color) {
        this.color = color;
    }
    doTraversal(visitor) {
        visitor.visitBackground(this);
    }
    draw(context, display) {
        context.clearRect(0, 0, display.canvas.width, display.canvas.height);
        // context.fillStyle = 'rgb(39, 39, 39)'
        context.fillStyle = this.color.toString();
        context.moveTo(0, 0);
        context.lineTo(display.canvas.width, 0);
        context.lineTo(display.canvas.width, display.canvas.height);
        context.lineTo(0, display.canvas.height);
        context.lineTo(0, 0);
        context.closePath();
        context.fill();
    }
}
