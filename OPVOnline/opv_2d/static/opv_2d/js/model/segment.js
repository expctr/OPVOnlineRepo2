"use strict";
/*
 * В данном файле содержится реализация отрезка на плоскости.
 */
/**
 * Отрезок на плоскости.
 * @author Иван Шагурин
 */
class Segment {
    /**
     * Конструктор - создание нового объекта.
     * @param firstEnd первый конец отрезка.
     * @param secondEnd второй конец отрезка.
     * @param orientation ориентация.
     */
    constructor(firstEnd, secondEnd, orientation) {
        /**
         * Первый соседний отрезок.
         */
        this.firstNeighbour = null;
        /**
         * Второй соседний отрезок.
         */
        this.secondNeighbour = null;
        /**
         * Список соседей по первому концу.
         */
        this.firstEndNeighbours = [];
        /**
         * Список соседей по второму концу.
         */
        this.secondEndNeighbours = [];
        this.firstEnd = firstEnd;
        this.secondEnd = secondEnd;
        this.orientation = orientation;
    }
    /**
     * Получаем первый соседний отрезок.
     * @returns упомянутый отрезок.
     */
    getFirstNeighbour() {
        return this.firstNeighbour;
    }
    /**
     * Получаем второй соседний отрезок.
     * @returns упомянутый отрезок.
     */
    getSecondNeighbour() {
        return this.secondNeighbour;
    }
    /**
     * Проверяем, что указанный отрезок является новым соседом
     * текущего отрезка.
     * @param segment указанный отрезок.
     * @returns true, если упомянутое утверждение истинно. Иначе - false.
     */
    isNewNeighbour(segment) {
        if ((this.firstNeighbour == segment) || (this.secondNeighbour == segment)) {
            return false;
        }
        else if ((segment.firstNeighbour == this) || (segment.secondNeighbour == this)) {
            return false;
        }
        else {
            return (this.firstEnd.approximatelyEquals(segment.firstEnd)
                || (this.firstEnd.approximatelyEquals(segment.secondEnd)
                    || (this.secondEnd.approximatelyEquals(segment.firstEnd))
                    || (this.secondEnd.approximatelyEquals(segment.secondEnd))));
        }
    }
    /**
     * Проверяем, что указанный отрезок является соседом по первому концу.
     * @param segment указанный отрезок.
     * @returns true, если упомянутое утверждение истинно. Иначе - false.
     */
    isFirstNeighbour(segment) {
        if (this.firstEnd.approximatelyEquals(segment.firstEnd)
            && this.secondEnd.approximatelyEquals(segment.secondEnd)) {
            return false;
        }
        else if (this.firstEnd.approximatelyEquals(segment.secondEnd)
            && this.secondEnd.approximatelyEquals(segment.firstEnd)) {
            return false;
        }
        return this.firstEnd.approximatelyEquals(segment.firstEnd)
            || this.firstEnd.approximatelyEquals(segment.secondEnd);
    }
    /**
     * Проверяем, что указанный отрезок является соседом по второму концу.
     * @param segment указанный отрезок.
     * @returns true, если упомянутое утверждение истинно. Иначе - false.
     */
    isSecondNeighbour(segment) {
        if (this.firstEnd.approximatelyEquals(segment.firstEnd)
            && this.secondEnd.approximatelyEquals(segment.secondEnd)) {
            return false;
        }
        else if (this.firstEnd.approximatelyEquals(segment.secondEnd)
            && this.secondEnd.approximatelyEquals(segment.firstEnd)) {
            return false;
        }
        return this.secondEnd.approximatelyEquals(segment.firstEnd)
            || this.secondEnd.approximatelyEquals(segment.secondEnd);
    }
    /**
     * Связываем текущий отрезок и указанный в качестве соседей.
     * @param segment указанный отрезок.
     */
    connectAsNeighbour(segment) {
        if (this.firstNeighbour == null) {
            this.firstNeighbour = segment;
        }
        else if (this.secondNeighbour == null) {
            this.secondNeighbour = segment;
        }
        if (segment.firstNeighbour == null) {
            segment.firstNeighbour = this;
        }
        else if (segment.secondNeighbour == null) {
            segment.secondNeighbour = this;
        }
    }
    /**
     * Связываем отрезок с истинным соседом по певому концу.
     * Если по первому концу имеется ровно один сосед, то он
     * считается истинным соседом по первому концу. Если по первому
     * концу имеется более одного соседа, то истинным соседом считается
     * сосед с той же ориентацией.
     */
    connectWithFirstTrueNeighbour() {
        if (this.firstEndNeighbours.length == 1) {
            this.firstNeighbour = this.firstEndNeighbours[0];
        }
        else {
            let firstSameOrientedNeighbour = this.getFirstSameOrientedNeighbour();
            if (firstSameOrientedNeighbour != null) {
                this.firstNeighbour = firstSameOrientedNeighbour;
            }
        }
    }
    /**
     * Связываем отрезок с истинным соседом по второму концу.
     * Если по второму концу имеется ровно один сосед, то он
     * считается истинным соседом по второму концу. Если по второму
     * концу имеется более одного соседа, то истинным соседом считается
     * сосед с той же ориентацией.
     */
    connectWithSecondTrueNeighbour() {
        if (this.secondEndNeighbours.length == 1) {
            this.secondNeighbour = this.secondEndNeighbours[0];
        }
        else {
            let secondSameOrientedNeighbour = this.getSecondSameOrientedNeighbour();
            if (secondSameOrientedNeighbour != null) {
                this.secondNeighbour = secondSameOrientedNeighbour;
            }
        }
    }
    /**
     * Получаем соседа по первому концу с той же ориентацией.
     * @returns упомянтый отрезок.
     */
    getFirstSameOrientedNeighbour() {
        for (let i = 0; i < this.firstEndNeighbours.length; ++i) {
            if (this.orientation == this.firstEndNeighbours[i].orientation) {
                return this.firstEndNeighbours[i];
            }
        }
        return null;
    }
    /**
     * Получаем соседа по второму концу с той же ориентацией.
     * @returns упомянутый отрезок.
     */
    getSecondSameOrientedNeighbour() {
        for (let i = 0; i < this.secondEndNeighbours.length; ++i) {
            if (this.orientation == this.secondEndNeighbours[i].orientation) {
                return this.secondEndNeighbours[i];
            }
        }
        return null;
    }
    /**
     * Получаем середину отрезка.
     * @returns середина отрезка.
     */
    getMiddle() {
        return new Point((this.firstEnd.x + this.secondEnd.x) / 2, (this.firstEnd.y + this.secondEnd.y) / 2);
    }
    /**
     * Проверяем, что отрезок имеет обоих соседей.
     * @returns true, если упомянутое утверждение истинно. Иначе - false.
     */
    hasBothNeighbours() {
        return (this.firstNeighbour != null) && (this.secondNeighbour != null);
    }
    /**
     * Получаем точку пересечения данного отрезка и его первого соседа.
     * @returns упомянутая точка.
     */
    getIntersectionWithFirstNeighbour() {
        if (this.firstNeighbour == null) {
            return null;
        }
        else if (this.firstEnd.approximatelyEquals(this.firstNeighbour.firstEnd)) {
            return this.firstEnd;
        }
        else if (this.firstEnd.approximatelyEquals(this.firstNeighbour.secondEnd)) {
            return this.firstEnd;
        }
        else if (this.secondEnd.approximatelyEquals(this.firstNeighbour.firstEnd)) {
            return this.secondEnd;
        }
        else if (this.secondEnd.approximatelyEquals(this.firstNeighbour.secondEnd)) {
            return this.secondEnd;
        }
        else {
            return null;
        }
    }
    /**
     * Возвращаем точку пересечения данного отрезка и его второго соседа.
     * @returns упомянутая точка.
     */
    getIntersectionWithSecondNeighbour() {
        if (this.secondNeighbour == null) {
            return null;
        }
        else if (this.firstEnd.approximatelyEquals(this.secondNeighbour.firstEnd)) {
            return this.firstEnd;
        }
        else if (this.firstEnd.approximatelyEquals(this.secondNeighbour.secondEnd)) {
            return this.firstEnd;
        }
        else if (this.secondEnd.approximatelyEquals(this.secondNeighbour.firstEnd)) {
            return this.secondEnd;
        }
        else if (this.secondEnd.approximatelyEquals(this.secondNeighbour.secondEnd)) {
            return this.secondEnd;
        }
        else {
            return null;
        }
    }
    /**
     * Получаем точку, которая делит данный отрезок в указанном отношении.
     * @param ratio отношение длины отрезка между первым концом исходного отрезка
     *              и упомянутой точкой и длины исходного отрезка.
     * @returns упомянутая точка.
     */
    getRatioPoint(ratio) {
        if (ratio == 0) {
            return this.firstEnd;
        }
        else if (ratio == 1) {
            return this.secondEnd;
        }
        let lambda = ratio / (1 - ratio);
        let x = (this.firstEnd.x + lambda * this.secondEnd.x) / (1 + lambda);
        let y = (this.firstEnd.y + lambda * this.secondEnd.y) / (1 + lambda);
        return new Point(x, y);
    }
}
