/*
 * В данном файле содержится реализация класса, который соответствует фрагменту 3D
 * визуализации и хранит инсформацию об интенсивности солнечного ветра. 
 */

class OvationPrimeData3DUnit {
    private static readonly FIRST_COLOR = new Color(255, 0, 0, 0.7)

    private static readonly SECOND_COLOR = new Color(0, 255, 0, 0.7)

    private static readonly THIRD_COLOR = new Color(100, 100, 100, 0)

    public static maxValue = 5

    public firstPointLat: number = 0

    public firstPointLon: number = 0

    public secondPointLat: number = 0

    public secondPointLon: number = 0

    public thirdPointLat: number = 0

    public thirdPointLon: number = 0

    public fourthPointLat: number = 0

    public fourthPointLon: number = 0

    public height: number = 0

    public value: number = 0

    public firstPointMlt = 0

    public firstPointMagneticLat = 50

    public constructor(
        firstPointLat: number,
        firstPointLon: number,
        secondPointLat: number,
        secondPointLon: number,
        thirdPointLat: number,
        thirdPointLon: number,
        fourthPointLat: number,
        fourthPointLon: number,
        height: number,
        value: number,
        firstPointMlt: number,
        firstPointMagneticLat: number
    ) {
        this.firstPointLat = firstPointLat
        this.firstPointLon = firstPointLon
        this.secondPointLat = secondPointLat
        this.secondPointLon = secondPointLon
        this.thirdPointLat = thirdPointLat
        this.thirdPointLon = thirdPointLon
        this.fourthPointLat = fourthPointLat
        this.fourthPointLon = fourthPointLon
        this.height = height
        this.value = value
        this.firstPointMlt = firstPointMlt
        this.firstPointMagneticLat = firstPointMagneticLat
    }

    public static parse(description: string) {
        let splitDescription = description.split(' ')

        let firstPointLat = parseFloat(splitDescription[0])
        let firstPointLon = parseFloat(splitDescription[1])
        let secondPointLat = parseFloat(splitDescription[2])
        let secondPointLon = parseFloat(splitDescription[3])
        let thirdPointLat = parseFloat(splitDescription[4])
        let thirdPointLon = parseFloat(splitDescription[5])
        let fourthPointLat = parseFloat(splitDescription[6])
        let fourthPointLon = parseFloat(splitDescription[7])
        let height = parseFloat(splitDescription[8])
        let value = parseFloat(splitDescription[9])
        let firstPointMlt = parseFloat(splitDescription[10])
        let firstPointMagneticLat = parseFloat(splitDescription[11])

        return new OvationPrimeData3DUnit(
            firstPointLat,
            firstPointLon,
            secondPointLat,
            secondPointLon,
            thirdPointLat,
            thirdPointLon,
            fourthPointLat,
            fourthPointLon,
            height,
            value,
            firstPointMlt,
            firstPointMagneticLat
        )
    }

    public static getColor(value: number): Color {
        if (value > this.maxValue) {
            return OvationPrimeData3DUnit.FIRST_COLOR
        } else if (value < 0) {
            return OvationPrimeData3DUnit.THIRD_COLOR
        } else if (value > this.maxValue / 2) {
            return Color.getIntermediateColor(
                this.maxValue / 2, OvationPrimeData3DUnit.SECOND_COLOR,
                this.maxValue, OvationPrimeData3DUnit.FIRST_COLOR,
                value
            )
        } else {
            return Color.getIntermediateColor(
                0, OvationPrimeData3DUnit.THIRD_COLOR,
                this.maxValue / 2, OvationPrimeData3DUnit.SECOND_COLOR,
                value
            )
        }
    }

    public getColor(): Color {
        return OvationPrimeData3DUnit.getColor(this.value)
    }

    public getValue(): number {
        return this.value
    }

    public getCoordinatesRepresentation(): string {
        return this.firstPointMlt.toString() + ' ' + this.firstPointMagneticLat.toString()
    }

    public getFirstPoint(): PointOnShpere {
        return new PointOnShpere(this.firstPointLat, this.firstPointLon)
    }

    public getSecondPoint(): PointOnShpere {
        return new PointOnShpere(this.secondPointLat, this.secondPointLon)
    }

    public getFourthPoint(): PointOnShpere {
        return new PointOnShpere(this.fourthPointLat, this.fourthPointLon)
    }
}