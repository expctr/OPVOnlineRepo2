"use strict";
class ContinentsAndOceanBuilder {
    constructor() {
        this.graphicalComposite = new GraphicalComposite();
    }
    build(continentsVertices, visualizationDisplay) {
        this.graphicalComposite = new GraphicalComposite();
        this.graphicalComposite.add(new Circle(-visualizationDisplay.getWidth() / 2, visualizationDisplay.getHeight() / 2, visualizationDisplay.getWidth() / 2, -visualizationDisplay.getHeight() / 2, new Color(26, 26, 255, 1), true, 1));
        for (let i = 0; i < continentsVertices.length; ++i) {
            let points = [];
            for (let j = 0; j < continentsVertices[i].length; ++j) {
                let currentContinentsVertex = continentsVertices[i][j];
                let x = currentContinentsVertex.getStandardX(visualizationDisplay.getWidth());
                let y = currentContinentsVertex.getStandardY(visualizationDisplay.getWidth());
                points.push(new Point(x, y));
            }
            this.graphicalComposite.add(new Polygon(true, 1, new Color(245, 245, 220, 1), points));
        }
    }
    getGraphicalComponent() {
        return this.graphicalComposite;
    }
}
ContinentsAndOceanBuilder.BACKGROUND_COLOR = new Color(39, 39, 39, 1);
ContinentsAndOceanBuilder.continentsAndOceanBuilder = new ContinentsAndOceanBuilder();
