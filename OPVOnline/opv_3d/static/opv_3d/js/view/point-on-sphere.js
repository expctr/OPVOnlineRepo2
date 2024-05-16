"use strict";
class PointOnShpere {
    constructor(lat, lon) {
        this.lat = 0;
        this.lon = 0;
        this.lat = lat;
        this.lon = lon;
    }
    approximatelyEquals(point) {
        return ((Math.abs(this.lat - point.lat) <= PointOnShpere.EPS)
            && (Math.abs(this.lon - point.lon) <= PointOnShpere.EPS));
    }
}
PointOnShpere.EPS = 0.001;
