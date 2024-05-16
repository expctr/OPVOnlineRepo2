"use strict";
/*
 * В данном файле содержится перечисление типом
 * прогноза / наблюдаемых данных.
 */
/**
 * Перечисление с типом прогноза / наблюдаемых данных.
 * @author Иван Шагурин
 */
var CastType;
(function (CastType) {
    /**
     * Прогноз данных Ovation Prime.
     */
    CastType[CastType["FORECAST"] = 0] = "FORECAST";
    /**
     * Наблюдаемые данные Ovation Prime.
     */
    CastType[CastType["NOWCAST"] = 1] = "NOWCAST";
    CastType[CastType["SECOND_FORECAST"] = 2] = "SECOND_FORECAST";
})(CastType || (CastType = {}));
