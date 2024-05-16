/*
 * В данном файле содержится реализация класса, который соответствует точке на сфере.
 */

class PointOnShpere {
    public lat: number = 0

    public lon: number = 0

    public static readonly EPS: number = 0.001

    public constructor(lat: number, lon: number) {
        this.lat = lat
        this.lon = lon
    }

    public approximatelyEquals(point: PointOnShpere): boolean {
        return (
            (Math.abs(this.lat - point.lat) <= PointOnShpere.EPS)
            && (Math.abs(this.lon - point.lon) <= PointOnShpere.EPS)
        )
    }
}