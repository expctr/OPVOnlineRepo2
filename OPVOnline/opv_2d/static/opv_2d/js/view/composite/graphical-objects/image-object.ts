/*
 * В данном файле содержится реализация графического объекта, который соответствует 
 * картинке.
 */

class ImageObject {
    // private image: HTMLImageElement

    private dx: number

    private dy: number

    private dWidth: number

    private dHeight: number

    private image: HTMLImageElement

    private rotationAngle: number

    public constructor(
        image: HTMLImageElement,
        dx: number,
        dy: number,
        dWidth: number,
        dHeight: number,
        rotationAngle: number,
        imageOnloadListener: () => void) {
        this.dx = dx
        this.dy = dy
        this.dWidth = dWidth
        this.dHeight = dHeight
        this.rotationAngle = rotationAngle
        this.image = image
        this.rotationAngle = rotationAngle
    }

    public doTraversal(visitor: Visitor): void {
        visitor.visitImage(this)
    }

    public draw(context: CanvasRenderingContext2D, display: Display): void {
        context.translate(this.dx + this.dWidth / 2,
            this.dy + this.dHeight / 2);
        context.rotate(this.rotationAngle);
        context.drawImage(this.image, -this.dWidth / 2, -this.dHeight / 2, this.dWidth, this.dHeight);
        context.rotate(-this.rotationAngle);
        context.translate(-(this.dx + this.dWidth / 2),
            -(this.dy + this.dHeight / 2));

        // context.drawImage(this.image, this.dx, this.dy, this.dWidth, this.dHeight)
    }
}