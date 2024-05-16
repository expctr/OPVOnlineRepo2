/*
 * В данном файле содержится реализация класса, который соответствует точек в полярной
 * системе координат. Приче у такой точки есть имя.
 */

class NamedPointPolar {
    public name: string = ''
    public pointPolar: PointPolar = new PointPolar(0, 0)

    public constructor(name: string, polarDistance: number, polarAngle: number) {
        this.name = name
        this.pointPolar = new PointPolar(polarDistance, polarAngle)
    }

    public static parse(description: string) {
        let splitDescription = description.split(' ')

        return new NamedPointPolar(
            splitDescription[0],
            parseFloat(splitDescription[1]),
            parseFloat(splitDescription[2])
        )
    }

    public getPoint(displayWidth: number): Point {
        return new Point(
            this.pointPolar.getStandardX(displayWidth),
            this.pointPolar.getStandardY(displayWidth)
        )
    }
}