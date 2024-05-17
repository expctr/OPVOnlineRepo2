"use strict";
/*
 * В данном файле содержится реализация интерфейса, который соответствует строителю
 * в паттерне Builder.
 */
class ConcreteBuilder {
    constructor() {
        this.graphicalComposite = new GraphicalComposite();
    }
    reset() {
        this.graphicalComposite = new GraphicalComposite();
    }
    buildBackground() {
        BackgroundBuilder.backgroundBuilder.build();
        this.graphicalComposite.add(BackgroundBuilder.backgroundBuilder.getGraphicalComponent());
    }
    buildContinentsAndOcean(continentsVertices, visualizationDisplay) {
        ContinentsAndOceanBuilder.continentsAndOceanBuilder
            .build(continentsVertices, visualizationDisplay);
        this.graphicalComposite.add(ContinentsAndOceanBuilder
            .continentsAndOceanBuilder.getGraphicalComponent());
    }
    buildGeoinformationDataUnits(geoinformationDataUnits, visualizationDisplay) {
        GeoinformationDataUnitsBuilder.geoinformationDataUnitsBuilder
            .build(geoinformationDataUnits, visualizationDisplay);
        this.graphicalComposite.add(GeoinformationDataUnitsBuilder
            .geoinformationDataUnitsBuilder.getGraphicalComponent());
    }
    buildCloudiness(cloudinessImage, mltRotationAngle, visualizationDisplay, setLoadedImageFlagAsTrue) {
        console.log("buildCloudiness");
        CloudinessBuilder.cloudinessBuilder.build(cloudinessImage, mltRotationAngle, visualizationDisplay, setLoadedImageFlagAsTrue);
        this.graphicalComposite.add(CloudinessBuilder
            .cloudinessBuilder.getGraphicalComponent());
    }
    buildTerminator(terminatorVertices, visualizationDisplay) {
        TerminatorBuilder.terminatorBuilder.build(terminatorVertices, visualizationDisplay);
        this.graphicalComposite.add(TerminatorBuilder
            .terminatorBuilder.getGraphicalComponent());
    }
    buildContinentsBorders(continentsVertices, visualizationDisplay) {
        ContinentsBordersBuilder.continentsBorderBuilder
            .build(continentsVertices, visualizationDisplay);
        this.graphicalComposite
            .add(ContinentsBordersBuilder
            .continentsBorderBuilder.getGraphicalComponent());
    }
    buildThinGridCircles(visualizationDisplay) {
        ThinGridCirclesBuilder.thinGridCirclesBuilder
            .build(visualizationDisplay);
        this.graphicalComposite
            .add(ThinGridCirclesBuilder
            .thinGridCirclesBuilder.getGraphicalComponent());
    }
    buildThickGridCircles(visualizationDisplay) {
        ThickGridCirclesBuilder.thickGridCirclesBuilder
            .build(visualizationDisplay);
        this.graphicalComposite
            .add(ThickGridCirclesBuilder.thickGridCirclesBuilder.getGraphicalComponent());
    }
    buildThinGridLines(visualizationDisplay) {
        ThinGridLinesBuilder.thinGridLinesBuilder
            .build(visualizationDisplay);
        this.graphicalComposite
            .add(ThinGridLinesBuilder.thinGridLinesBuilder.getGraphicalComponent());
    }
    buildThickGridLines(visualizationDisplay) {
        ThickGridLinesBuilder.thickGridLinesBuilder
            .build(visualizationDisplay);
        this.graphicalComposite
            .add(ThickGridLinesBuilder.thickGridLinesBuilder.getGraphicalComponent());
    }
    buildSmoothMargin(middleMarginSegments, color, visualizationDisplay) {
        SmoothMarginBuilder.smoothMarginBuilder
            .build(middleMarginSegments, color, visualizationDisplay);
        this.graphicalComposite
            .add(SmoothMarginBuilder.smoothMarginBuilder.getGraphicalComponent());
    }
    buildBrokenMargin(geoinformationDataUnits, marginLevel, color, visualizationDisplay) {
        BrokenMarginBuilder.brokenMarginBuiler
            .build(geoinformationDataUnits, marginLevel, color, visualizationDisplay);
        this.graphicalComposite.add(BrokenMarginBuilder.brokenMarginBuiler.getGraphicalComponent());
    }
    buildThickGridLinesLabels(visualizationDisplay) {
        ThickGridLinesLabelsBuilder.thickGridLinesLabelsBuilder
            .build(visualizationDisplay);
        this.graphicalComposite
            .add(ThickGridLinesLabelsBuilder.thickGridLinesLabelsBuilder.getGraphicalComponent());
    }
    buildThickGridCirclesLabels(visualizationDisplay) {
        ThickGridCirclesLabelsBuilder.thickGridCirclesLabelsBuilder.build(visualizationDisplay);
        this.graphicalComposite.add(ThickGridCirclesLabelsBuilder.thickGridCirclesLabelsBuilder.getGraphicalComponent());
    }
    buildCities(visualizationDisplay, cities) {
        CitiesBuilder.citiesBuilder.build(visualizationDisplay, cities);
        this.graphicalComposite.add(CitiesBuilder.citiesBuilder.getGraphicalComponent());
    }
    buildColorIndicator(colorIndicatorDisplay) {
        ColorIndicatorBuilder.colorIndicatorBuilder.build(colorIndicatorDisplay);
        this.graphicalComposite.add(ColorIndicatorBuilder.colorIndicatorBuilder.getGraphicalComponent());
    }
    buildGeoinformationUnitInfoLabel(visualizationDisplay, mouseEvent, geoinformationDataUnits) {
        if (visualizationDisplay.canvas == null) {
            return;
        }
        GeoinformationDataUnitInfoLabelBuilder
            .geoinformationDataUnitInfoLabelBuilder
            .build(visualizationDisplay, mouseEvent, geoinformationDataUnits);
        this.graphicalComposite.add(GeoinformationDataUnitInfoLabelBuilder
            .geoinformationDataUnitInfoLabelBuilder
            .getGraphicalComponent());
        console.log('add info');
    }
    getResult() {
        return this.graphicalComposite;
    }
}
