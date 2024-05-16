/*
* В данном файле содержится описание интерфейса, который соответствует строителю в
* паттерне Builder.
*/

interface Builder {
    reset(): void

    buildBackground(): void

    buildContinentsAndOcean(continentsVertices: PointPolar[][], visualizationDisplay: Display): void

    buildGeoinformationDataUnits(geoinformationDataUnits: { [key: string]: GeoinformationDataUnit }, visualizationDisplay: Display): void

    buildCloudiness(
        cloudinessImage: HTMLImageElement,
        mltRotationAngle: number,
        visualizationDisplay: Display,
        setLoadedImageFlagAsTrue: () => void
    ): void

    buildTerminator(terminatorVertices: PointPolar[][], visualizationDisplay: Display): void

    buildContinentsBorders(continentsVertices: PointPolar[][], visualizationDisplay: Display): void

    buildThinGridCircles(visualizationDisplay: Display): void

    buildThickGridCircles(visualizationDisplay: Display): void

    buildThinGridLines(visualizationDisplay: Display): void

    buildThickGridLines(visualizationDisplay: Display): void

    buildSmoothMargin(middleMarginSegments: Segment[], color: Color, visualizationDisplay: Display): void

    buildBrokenMargin(
        geoinformationDataUnits: { [key: string]: GeoinformationDataUnit; },
        marginLevel: number,
        color: Color,
        visualizationDisplay: Display): void

    buildThickGridLinesLabels(visualizationDisplay: Display): void

    buildThickGridCirclesLabels(visualizationDisplay: Display): void

    buildCities(visualizationDisplay: Display, cities: NamedPointPolar[]): void
}