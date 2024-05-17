"use strict";
/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за фрагмент визуализации с информацией об интенсивности солнечного ветра.
*/
class GeoinformationDataUnitsBuilder {
    constructor() {
        this.graphicalComposite = new GraphicalComposite();
    }
    build(geoinformationDataUnits, visualizationDisplay) {
        this.graphicalComposite = new GraphicalComposite();
        for (let key in geoinformationDataUnits) {
            this.buildGeoinformationDataUnit(geoinformationDataUnits[key], visualizationDisplay);
        }
    }
    buildGeoinformationDataUnit(geoinformationDataUnit, visualizationDisplay) {
        let x1 = geoinformationDataUnit.getStandardX(visualizationDisplay.getWidth());
        let y1 = geoinformationDataUnit.getStandardY(visualizationDisplay.getWidth());
        let radiusVector = new RadiusVector(0, 0, x1, y1);
        radiusVector.applyRotation(Math.PI / 48);
        let x2 = radiusVector.getArrowheadX();
        let y2 = radiusVector.getArrowheadY();
        let l0 = Math.sqrt(Math.pow(visualizationDisplay.getWidth() / 160, 2)
            + Math.pow(visualizationDisplay.getHeight() / 160, 2));
        let ratio = (radiusVector.getLength() - l0) / radiusVector.getLength();
        radiusVector.applyHomothety(ratio);
        let x3 = radiusVector.getArrowheadX();
        let y3 = radiusVector.getArrowheadY();
        radiusVector.applyRotation(-Math.PI / 48);
        let x4 = radiusVector.getArrowheadX();
        let y4 = radiusVector.getArrowheadY();
        this.graphicalComposite.add(new Tetragon(x1, y1, x2, y2, x3, y3, x4, y4, geoinformationDataUnit.getColor()));
    }
    getGraphicalComponent() {
        return this.graphicalComposite;
    }
}
GeoinformationDataUnitsBuilder.geoinformationDataUnitsBuilder = new GeoinformationDataUnitsBuilder();
