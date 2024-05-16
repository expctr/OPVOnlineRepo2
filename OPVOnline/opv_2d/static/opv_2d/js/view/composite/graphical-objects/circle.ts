/*
 * В данном файле содержится реализация графического объекта, который соответствует 
 * кругу.
 */

class Circle implements GraphicalComponent {
    private color: Color

    private fill: boolean

    private x1: number

    private y1: number

    private x2: number

    private y2: number

    private lineWidth: number

    public constructor(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        color: Color,
        fill: boolean,
        lineWidth: number) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
        this.color = color
        this.fill = fill
        this.lineWidth = lineWidth
    }

    doTraversal(visitor: Visitor): void {
        visitor.visitEllipse(this)
    }

    public draw(context: CanvasRenderingContext2D, display: Display): void {
        if (this.fill) {
            this.drawFill(context, display)
        } else {
            this.drawContour(context, display)
        }
    }

    private drawContour(context: CanvasRenderingContext2D, display: Display): void {
        context.strokeStyle = this.color.toString()
        context.lineWidth = this.lineWidth

        CoordinateAdapter.firstCoordinateAdapter.setDisplay(display)
        CoordinateAdapter.secondCoordinateAdapter.setDisplay(display)

        CoordinateAdapter.firstCoordinateAdapter.set(this.x1, this.y1, CoordinateSystem.DISPLAY_ROTATED)
        CoordinateAdapter.secondCoordinateAdapter.set(this.x2, this.y2, CoordinateSystem.DISPLAY_ROTATED)

        let x: number
            = (CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS)
                + CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS))
            / 2
        let y: number
            = (CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS)
                + CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS))
            / 2
        // let radiusX
        //     = Math.abs((CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS)
        //         - CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS))
        //         / 2)
        // let radiusY
        //     = Math.abs((CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS)
        //         - CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS))
        //         / 2)

        let diagonal
            = Math.sqrt(Math.pow(
                CoordinateAdapter
                    .firstCoordinateAdapter.getX(CoordinateSystem.CANVAS)
                - CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS),
                2) +
                Math.pow(
                    CoordinateAdapter
                        .firstCoordinateAdapter.getY(CoordinateSystem.CANVAS)
                    - CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS),
                    2))

        let radius = diagonal / Math.sqrt(8)

        let rotation = 0
        let startAngle = 0
        let endAngle = 2 * Math.PI

        context.beginPath()
        context.ellipse(
            x, y,
            radius, radius,
            rotation,
            startAngle,
            endAngle
        )
        context.closePath()
        context.stroke()
    }

    private drawFill(context: CanvasRenderingContext2D, display: Display): void {
        context.fillStyle = this.color.toString()

        CoordinateAdapter.firstCoordinateAdapter.setDisplay(display)
        CoordinateAdapter.secondCoordinateAdapter.setDisplay(display)

        CoordinateAdapter.firstCoordinateAdapter.set(this.x1, this.y1, CoordinateSystem.DISPLAY_ROTATED)
        CoordinateAdapter.secondCoordinateAdapter.set(this.x2, this.y2, CoordinateSystem.DISPLAY_ROTATED)

        let x: number
            = (CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS)
                + CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS))
            / 2
        let y: number
            = (CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS)
                + CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS))
            / 2
        // let radiusX
        //     = Math.abs((CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS)
        //         - CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS))
        //         / 2)
        // let radiusY
        //     = Math.abs((CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS)
        //         - CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS))
        //         / 2)

        let diagonal
            = Math.sqrt(Math.pow(
                CoordinateAdapter
                    .firstCoordinateAdapter.getX(CoordinateSystem.CANVAS)
                - CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.CANVAS),
                2) +
                Math.pow(
                    CoordinateAdapter
                        .firstCoordinateAdapter.getY(CoordinateSystem.CANVAS)
                    - CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.CANVAS),
                    2))

        let radius = diagonal / Math.sqrt(8)

        let rotation = 0
        let startAngle = 0
        let endAngle = 2 * Math.PI

        context.beginPath()
        context.ellipse(
            x, y,
            radius, radius,
            rotation,
            startAngle,
            endAngle
        )
        context.closePath()
        context.fill()
    }
}