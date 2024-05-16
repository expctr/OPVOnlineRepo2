"use strict";
class ContinentsBordersBuilder {
    constructor() {
        this.CONTINENTS_BORDER_WIDTH = 7;
        this.graphicalComposite = new GraphicalComposite();
    }
    build(continentsVertices, visualizationDisplay) {
        this.graphicalComposite = new GraphicalComposite();
        for (let i = 0; i < continentsVertices.length; ++i) {
            let points = [];
            for (let j = 0; j < continentsVertices[i].length; ++j) {
                let currentContinentsVertex = continentsVertices[i][j];
                let x = currentContinentsVertex.getStandardX(visualizationDisplay.getWidth());
                let y = currentContinentsVertex.getStandardY(visualizationDisplay.getWidth());
                points.push(new Point(x, y));
            }
            this.graphicalComposite.add(new Polygon(false, this.CONTINENTS_BORDER_WIDTH, new Color(245, 245, 220, 1), points));
        }
    }
    getGraphicalComponent() {
        return this.graphicalComposite;
    }
}
ContinentsBordersBuilder.continentsBorderBuilder = new ContinentsBordersBuilder();
