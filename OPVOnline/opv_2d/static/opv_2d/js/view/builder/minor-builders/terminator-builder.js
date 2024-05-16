"use strict";
class TerminatorBuilder {
    constructor() {
        this.graphicalComposite = new GraphicalComposite();
    }
    build(terminatorVertices, visualizationDisplay) {
        this.graphicalComposite = new GraphicalComposite();
        for (let i = 0; i < terminatorVertices.length; ++i) {
            let points = [];
            for (let j = 0; j < terminatorVertices[i].length; ++j) {
                let currentTerminatorVertex = terminatorVertices[i][j];
                let x = currentTerminatorVertex.getStandardX(visualizationDisplay.getWidth());
                let y = currentTerminatorVertex.getStandardY(visualizationDisplay.getWidth());
                points.push(new Point(x, y));
            }
            this.graphicalComposite.add(new Polygon(true, 1, new Color(40, 40, 40, 0.65), points));
        }
    }
    getGraphicalComponent() {
        return this.graphicalComposite;
    }
}
TerminatorBuilder.terminatorBuilder = new TerminatorBuilder();
