/*
 * В данном файле содержится реализация графического объекта, который соответствует 
 * ломаной линии.
 */

class BrokenLine implements GraphicalComponent {
    private lineWidth: number

    private color: Color

    private points: Point[]

    public constructor(fill: boolean, lineWidth: number, color: Color, points: Point[]) {
        this.lineWidth = lineWidth
        this.color = color
        this.points = points
    }

    doTraversal(visitor: Visitor): void {
        visitor.visitBrokenLine(this)
    }

    public draw(context: CanvasRenderingContext2D, display: Display): void {
        context!.lineWidth = this.lineWidth
        context.strokeStyle = this.color.toString()

        CoordinateAdapter.firstCoordinateAdapter.setDisplay(display)
        CoordinateAdapter.firstCoordinateAdapter.set(this.points[0].x, this.points[0].y, CoordinateSystem.DISPLAY_ROTATED)

        context.beginPath()

        context.moveTo(
            CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS),
            CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS)
        )

        for (let i = 1; i < this.points.length; ++i) {
            CoordinateAdapter.firstCoordinateAdapter.set(this.points[i].x, this.points[i].y, CoordinateSystem.DISPLAY_ROTATED)
            context.lineTo(
                CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS),
                CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS)
            )
        }

        context.stroke()
        context.closePath()
    }
}