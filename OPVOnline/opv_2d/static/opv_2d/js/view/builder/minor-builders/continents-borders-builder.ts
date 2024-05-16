/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за границы континентов.
*/

class ContinentsBordersBuilder {
    private readonly CONTINENTS_BORDER_WIDTH = 7

    public static continentsBorderBuilder: ContinentsBordersBuilder = new ContinentsBordersBuilder()

    private graphicalComposite: GraphicalComposite = new GraphicalComposite()

    private constructor() {
    }

    public build(continentsVertices: PointPolar[][], visualizationDisplay: Display): void {
        this.graphicalComposite = new GraphicalComposite()

        for (let i = 0; i < continentsVertices.length; ++i) {
            let points: Point[] = []

            for (let j = 0; j < continentsVertices[i].length; ++j) {
                let currentContinentsVertex = continentsVertices[i][j]
                let x = currentContinentsVertex.getStandardX(visualizationDisplay.getWidth())
                let y = currentContinentsVertex.getStandardY(visualizationDisplay.getWidth())

                points.push(new Point(x, y))
            }

            this.graphicalComposite.add(new Polygon(
                false,
                this.CONTINENTS_BORDER_WIDTH,
                new Color(245, 245, 220, 1),
                points
            ))
        }
    }

    public getGraphicalComponent(): GraphicalComponent {
        return this.graphicalComposite;
    }
}