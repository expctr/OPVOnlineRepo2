"use strict";
class GeoinformationDataUnitInfoLabelBuilder {
    constructor() {
        this.graphicalComposite = new GraphicalComposite();
    }
    build(visualizationDisplay, mouseEvent, geoinformationDataUnits) {
        this.graphicalComposite = new GraphicalComposite();
        if (visualizationDisplay.canvas == null) {
            return;
        }
        let rect = visualizationDisplay.canvas.getBoundingClientRect();
        // this.view.paintLabel((mouseEvent.clientX - rect.left) * 4, (mouseEvent.clientY - rect.top) * 4,
        //     this.model.geoinformationDataUnits)
        let x = (mouseEvent.clientX - rect.left) * 4;
        let y = (mouseEvent.clientY - rect.top) * 4;
        if (Object.keys(geoinformationDataUnits).length == 0) {
            return;
        }
        CoordinateAdapter.firstCoordinateAdapter.setDisplay(visualizationDisplay);
        CoordinateAdapter.firstCoordinateAdapter.set(x, y, CoordinateSystem.CANVAS);
        let xDisplay = CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.DISPLAY_ROTATED);
        let yDisplay = CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.DISPLAY_ROTATED);
        let standardPolarDistance = Math.sqrt(xDisplay * xDisplay + yDisplay * yDisplay);
        let standardPolarAngle = Math.atan2(yDisplay, xDisplay);
        let modifiedPolarDistance = 90 - standardPolarDistance / visualizationDisplay.getWidth() * 80;
        let modifiedPolarAngle = standardPolarAngle * 12 / Math.PI + 6;
        if (modifiedPolarAngle < 0) {
            modifiedPolarAngle += 24;
        }
        modifiedPolarDistance = this.roundModifiedPolarDistance(modifiedPolarDistance);
        modifiedPolarAngle = this.roundModifiedPolarAngle(modifiedPolarAngle);
        if (modifiedPolarDistance < 50 || modifiedPolarDistance > 89.5) {
            return;
        }
        let geoinformationDataUnitValue = this.getGeoinformationDataUnitValue(modifiedPolarDistance, modifiedPolarAngle, geoinformationDataUnits);
        // this.visualizationDisplay.fillLabel(modifiedPolarAngle.toFixed(2) + ', '
        //     + modifiedPolarDistance.toFixed(1) + ', '
        //     + geoinformationDataUnitValue,
        //     x + 40, y + 40,
        //     'gray',
        //     'white',
        //     48,
        //     'Arial')
        this.graphicalComposite.add(new Label(xDisplay + 60, yDisplay - 30, modifiedPolarAngle.toFixed(2) + ', '
            + modifiedPolarDistance.toFixed(1) + ', '
            + geoinformationDataUnitValue.toFixed(2), new Color(255, 255, 255, 1), new Color(100, 100, 100, 1), 60, "Arial", false, 0, 0));
    }
    /**
 * Округляем модифицированное полярное расстояние.
 * @param modifiedPolarDistance помянутое модифицированное полярное расстояние.
 * @returns округленное модицифицированное полярное расстояние.
 */
    roundModifiedPolarDistance(modifiedPolarDistance) {
        let delta = modifiedPolarDistance - Math.floor(modifiedPolarDistance);
        modifiedPolarDistance = Math.floor(modifiedPolarDistance);
        if (delta < 0.5) {
            delta = 0;
        }
        else {
            delta = 0.5;
        }
        return modifiedPolarDistance + delta;
    }
    /**
     * Округляем модифицированный полярный угол.
     * @param modifiedPolarAngle упомянутый модифицированный полярный угол.
     * @returns округленный модифицированный полярный угол.
     */
    roundModifiedPolarAngle(modifiedPolarAngle) {
        let delta = modifiedPolarAngle - Math.floor(modifiedPolarAngle);
        modifiedPolarAngle = Math.floor(modifiedPolarAngle);
        if (delta < 0.25) {
            delta = 0;
        }
        else if (delta < 0.5) {
            delta = 0.25;
        }
        else if (delta < 0.75) {
            delta = 0.5;
        }
        else {
            delta = 0.75;
        }
        return modifiedPolarAngle + delta;
    }
    getGeoinformationDataUnitValue(polarDistance, polarAngle, geoinformationDataUnits) {
        let geoinformationDataUnit = geoinformationDataUnits[polarAngle.toString()
            + ' '
            + polarDistance.toString()];
        if (geoinformationDataUnit == undefined) {
            return -1;
        }
        else {
            return geoinformationDataUnit.getValue();
        }
    }
    getGraphicalComponent() {
        return this.graphicalComposite;
    }
}
GeoinformationDataUnitInfoLabelBuilder.geoinformationDataUnitInfoLabelBuilder = new GeoinformationDataUnitInfoLabelBuilder();
