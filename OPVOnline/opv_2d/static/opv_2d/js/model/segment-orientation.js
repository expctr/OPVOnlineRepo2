"use strict";
/*
 * В данном файле содержится перечисление с типом
 * ориентации отрезка.
 */
/**
 * Перечисление с типом ориентации отрезка.
 * @author Иван Шагурин
 */
var SegmentOrientation;
(function (SegmentOrientation) {
    /**
     * Радиальная ориентация отрезка.
     */
    SegmentOrientation[SegmentOrientation["RADIAL"] = 0] = "RADIAL";
    /**
     * Приближенно круговая ориентация отрезка.
     */
    SegmentOrientation[SegmentOrientation["ROUND"] = 1] = "ROUND";
})(SegmentOrientation || (SegmentOrientation = {}));
