/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за ночную зону.
*/

class TerminatorBuilder {
    public static terminatorBuilder: TerminatorBuilder = new TerminatorBuilder()

    private graphicalComposite: GraphicalComposite = new GraphicalComposite()

    private constructor() {
    }

    public build(terminatorVertices: PointPolar[][], visualizationDisplay: Display): void {
        this.graphicalComposite = new GraphicalComposite()

        for (let i = 0; i < terminatorVertices.length; ++i) {
            let points: Point[] = []

            for (let j = 0; j < terminatorVertices[i].length; ++j) {
                let currentTerminatorVertex = terminatorVertices[i][j]
                let x = currentTerminatorVertex.getStandardX(visualizationDisplay.getWidth())
                let y = currentTerminatorVertex.getStandardY(visualizationDisplay.getWidth())

                points.push(new Point(x, y))
            }

            this.graphicalComposite.add(
                new Polygon(
                    true, 1, new Color(40, 40, 40, 0.65), points
                )
            )
        }
    }

    public getGraphicalComponent(): GraphicalComponent {
        return this.graphicalComposite;
    }
}