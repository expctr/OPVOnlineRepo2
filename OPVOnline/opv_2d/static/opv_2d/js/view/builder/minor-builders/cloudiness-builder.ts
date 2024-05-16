/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за облачность.
*/

class CloudinessBuilder {
    public static cloudinessBuilder: CloudinessBuilder = new CloudinessBuilder()

    private graphicalComposite: GraphicalComposite = new GraphicalComposite()

    private constructor() {
    }

    public build(cloudinessImage: HTMLImageElement,
        mltRotationAngle: number,
        visualizationDisplay: Display,
        imageOnloadListener: () => void): void {
        this.graphicalComposite = new GraphicalComposite()

        CoordinateAdapter.firstCoordinateAdapter.setDisplay(visualizationDisplay)
        CoordinateAdapter.firstCoordinateAdapter.set(
            -visualizationDisplay.getWidth() / 2,
            visualizationDisplay.getHeight() / 2,
            CoordinateSystem.DISPLAY_NOT_ROTATED
        )

        let rotationAngleInRadians = mltRotationAngle / 24 * 2 * Math.PI

        this.graphicalComposite.add(new ImageObject(
            cloudinessImage,
            CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS),
            CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS),
            visualizationDisplay.getWidth(),
            visualizationDisplay.getHeight(),
            rotationAngleInRadians,
            imageOnloadListener
        ))
    }

    // public build(cloudinessCellsGeomagneticCoordinates: [number, number][][] | null = null,
    //     cloudinessCellsValues: number[][] | null = null, mltRotationAngle: number,
    //     visualizationDisplay: Display): void {
    //     this.graphicalComposite = new GraphicalComposite()

    //     if ((cloudinessCellsGeomagneticCoordinates == null) || (cloudinessCellsValues == null)) {
    //         return
    //     }

    //     for (let i = 0; i < cloudinessCellsGeomagneticCoordinates.length - 1; i += 1) {
    //         for (let j = 0; j < cloudinessCellsGeomagneticCoordinates[i].length; j += 1) {
    //             let next_j_adjusted = (j + 1 < cloudinessCellsGeomagneticCoordinates[i].length) ? (j + 1) : 0

    //             let firstCloudinessCellVertex: [number, number] = cloudinessCellsGeomagneticCoordinates[i][j]
    //             let secondCloudinessCellVertex: [number, number] = cloudinessCellsGeomagneticCoordinates[i + 1][j]
    //             let thirdCloudinessCellVertex: [number, number] = cloudinessCellsGeomagneticCoordinates[i + 1][next_j_adjusted]
    //             let fourthCloudinessCellVertex: [number, number] = cloudinessCellsGeomagneticCoordinates[i][next_j_adjusted]
    //             let cloudinessCellValue = cloudinessCellsValues[i][j]

    //             if ((firstCloudinessCellVertex[0] < 50)
    //                 || (secondCloudinessCellVertex[0] < 50)
    //                 || (thirdCloudinessCellVertex[0] < 50)
    //                 || (fourthCloudinessCellVertex[0] < 50)) {
    //                 continue
    //             }

    //             CloudinessCell.firstCloudinessCell.set(
    //                 firstCloudinessCellVertex[0], firstCloudinessCellVertex[1] - mltRotationAngle)
    //             CloudinessCell.secondCloudinessCell.set(
    //                 secondCloudinessCellVertex[0], secondCloudinessCellVertex[1] - mltRotationAngle)
    //             CloudinessCell.thirdCloudinessCell.set(
    //                 thirdCloudinessCellVertex[0], thirdCloudinessCellVertex[1] - mltRotationAngle)
    //             CloudinessCell.fourthCloudinessCell.set(
    //                 fourthCloudinessCellVertex[0], fourthCloudinessCellVertex[1] - mltRotationAngle)

    //             this.graphicalComposite.add(new Tetragon(
    //                     CloudinessCell.firstCloudinessCell.getStandardX(visualizationDisplay.getWidth()),
    //                     CloudinessCell.firstCloudinessCell.getStandardY(visualizationDisplay.getWidth()),
    //                     CloudinessCell.secondCloudinessCell.getStandardX(visualizationDisplay.getWidth()),
    //                     CloudinessCell.secondCloudinessCell.getStandardY(visualizationDisplay.getWidth()),
    //                     CloudinessCell.thirdCloudinessCell.getStandardX(visualizationDisplay.getWidth()),
    //                     CloudinessCell.thirdCloudinessCell.getStandardY(visualizationDisplay.getWidth()),
    //                     CloudinessCell.fourthCloudinessCell.getStandardX(visualizationDisplay.getWidth()),
    //                     CloudinessCell.fourthCloudinessCell.getStandardY(visualizationDisplay.getWidth()),
    //                     CloudinessCell.getColor(cloudinessCellValue)
    //             ))
    //         }
    //     }
    // }

    public getGraphicalComponent(): GraphicalComponent {
        return this.graphicalComposite;
    }
}