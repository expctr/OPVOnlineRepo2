"use strict";
class ThinGridCirclesBuilder {
    constructor() {
        this.graphicalComposite = new GraphicalComposite();
    }
    build(visualizationDisplay) {
        this.graphicalComposite = new GraphicalComposite();
        let stepX = visualizationDisplay.getWidth() / 160;
        let stepY = visualizationDisplay.getHeight() / 160;
        for (let i = 0; i < 80; ++i) {
            this.graphicalComposite.add(new Circle(-visualizationDisplay.getWidth() / 2 + stepX * i, visualizationDisplay.getHeight() / 2 - stepY * i, visualizationDisplay.getWidth() / 2 - stepX * i, -visualizationDisplay.getHeight() / 2 + stepY * i, ThinGridCirclesBuilder.GRID_LINES_COLOR, false, ThinGridCirclesBuilder.THIN_GRID_LINES_WIDTH));
        }
    }
    getGraphicalComponent() {
        return this.graphicalComposite;
    }
}
ThinGridCirclesBuilder.GRID_LINES_COLOR = new Color(255, 255, 255, 1);
ThinGridCirclesBuilder.THIN_GRID_LINES_WIDTH = 0.5;
ThinGridCirclesBuilder.thinGridCirclesBuilder = new ThinGridCirclesBuilder();
