/*
 * В данном файле содержится реализация графического объекта, который соответствует 
 * фону.
 */

class Background implements GraphicalComponent {
    private color: Color

    public constructor(color: Color) {
        this.color = color
    }

    public doTraversal(visitor: Visitor): void {
        visitor.visitBackground(this)
    }

    public draw(context: CanvasRenderingContext2D, display: Display): void {
        context.clearRect(0, 0, display.canvas!.width, display.canvas!.height)

        // context.fillStyle = 'rgb(39, 39, 39)'
        context.fillStyle = this.color.toString()

        context.moveTo(0, 0)
        context.lineTo(display.canvas!.width, 0)
        context.lineTo(display.canvas!.width, display.canvas!.height)
        context.lineTo(0, display.canvas!.height)
        context.lineTo(0, 0)

        context.closePath()
        context.fill()
    }
}