"use strict";
/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за города.
*/
class CitiesBuilder {
    constructor() {
        this.graphicalComposite = new GraphicalComposite();
    }
    build(visualizationDisplay, cities) {
        this.graphicalComposite = new GraphicalComposite();
        for (let i = 0; i < cities.length; ++i) {
            this.buildNamedPointPolar(visualizationDisplay, cities[i], new Color(0, 40, 0, 1), new Color(0, 0, 0, 1));
        }
    }
    buildNamedPointPolar(visualizationDisplay, namedPointPolar, pointColor, labelColor) {
        let centerX = namedPointPolar
            .pointPolar
            .getStandardX(visualizationDisplay.getWidth());
        let centerY = namedPointPolar
            .pointPolar
            .getStandardY(visualizationDisplay.getWidth());
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(visualizationDisplay);
        CoordinateAdapter.firstCoordinateAdapter.set(centerX, centerY, CoordinateSystem.CANVAS);
        this.graphicalComposite.add(new Circle(centerX - 15, centerY + 15, centerX + 15, centerY - 15, pointColor, true, 1));
        this.graphicalComposite.add(new Label(centerX, centerY, namedPointPolar.name, labelColor, new Color(0, 0, 0, 0), 48, 'Arial', false, 20, -20));
    }
    getGraphicalComponent() {
        return this.graphicalComposite;
    }
}
CitiesBuilder.citiesBuilder = new CitiesBuilder();
