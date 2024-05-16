/*
 * В данном файле содержится реализация команды для рисования из паттерна Command.
 */

class DrawingCommand {
    public rebuildFlag: boolean = true

    public imageLoadedFlag = false

    public geoinformationDataUnits:
        { [key: string]: GeoinformationDataUnit } | null = null

    public marginLevel: number = 0

    public middleMarginSegments: Segment[] = []

    public terminatorVertices: PointPolar[][] | null = null

    // public cloudinessImageSrc: string | null = null
    public cloudinessImage: HTMLImageElement | null = null

    public cloudinessMltRotationAngle: number = 0

    public continentsVertices: PointPolar[][] | null = null

    public cities: NamedPointPolar[] | null = null

    public totalMltRotationAngle: number = 0

    public mouseEvent: MouseEvent | null = null

    public constructor(rebuildFlag: boolean) {
        this.rebuildFlag = rebuildFlag
    }

    public set(geoinformationDataUnits:
        { [key: string]: GeoinformationDataUnit } | null,
        marginLevel: number,
        middleMarginSegments: Segment[],
        terminatorVertices: PointPolar[][] | null,
        cloudinessMltRotationAngle: number,
        continentsVertices: PointPolar[][] | null,
        cities: NamedPointPolar[] | null,
        totalMltRotationAngle: number,
        mouseEvent: MouseEvent | null): void {
        this.geoinformationDataUnits = geoinformationDataUnits
        this.marginLevel = marginLevel
        this.middleMarginSegments = middleMarginSegments
        this.terminatorVertices = terminatorVertices
        this.cloudinessMltRotationAngle = cloudinessMltRotationAngle
        this.continentsVertices = continentsVertices
        this.cities = cities
        this.totalMltRotationAngle = totalMltRotationAngle
        this.mouseEvent = mouseEvent
    }

    public setCloudinessImage(cloudinessImage: HTMLImageElement) {
        this.cloudinessImage = cloudinessImage
    }

    public setLoadedImageFlagAsTrue() {
        this.imageLoadedFlag = true
    }
}