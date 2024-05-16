/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за сглаженную границу аврорального овала.
*/

class SmoothMarginBuilder {
    private static readonly MARGIN_WIDTH: number = 10

    public static smoothMarginBuilder: SmoothMarginBuilder = new SmoothMarginBuilder()

    private graphicalComposite: GraphicalComposite = new GraphicalComposite()

    private constructor() {
    }

    public build(middleMarginSegments: Segment[], color: Color, visualizationDisplay: Display): void {
        this.graphicalComposite = new GraphicalComposite()

        for (let i = 0; i < middleMarginSegments.length; ++i) {
            let middleSegment = middleMarginSegments[i]

            if (middleSegment.getFirstNeighbour() != null) {
                this.buildBezierCurve(
                    middleSegment.getFirstNeighbour()!.getMiddle(),
                    // @ts-ignore
                    middleSegment.getIntersectionWithFirstNeighbour(),
                    middleSegment.getMiddle(),
                    color
                )
            }

            if (middleSegment.getSecondNeighbour() != null) {
                this.buildBezierCurve(
                    middleSegment.getMiddle(),
                    // @ts-ignore
                    middleSegment.getIntersectionWithSecondNeighbour(),
                    middleSegment.getSecondNeighbour()?.getMiddle(),
                    color
                )
            }
        }
    }

    private buildBezierCurve(
        firstPoint: Point,
        secondPoint: Point,
        thirdPoint: Point,
        color: Color,
    ): void {
        let firstSegment = new Segment(firstPoint, secondPoint, null)
        let secondSegment = new Segment(secondPoint, thirdPoint, null)

        let previousPoint: Point | null = null

        for (let t = 0; t <= 1; t += 0.01) {
            let intermediateSegment = new Segment(
                firstSegment.getRatioPoint(t),
                secondSegment.getRatioPoint(t),
                null)
            let currentPoint = intermediateSegment.getRatioPoint(t)

            if (previousPoint != null) {
                this.graphicalComposite.add(new GraphicalSegment(
                    SmoothMarginBuilder.MARGIN_WIDTH,
                    color,
                    previousPoint.x,
                    previousPoint.y,
                    currentPoint.x,
                    currentPoint.y,
                ))
            }

            previousPoint = currentPoint
        }
    }

    public getGraphicalComponent(): GraphicalComponent {
        return this.graphicalComposite;
    }
}