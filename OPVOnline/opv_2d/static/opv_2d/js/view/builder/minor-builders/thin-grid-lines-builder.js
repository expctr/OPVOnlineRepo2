"use strict";
class ThinGridLinesBuilder {
    constructor() {
        this.graphicalComposite = new GraphicalComposite();
    }
    build(visualizationDisplay) {
        this.graphicalComposite = new GraphicalComposite();
        let radiusVector = new RadiusVector(0, 0, 0, visualizationDisplay.getHeight() / 2);
        let stepAngle = Math.PI / 48;
        for (let i = 0; i < 96; ++i) {
            this.graphicalComposite.add(new GraphicalSegment(ThinGridLinesBuilder.THIN_GRID_LINES_WIDTH, ThinGridLinesBuilder.GRID_LINES_COLOR, 0, 0, radiusVector.getArrowheadX(), radiusVector.getArrowheadY()));
            radiusVector.applyRotation(stepAngle);
        }
    }
    getGraphicalComponent() {
        return this.graphicalComposite;
    }
}
ThinGridLinesBuilder.THIN_GRID_LINES_WIDTH = 0.5;
ThinGridLinesBuilder.GRID_LINES_COLOR = new Color(255, 255, 255, 1);
ThinGridLinesBuilder.thinGridLinesBuilder = new ThinGridLinesBuilder();
