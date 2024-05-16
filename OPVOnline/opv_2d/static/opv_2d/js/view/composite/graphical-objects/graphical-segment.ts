/*
 * В данном файле содержится реализация графического объекта, который соответствует 
 * отрезку.
 */

class GraphicalSegment implements GraphicalComponent {
    private lineWidth: number

    private color: Color

    private x1: number

    private y1: number

    private x2: number

    private y2: number

    public constructor(lineWidth: number, color: Color, x1: number, y1: number, x2: number, y2: number) {
        this.lineWidth = lineWidth
        this.color = color
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
    }

    public doTraversal(visitor: Visitor): void {
        visitor.visitGraphicalSegment(this)
    }

    public draw(context: CanvasRenderingContext2D, display: Display): void {
        context.lineWidth = this.lineWidth
        context!.strokeStyle = this.color.toString()

        CoordinateAdapter.firstCoordinateAdapter.setDisplay(display)
        CoordinateAdapter.secondCoordinateAdapter.setDisplay(display)

        CoordinateAdapter.firstCoordinateAdapter.set(this.x1, this.y1, CoordinateSystem.DISPLAY_ROTATED)
        CoordinateAdapter.secondCoordinateAdapter.set(this.x2, this.y2, CoordinateSystem.DISPLAY_ROTATED)

        context.beginPath()
        context.moveTo(
            Math.ceil(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS)),
            Math.ceil(CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS))
        )
        context.lineTo(
            Math.ceil(CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS)),
            Math.ceil(CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS))
        )
        context.closePath()
        context.stroke()
    }
}