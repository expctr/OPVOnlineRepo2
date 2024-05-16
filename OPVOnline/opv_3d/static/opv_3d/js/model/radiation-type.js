"use strict";
/*
 * В данном файле содержится перечисление с типом излучения,
 * которому относятся данные Ovation Prime.
 */
/**
 * Перечисление с типом излучения,
 * которому относятся данные Ovation Prime.
 * @author Иван Шагурин
 */
var RadiationType;
(function (RadiationType) {
    /**
     * Данные о вкладе рассеянного сияния.
     */
    RadiationType[RadiationType["DIFFUSE"] = 0] = "DIFFUSE";
    /**
     * Данные о вкладе ионов.
     */
    RadiationType[RadiationType["IONS"] = 1] = "IONS";
    /**
     * Данные о вкладе моноэнергетических пиков.
     */
    RadiationType[RadiationType["MONO"] = 2] = "MONO";
    /**
     * Данные о вкладе "broadband" ускорения.
     */
    RadiationType[RadiationType["WAVE"] = 3] = "WAVE";
    /**
     * Данные об общем вкладе авроральных компонент.
     */
    RadiationType[RadiationType["TOTAL"] = 4] = "TOTAL";
})(RadiationType || (RadiationType = {}));
