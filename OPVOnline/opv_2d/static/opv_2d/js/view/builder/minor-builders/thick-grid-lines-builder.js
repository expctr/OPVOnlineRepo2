"use strict";
class ThickGridLinesBuilder {
    constructor() {
        this.graphicalComposite = new GraphicalComposite();
    }
    build(visualizationDisplay) {
        this.graphicalComposite = new GraphicalComposite();
        let radiusVector = new RadiusVector(0, 0, 0, visualizationDisplay.getHeight() / 2);
        let stepAngle = Math.PI / 12 * 3;
        for (let i = 0; i < 24; ++i) {
            this.graphicalComposite.add(new GraphicalSegment(ThickGridLinesBuilder.THICK_GRID_LINES_WIDTH, ThickGridLinesBuilder.GRID_LINES_COLOR, 0, 0, radiusVector.getArrowheadX(), radiusVector.getArrowheadY()));
            radiusVector.applyRotation(stepAngle);
        }
    }
    getGraphicalComponent() {
        return this.graphicalComposite;
    }
}
ThickGridLinesBuilder.THICK_GRID_LINES_WIDTH = 2.5;
ThickGridLinesBuilder.GRID_LINES_COLOR = new Color(255, 255, 255, 1);
ThickGridLinesBuilder.thickGridLinesBuilder = new ThickGridLinesBuilder();
