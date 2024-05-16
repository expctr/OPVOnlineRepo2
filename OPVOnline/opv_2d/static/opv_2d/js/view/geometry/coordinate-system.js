"use strict";
/*
 * В данном файле содержится перечисление с типом системы отсчета.
 */
/**
 * Перечисление с типом системы отсчета.
 * @author Иван Шагурин
 */
var CoordinateSystem;
(function (CoordinateSystem) {
    /**
     * Система отсчета относительно холста.
     */
    CoordinateSystem[CoordinateSystem["CANVAS"] = 0] = "CANVAS";
    /**
     * Система отсчета относительно дисплея.
     */
    CoordinateSystem[CoordinateSystem["DISPLAY_ROTATED"] = 1] = "DISPLAY_ROTATED";
    CoordinateSystem[CoordinateSystem["DISPLAY_NOT_ROTATED"] = 2] = "DISPLAY_NOT_ROTATED";
})(CoordinateSystem || (CoordinateSystem = {}));
