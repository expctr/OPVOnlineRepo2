/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за континенты и океан.
*/

class ContinentsAndOceanBuilder {
    private static BACKGROUND_COLOR: Color = new Color(39, 39, 39, 1)

    public static continentsAndOceanBuilder: ContinentsAndOceanBuilder = new ContinentsAndOceanBuilder()

    private graphicalComposite: GraphicalComposite = new GraphicalComposite()

    private constructor() {
    }

    public build(continentsVertices: PointPolar[][], visualizationDisplay: Display): void {
        this.graphicalComposite = new GraphicalComposite()

        this.graphicalComposite.add(new Circle(
            -visualizationDisplay.getWidth() / 2,
            visualizationDisplay.getHeight() / 2,
            visualizationDisplay.getWidth() / 2,
            -visualizationDisplay.getHeight() / 2,
            new Color(26, 26, 255, 1),
            true,
            1
        ))

        for (let i = 0; i < continentsVertices.length; ++i) {
            let points: Point[] = []

            for (let j = 0; j < continentsVertices[i].length; ++j) {
                let currentContinentsVertex = continentsVertices[i][j]
                let x = currentContinentsVertex.getStandardX(visualizationDisplay.getWidth())
                let y = currentContinentsVertex.getStandardY(visualizationDisplay.getWidth())

                points.push(new Point(x, y))
            }

            this.graphicalComposite.add(new Polygon(
                true, 1, new Color(245, 245, 220, 1), points
            ))
        }
    }

    public getGraphicalComponent(): GraphicalComponent {
        return this.graphicalComposite;
    }
}