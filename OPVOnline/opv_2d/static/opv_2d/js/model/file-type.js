"use strict";
/*
 * В данном файле содержится класс с информацией о выбранном
 * типе файлов для визуализации.
 */
/**
 * Класс с информацией о выбранном типе файлов для визуализации.
 * @author Иван Шагурин
 */
class FileType {
    /**
     * Конструктор - создание нового объекта.
     * @param horizonSideType перечисление с типом полусферы.
     * @param castType перечисление с типом прогноза / наблюдаемого значения.
     * @param radiationType перечисление с типом излучения.
     */
    constructor(horizonSideType, castType, radiationType) {
        this.horizonSideType = horizonSideType;
        this.castType = castType;
        this.radiationType = radiationType;
    }
    /**
     * Получаем строковое представление класса.
     * @returns описанное строковое представление.
     */
    getStringRepresentation() {
        let horizonSideTypeRepresentation = this.getHorizonSideTypeComponent();
        let castTypeRepresentation = this.getCastTypeComponent();
        let radiationTypeRepresentation = this.getRadiationTypeComponent();
        if (!horizonSideTypeRepresentation
            || !castTypeRepresentation
            || !radiationTypeRepresentation) {
            return null;
        }
        return horizonSideTypeRepresentation
            + ' ' + castTypeRepresentation
            + ' ' + radiationTypeRepresentation;
    }
    /**
     * Получаем строковое представление типа полусферы.
     * @returns описанное строковое представление.
     */
    getHorizonSideTypeComponent() {
        if (this.horizonSideType == HorizonSideType.NORTH) {
            return 'north';
        }
        else if (this.horizonSideType == HorizonSideType.SOUTH) {
            return 'south';
        }
        else {
            return null;
        }
    }
    /**
     * Получаем строковое представление с типом прогноза / наблюдаемого значения.
     * @returns описаное строковое представление.
     */
    getCastTypeComponent() {
        if (this.castType == CastType.FORECAST) {
            return 'forecast';
        }
        else if (this.castType == CastType.NOWCAST) {
            return 'nowcast';
        }
        else {
            return null;
        }
    }
    /**
     * Получаем строковое представление типа излучения.
     * @returns описанное строковое представление.
     */
    getRadiationTypeComponent() {
        if (this.radiationType == RadiationType.DIFFUSE) {
            return 'diffuse';
        }
        else if (this.radiationType == RadiationType.IONS) {
            return 'ions';
        }
        else if (this.radiationType == RadiationType.MONO) {
            return 'mono';
        }
        else if (this.radiationType == RadiationType.WAVE) {
            return 'wave';
        }
        else if (this.radiationType == RadiationType.TOTAL) {
            return 'total';
        }
        else {
            return null;
        }
    }
    /**
     * Проверяем равенство данного класса с аргументом.
     * @param fileType аргумент для сравнения.
     * @returns true, если проверка на равенство пройдена. Иначе - false.
     */
    isEqual(fileType) {
        if (fileType == null) {
            return false;
        }
        return (this.horizonSideType == fileType.horizonSideType)
            && (this.castType == fileType.castType)
            && (this.radiationType == fileType.radiationType);
    }
}
