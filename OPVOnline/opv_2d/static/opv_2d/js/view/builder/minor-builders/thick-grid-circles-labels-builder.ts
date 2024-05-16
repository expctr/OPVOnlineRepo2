/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за надписи толстых круговых линий координатной решетки.
*/

class ThickGridCirclesLabelsBuilder {
    private static readonly GRID_LINES_COLOR: Color = new Color(255, 255, 255, 1)

    private readonly THICK_GRID_LINES_LABELS_FONT: string = '60px Arial'

    public static thickGridCirclesLabelsBuilder: ThickGridCirclesLabelsBuilder
        = new ThickGridCirclesLabelsBuilder()

    private graphicalComposite: GraphicalComposite = new GraphicalComposite()

    private constructor() {
    }

    public build(visualizationDisplay: Display): void {
        this.graphicalComposite = new GraphicalComposite()

        let radiusVector: RadiusVector = new RadiusVector(
            0, 0, 0, -visualizationDisplay.getHeight() / 2)
        radiusVector.applyRotation(Math.PI / 12)
        let label = 50
        let l0
            = (new RadiusVector(0, 0,
                visualizationDisplay.getWidth() / 23, visualizationDisplay.getHeight() / 23)).getLength()

        for (let i = 0; i < 8; ++i) {
            if (i % 2 == 0) {
                this.graphicalComposite.add(new Label(
                    radiusVector.getArrowheadX(),
                    radiusVector.getArrowheadY(),
                    label.toString(),
                    ThickGridCirclesLabelsBuilder.GRID_LINES_COLOR,
                    new Color(0, 0, 0, 0),
                    60,
                    'Arial',
                    false,
                    0,
                    0
                ))
            }

            let ratio = (radiusVector.getLength() - l0) / radiusVector.getLength()
            radiusVector.applyHomothety(ratio)

            label += 5 // label += 5
        }
    }

    public getGraphicalComponent(): GraphicalComponent {
        return this.graphicalComposite;
    }
}