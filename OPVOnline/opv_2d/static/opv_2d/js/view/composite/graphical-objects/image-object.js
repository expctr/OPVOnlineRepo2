"use strict";
class ImageObject {
    constructor(image, dx, dy, dWidth, dHeight, rotationAngle, imageOnloadListener) {
        this.dx = dx;
        this.dy = dy;
        this.dWidth = dWidth;
        this.dHeight = dHeight;
        this.rotationAngle = rotationAngle;
        this.image = image;
        this.rotationAngle = rotationAngle;
    }
    doTraversal(visitor) {
        visitor.visitImage(this);
    }
    draw(context, display) {
        context.translate(this.dx + this.dWidth / 2, this.dy + this.dHeight / 2);
        context.rotate(this.rotationAngle);
        context.drawImage(this.image, -this.dWidth / 2, -this.dHeight / 2, this.dWidth, this.dHeight);
        context.rotate(-this.rotationAngle);
        context.translate(-(this.dx + this.dWidth / 2), -(this.dy + this.dHeight / 2));
        // context.drawImage(this.image, this.dx, this.dy, this.dWidth, this.dHeight)
    }
}
