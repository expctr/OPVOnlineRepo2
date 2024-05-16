/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за тонкие круговые линии координатной решетки.
*/

class ThinGridCirclesBuilder {
    private static readonly GRID_LINES_COLOR: Color = new Color(255, 255, 255, 1)

    private static readonly THIN_GRID_LINES_WIDTH: number = 0.5

    public static thinGridCirclesBuilder: ThinGridCirclesBuilder = new ThinGridCirclesBuilder()

    private graphicalComposite: GraphicalComposite = new GraphicalComposite()

    private constructor() {
    }

    public build(visualizationDisplay: Display): void {
        this.graphicalComposite = new GraphicalComposite()

        let stepX = visualizationDisplay.getWidth() / 160
        let stepY = visualizationDisplay.getHeight() / 160

        for (let i = 0; i < 80; ++i) {
            this.graphicalComposite.add(new Circle(
                -visualizationDisplay.getWidth() / 2 + stepX * i,
                visualizationDisplay.getHeight() / 2 - stepY * i,
                visualizationDisplay.getWidth() / 2 - stepX * i,
                -visualizationDisplay.getHeight() / 2 + stepY * i,
                ThinGridCirclesBuilder.GRID_LINES_COLOR,
                false,
                ThinGridCirclesBuilder.THIN_GRID_LINES_WIDTH
            ))
        }
    }

    public getGraphicalComponent(): GraphicalComponent {
        return this.graphicalComposite;
    }
}