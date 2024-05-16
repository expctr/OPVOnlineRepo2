/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за толстые прямые линии координатной решетки.
*/

class ThickGridLinesBuilder {
    private static readonly THICK_GRID_LINES_WIDTH: number = 2.5

    private static readonly GRID_LINES_COLOR: Color = new Color(255, 255, 255, 1)

    public static thickGridLinesBuilder: ThickGridLinesBuilder = new ThickGridLinesBuilder()

    private graphicalComposite: GraphicalComposite = new GraphicalComposite()

    private constructor() {
    }

    public build(visualizationDisplay: Display): void {
        this.graphicalComposite = new GraphicalComposite()

        let radiusVector: RadiusVector = new RadiusVector(
            0, 0, 0, visualizationDisplay.getHeight() / 2)
        let stepAngle = Math.PI / 12 * 3

        for (let i = 0; i < 24; ++i) {
            this.graphicalComposite.add(new GraphicalSegment(
                ThickGridLinesBuilder.THICK_GRID_LINES_WIDTH,
                ThickGridLinesBuilder.GRID_LINES_COLOR,
                0,
                0,
                radiusVector.getArrowheadX(),
                radiusVector.getArrowheadY(),
            ))

            radiusVector.applyRotation(stepAngle)
        }
    }

    public getGraphicalComponent(): GraphicalComponent {
        return this.graphicalComposite;
    }
}