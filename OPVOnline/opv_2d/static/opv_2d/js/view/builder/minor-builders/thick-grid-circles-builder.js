"use strict";
/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за толстые круговые линии координатной решетки.
*/
class ThickGridCirclesBuilder {
    constructor() {
        this.graphicalComposite = new GraphicalComposite();
    }
    build(visualizationDisplay) {
        this.graphicalComposite = new GraphicalComposite();
        let stepX = visualizationDisplay.getWidth() / 16 * 2;
        let stepY = visualizationDisplay.getHeight() / 16 * 2;
        for (let i = 0; i < 4; ++i) { // i < 8
            this.graphicalComposite.add(new Circle(-visualizationDisplay.getWidth() / 2 + stepX * i, visualizationDisplay.getHeight() / 2 - stepY * i, visualizationDisplay.getWidth() / 2 - stepX * i, -visualizationDisplay.getHeight() / 2 + stepY * i, ThickGridCirclesBuilder.GRID_LINES_COLOR, false, ThickGridCirclesBuilder.THICK_GRID_LINES_WIDTH));
        }
    }
    getGraphicalComponent() {
        return this.graphicalComposite;
    }
}
ThickGridCirclesBuilder.GRID_LINES_COLOR = new Color(255, 255, 255, 1);
ThickGridCirclesBuilder.THICK_GRID_LINES_WIDTH = 2.5;
ThickGridCirclesBuilder.thickGridCirclesBuilder = new ThickGridCirclesBuilder();
