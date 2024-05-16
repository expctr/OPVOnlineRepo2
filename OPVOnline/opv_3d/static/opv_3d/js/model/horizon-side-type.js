"use strict";
/*
 * В данном файле содержится перечисление с типом полусферы,
 * к которой относятся данные Ovation Prime.
 */
/**
 * Перечисление с типом полусферы, к которой относятся
 * данные Ovation prime.
 *
 * @author Иван Шагурин
 */
var HorizonSideType;
(function (HorizonSideType) {
    /**
     * Северная полусфера.
     */
    HorizonSideType[HorizonSideType["NORTH"] = 0] = "NORTH";
    /**
     * Южная полусфера.
     */
    HorizonSideType[HorizonSideType["SOUTH"] = 1] = "SOUTH";
})(HorizonSideType || (HorizonSideType = {}));
