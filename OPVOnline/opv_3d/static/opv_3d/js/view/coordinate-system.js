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
    CoordinateSystem[CoordinateSystem["DISPLAY"] = 1] = "DISPLAY";
    CoordinateSystem[CoordinateSystem["WEBGL"] = 2] = "WEBGL";
})(CoordinateSystem || (CoordinateSystem = {}));
