/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает надписи толстых прямых линий координатной решетки.
*/

class ThickGridLinesLabelsBuilder {
    private static readonly THICK_GRID_LINES_LABELS_COLOR: Color
        = new Color(255, 255, 255, 1)

    private readonly THICK_GRID_LINES_LABELS_FONT: string = '60px Arial'

    public static thickGridLinesLabelsBuilder: ThickGridLinesLabelsBuilder
        = new ThickGridLinesLabelsBuilder()

    private graphicalComposite: GraphicalComposite = new GraphicalComposite()

    private constructor() {
    }

    public build(visualizationDisplay: Display): void {
        this.graphicalComposite = new GraphicalComposite()

        let radiusVector: RadiusVector = new RadiusVector(
            0, 0, 0, -visualizationDisplay.getHeight() / 2 * 1.05)
        let stepAngle = Math.PI / 4
        let label = 0

        radiusVector.applyHomothety(1.02)

        for (let i = 0; i < 8; ++i) {
            this.graphicalComposite.add(new Label(
                radiusVector.getArrowheadX(), // - 30
                radiusVector.getArrowheadY(), // + 10
                label.toString(),
                ThickGridLinesLabelsBuilder.THICK_GRID_LINES_LABELS_COLOR,
                new Color(0, 0, 0, 0),
                60,
                'Arial',
                true,
                0,
                0
            ))

            radiusVector.applyRotation(stepAngle)
            label += 3
        }
    }

    public getGraphicalComponent(): GraphicalComponent {
        return this.graphicalComposite;
    }
}