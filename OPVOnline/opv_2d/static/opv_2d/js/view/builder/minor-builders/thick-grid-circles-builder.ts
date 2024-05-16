/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за толстые круговые линии координатной решетки.
*/

class ThickGridCirclesBuilder {
    private static readonly GRID_LINES_COLOR: Color = new Color(255, 255, 255, 1)

    private static readonly THICK_GRID_LINES_WIDTH: number = 2.5

    public static thickGridCirclesBuilder: ThickGridCirclesBuilder
        = new ThickGridCirclesBuilder()

    private graphicalComposite: GraphicalComposite = new GraphicalComposite()

    private constructor() {
    }

    public build(visualizationDisplay: Display): void {
        this.graphicalComposite = new GraphicalComposite()

        let stepX = visualizationDisplay.getWidth() / 16 * 2
        let stepY = visualizationDisplay.getHeight() / 16 * 2

        for (let i = 0; i < 4; ++i) { // i < 8
            this.graphicalComposite.add(new Circle(
                -visualizationDisplay.getWidth() / 2 + stepX * i,
                visualizationDisplay.getHeight() / 2 - stepY * i,
                visualizationDisplay.getWidth() / 2 - stepX * i,
                -visualizationDisplay.getHeight() / 2 + stepY * i,
                ThickGridCirclesBuilder.GRID_LINES_COLOR,
                false,
                ThickGridCirclesBuilder.THICK_GRID_LINES_WIDTH
            ))
        }
    }

    public getGraphicalComponent(): GraphicalComponent {
        return this.graphicalComposite;
    }
}