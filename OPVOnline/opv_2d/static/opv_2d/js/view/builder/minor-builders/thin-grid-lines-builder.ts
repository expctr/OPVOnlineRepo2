/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за тонкие прямые линии координатной решетки.
*/

class ThinGridLinesBuilder {
    private static readonly THIN_GRID_LINES_WIDTH: number = 0.5

    private static readonly GRID_LINES_COLOR: Color = new Color(255, 255, 255, 1)

    public static thinGridLinesBuilder: ThinGridLinesBuilder = new ThinGridLinesBuilder()

    private graphicalComposite: GraphicalComposite = new GraphicalComposite()

    private constructor() {
    }

    public build(visualizationDisplay: Display): void {
        this.graphicalComposite = new GraphicalComposite()

        let radiusVector: RadiusVector = new RadiusVector(
            0, 0, 0, visualizationDisplay.getHeight() / 2)
        let stepAngle = Math.PI / 48

        for (let i = 0; i < 96; ++i) {
            this.graphicalComposite.add(new GraphicalSegment(
                ThinGridLinesBuilder.THIN_GRID_LINES_WIDTH,
                ThinGridLinesBuilder.GRID_LINES_COLOR,
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