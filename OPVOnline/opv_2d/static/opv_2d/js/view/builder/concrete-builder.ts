/*
 * В данном файле содержится реализация интерфейса, который соответствует строителю
 * в паттерне Builder.
 */

class ConcreteBuilder implements Builder {
    public constructor() {

    }

    private graphicalComposite: GraphicalComposite = new GraphicalComposite()

    public reset(): void {
        this.graphicalComposite = new GraphicalComposite()
    }

    public buildBackground(): void {
        BackgroundBuilder.backgroundBuilder.build()
        this.graphicalComposite.add(BackgroundBuilder.backgroundBuilder.getGraphicalComponent())
    }

    public buildContinentsAndOcean(continentsVertices: PointPolar[][], visualizationDisplay: Display): void {
        ContinentsAndOceanBuilder.continentsAndOceanBuilder
            .build(continentsVertices, visualizationDisplay)
        this.graphicalComposite.add(ContinentsAndOceanBuilder
            .continentsAndOceanBuilder.getGraphicalComponent())
    }

    public buildGeoinformationDataUnits(
        geoinformationDataUnits: { [key: string]: GeoinformationDataUnit },
        visualizationDisplay: Display): void {
        GeoinformationDataUnitsBuilder.geoinformationDataUnitsBuilder
            .build(geoinformationDataUnits, visualizationDisplay)
        this.graphicalComposite.add(GeoinformationDataUnitsBuilder
            .geoinformationDataUnitsBuilder.getGraphicalComponent())
    }

    public buildCloudiness(
        cloudinessImage: HTMLImageElement,
        mltRotationAngle: number,
        visualizationDisplay: Display,
        setLoadedImageFlagAsTrue: () => void): void {
        console.log("buildCloudiness")

        CloudinessBuilder.cloudinessBuilder.build(
            cloudinessImage,
            mltRotationAngle,
            visualizationDisplay,
            setLoadedImageFlagAsTrue
        )
        this.graphicalComposite.add(CloudinessBuilder
            .cloudinessBuilder.getGraphicalComponent())
    }

    public buildTerminator(terminatorVertices: PointPolar[][], visualizationDisplay: Display): void {
        TerminatorBuilder.terminatorBuilder.build(
            terminatorVertices,
            visualizationDisplay)
        this.graphicalComposite.add(
            TerminatorBuilder
                .terminatorBuilder.getGraphicalComponent())
    }

    public buildContinentsBorders(continentsVertices: PointPolar[][], visualizationDisplay: Display): void {
        ContinentsBordersBuilder.continentsBorderBuilder
            .build(continentsVertices, visualizationDisplay)
        this.graphicalComposite
            .add(ContinentsBordersBuilder
                .continentsBorderBuilder.getGraphicalComponent())
    }

    public buildThinGridCircles(visualizationDisplay: Display): void {
        ThinGridCirclesBuilder.thinGridCirclesBuilder
            .build(visualizationDisplay)
        this.graphicalComposite
            .add(ThinGridCirclesBuilder
                .thinGridCirclesBuilder.getGraphicalComponent())
    }

    public buildThickGridCircles(visualizationDisplay: Display): void {
        ThickGridCirclesBuilder.thickGridCirclesBuilder
            .build(visualizationDisplay)
        this.graphicalComposite
            .add(ThickGridCirclesBuilder.thickGridCirclesBuilder.getGraphicalComponent())
    }

    public buildThinGridLines(visualizationDisplay: Display): void {
        ThinGridLinesBuilder.thinGridLinesBuilder
            .build(visualizationDisplay)
        this.graphicalComposite
            .add(ThinGridLinesBuilder.thinGridLinesBuilder.getGraphicalComponent())
    }

    public buildThickGridLines(visualizationDisplay: Display): void {
        ThickGridLinesBuilder.thickGridLinesBuilder
            .build(visualizationDisplay)
        this.graphicalComposite
            .add(ThickGridLinesBuilder.thickGridLinesBuilder.getGraphicalComponent())
    }

    public buildSmoothMargin(middleMarginSegments: Segment[], color: Color, visualizationDisplay: Display): void {
        SmoothMarginBuilder.smoothMarginBuilder
            .build(middleMarginSegments, color, visualizationDisplay)
        this.graphicalComposite
            .add(SmoothMarginBuilder.smoothMarginBuilder.getGraphicalComponent())
    }

    public buildBrokenMargin(
        geoinformationDataUnits: { [key: string]: GeoinformationDataUnit; },
        marginLevel: number,
        color: Color,
        visualizationDisplay: Display): void {
        BrokenMarginBuilder.brokenMarginBuiler
            .build(geoinformationDataUnits, marginLevel, color, visualizationDisplay)
        this.graphicalComposite.add(BrokenMarginBuilder.brokenMarginBuiler.getGraphicalComponent())
    }

    public buildThickGridLinesLabels(visualizationDisplay: Display): void {
        ThickGridLinesLabelsBuilder.thickGridLinesLabelsBuilder
            .build(visualizationDisplay)
        this.graphicalComposite
            .add(ThickGridLinesLabelsBuilder.thickGridLinesLabelsBuilder.getGraphicalComponent())
    }

    public buildThickGridCirclesLabels(visualizationDisplay: Display): void {
        ThickGridCirclesLabelsBuilder.thickGridCirclesLabelsBuilder.build(visualizationDisplay)
        this.graphicalComposite.add(ThickGridCirclesLabelsBuilder.thickGridCirclesLabelsBuilder.getGraphicalComponent())
    }

    public buildCities(visualizationDisplay: Display, cities: NamedPointPolar[]): void {
        CitiesBuilder.citiesBuilder.build(visualizationDisplay, cities)
        this.graphicalComposite.add(CitiesBuilder.citiesBuilder.getGraphicalComponent())
    }

    public buildColorIndicator(colorIndicatorDisplay: Display): void {
        ColorIndicatorBuilder.colorIndicatorBuilder.build(colorIndicatorDisplay)
        this.graphicalComposite.add(ColorIndicatorBuilder.colorIndicatorBuilder.getGraphicalComponent())
    }

    public buildGeoinformationUnitInfoLabel(
        visualizationDisplay: Display,
        mouseEvent: MouseEvent,
        geoinformationDataUnits: { [key: string]: GeoinformationDataUnit }): void {
        if (visualizationDisplay.canvas == null) {
            return
        }

        GeoinformationDataUnitInfoLabelBuilder
            .geoinformationDataUnitInfoLabelBuilder
            .build(
                visualizationDisplay,
                mouseEvent,
                geoinformationDataUnits)
        this.graphicalComposite.add(
            GeoinformationDataUnitInfoLabelBuilder
                .geoinformationDataUnitInfoLabelBuilder
                .getGraphicalComponent())
        console.log('add info')
    }

    public getResult(): GraphicalComponent {
        return this.graphicalComposite
    }
}