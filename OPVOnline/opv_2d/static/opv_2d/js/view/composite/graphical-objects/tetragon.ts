/*
 * В данном файле содержится реализация графического объекта, который соответствует 
 * четырехугольнику.
 */

class Tetragon implements GraphicalComponent {
    private x1: number

    private y1: number

    private x2: number

    private y2: number

    private x3: number

    private y3: number

    private x4: number

    private y4: number

    private color: Color

    public constructor(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        x3: number,
        y3: number,
        x4: number,
        y4: number,
        color: Color) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
        this.x3 = x3
        this.y3 = y3
        this.x4 = x4
        this.y4 = y4
        this.color = color
    }

    public doTraversal(visitor: Visitor): void {
        visitor.visitTetragon(this)
    }

    public draw(context: CanvasRenderingContext2D, display: Display): void {
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(display)
        CoordinateAdapter.secondCoordinateAdapter.setDisplay(display)
        CoordinateAdapter.thirdCoordinateAdapter.setDisplay(display)
        CoordinateAdapter.fourthCoordinateAdapter.setDisplay(display)

        CoordinateAdapter.firstCoordinateAdapter.set(this.x1, this.y1, CoordinateSystem.DISPLAY_ROTATED)
        CoordinateAdapter.secondCoordinateAdapter.set(this.x2, this.y2, CoordinateSystem.DISPLAY_ROTATED)
        CoordinateAdapter.thirdCoordinateAdapter.set(this.x3, this.y3, CoordinateSystem.DISPLAY_ROTATED)
        CoordinateAdapter.fourthCoordinateAdapter.set(this.x4, this.y4, CoordinateSystem.DISPLAY_ROTATED)

        context.fillStyle = this.color.toString()
        context.lineWidth = 1

        context.beginPath()
        context.moveTo(
            CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS),
            CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS)
        )
        context.lineTo(
            CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS),
            CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS)
        )
        context.lineTo(
            CoordinateAdapter.thirdCoordinateAdapter.getX(CoordinateSystem.CANVAS),
            CoordinateAdapter.thirdCoordinateAdapter.getY(CoordinateSystem.CANVAS)
        )
        context.lineTo(
            CoordinateAdapter.fourthCoordinateAdapter.getX(CoordinateSystem.CANVAS),
            CoordinateAdapter.fourthCoordinateAdapter.getY(CoordinateSystem.CANVAS)
        )
        context.moveTo(
            CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS),
            CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS)
        )

        context.closePath()
        context.fill()
    }
}