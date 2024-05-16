/*
 * В данном файле содержится реализация отрезка на сфере.
 */

/**
 * Отрезок на плоскости.
 * @author Иван Шагурин
 */
class SegmentOnSphere {
    /**
     * Первый конец отрезка.
     */
    private readonly firstEnd: PointOnShpere

    /**
     * Второй конец отрезка.
     */
    private readonly secondEnd: PointOnShpere

    /**
     * Первый соседний отрезок.
     */
    private firstNeighbour: SegmentOnSphere | null = null

    /**
     * Второй соседний отрезок.
     */
    private secondNeighbour: SegmentOnSphere | null = null

    /**
     * Ориентация отрезка.
     */
    private orientation: SegmentOrientation | null

    /**
     * Список соседей по первому концу.
     */
    public firstEndNeighbours: SegmentOnSphere[] = []

    /**
     * Список соседей по второму концу.
     */
    public secondEndNeighbours: SegmentOnSphere[] = []

    /**
     * Конструктор - создание нового объекта.
     * @param firstEnd первый конец отрезка.
     * @param secondEnd второй конец отрезка.
     * @param orientation ориентация.
     */
    public constructor(firstEnd: PointOnShpere, secondEnd: PointOnShpere, orientation: SegmentOrientation | null) {
        this.firstEnd = firstEnd
        this.secondEnd = secondEnd
        this.orientation = orientation
    }

    /**
     * Получаем первый соседний отрезок.
     * @returns упомянутый отрезок.
     */
    public getFirstNeighbour(): SegmentOnSphere | null {
        return this.firstNeighbour
    }

    /**
     * Получаем второй соседний отрезок.
     * @returns упомянутый отрезок.
     */
    public getSecondNeighbour(): SegmentOnSphere | null {
        return this.secondNeighbour
    }

    /**
     * Проверяем, что указанный отрезок является новым соседом
     * текущего отрезка.
     * @param segment указанный отрезок.
     * @returns true, если упомянутое утверждение истинно. Иначе - false.
     */
    public isNewNeighbour(segment: SegmentOnSphere): boolean {
        if ((this.firstNeighbour == segment) || (this.secondNeighbour == segment)) {
            return false
        } else if ((segment.firstNeighbour == this) || (segment.secondNeighbour == this)) {
            return false
        } else {
            return (this.firstEnd.approximatelyEquals(segment.firstEnd)
                || (this.firstEnd.approximatelyEquals(segment.secondEnd)
                    || (this.secondEnd.approximatelyEquals(segment.firstEnd))
                    || (this.secondEnd.approximatelyEquals(segment.secondEnd))))
        }
    }

    /**
     * Проверяем, что указанный отрезок является соседом по первому концу.
     * @param segment указанный отрезок.
     * @returns true, если упомянутое утверждение истинно. Иначе - false.
     */
    public isFirstNeighbour(segment: SegmentOnSphere): boolean {
        if (this.firstEnd.approximatelyEquals(segment.firstEnd)
            && this.secondEnd.approximatelyEquals(segment.secondEnd)) {
            return false;
        } else if (this.firstEnd.approximatelyEquals(segment.secondEnd)
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
    public isSecondNeighbour(segment: SegmentOnSphere): boolean {
        if (this.firstEnd.approximatelyEquals(segment.firstEnd)
            && this.secondEnd.approximatelyEquals(segment.secondEnd)) {
            return false;
        } else if (this.firstEnd.approximatelyEquals(segment.secondEnd)
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
    public connectAsNeighbour(segment: SegmentOnSphere): void {
        if (this.firstNeighbour == null) {
            this.firstNeighbour = segment;
        } else if (this.secondNeighbour == null) {
            this.secondNeighbour = segment;
        }

        if (segment.firstNeighbour == null) {
            segment.firstNeighbour = this;
        } else if (segment.secondNeighbour == null) {
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
    public connectWithFirstTrueNeighbour(): void {
        if (this.firstEndNeighbours.length == 1) {
            this.firstNeighbour = this.firstEndNeighbours[0];
        } else {
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
    public connectWithSecondTrueNeighbour(): void {
        if (this.secondEndNeighbours.length == 1) {
            this.secondNeighbour = this.secondEndNeighbours[0]
        } else {
            let secondSameOrientedNeighbour = this.getSecondSameOrientedNeighbour()

            if (secondSameOrientedNeighbour != null) {
                this.secondNeighbour = secondSameOrientedNeighbour
            }
        }
    }

    /**
     * Получаем соседа по первому концу с той же ориентацией.
     * @returns упомянтый отрезок.
     */
    private getFirstSameOrientedNeighbour(): SegmentOnSphere | null {
        for (let i = 0; i < this.firstEndNeighbours.length; ++i) {
            if (this.orientation == this.firstEndNeighbours[i].orientation) {
                return this.firstEndNeighbours[i]
            }
        }

        return null
    }

    /**
     * Получаем соседа по второму концу с той же ориентацией.
     * @returns упомянутый отрезок.
     */
    private getSecondSameOrientedNeighbour(): SegmentOnSphere | null {
        for (let i = 0; i < this.secondEndNeighbours.length; ++i) {
            if (this.orientation == this.secondEndNeighbours[i].orientation) {
                return this.secondEndNeighbours[i]
            }
        }

        return null
    }

    /**
     * Получаем середину отрезка.
     * @returns середина отрезка.
     */
    public getMiddle(): PointOnShpere {
        let lat = (this.firstEnd.lat + this.secondEnd.lat) / 2
        let lon = (this.firstEnd.lon + this.secondEnd.lon) / 2

        if (this.firstEnd.lon * this.secondEnd.lon < 0) {
            lon += 180
        }

        if (lon > 360) {
            lon -= 360
        }

        return new PointOnShpere(
            lat,
            lon
        )
    }

    public isBad(): boolean {
        // return false
        return (this.firstEnd.lon * this.secondEnd.lon) < 0
    }

    /**
     * Проверяем, что отрезок имеет обоих соседей.
     * @returns true, если упомянутое утверждение истинно. Иначе - false.
     */
    public hasBothNeighbours(): boolean {
        return (this.firstNeighbour != null) && (this.secondNeighbour != null)
    }

    /**
     * Получаем точку пересечения данного отрезка и его первого соседа.
     * @returns упомянутая точка.
     */
    public getIntersectionWithFirstNeighbour(): PointOnShpere | null {
        if (this.firstNeighbour == null) {
            return null;
        } else if (this.firstEnd.approximatelyEquals(this.firstNeighbour.firstEnd)) {
            return this.firstEnd;
        } else if (this.firstEnd.approximatelyEquals(this.firstNeighbour.secondEnd)) {
            return this.firstEnd;
        } else if (this.secondEnd.approximatelyEquals(this.firstNeighbour.firstEnd)) {
            return this.secondEnd;
        } else if (this.secondEnd.approximatelyEquals(this.firstNeighbour.secondEnd)) {
            return this.secondEnd;
        } else {
            return null;
        }
    }

    /**
     * Возвращаем точку пересечения данного отрезка и его второго соседа.
     * @returns упомянутая точка.
     */
    public getIntersectionWithSecondNeighbour(): PointOnShpere | null {
        if (this.secondNeighbour == null) {
            return null;
        } else if (this.firstEnd.approximatelyEquals(this.secondNeighbour.firstEnd)) {
            return this.firstEnd;
        } else if (this.firstEnd.approximatelyEquals(this.secondNeighbour.secondEnd)) {
            return this.firstEnd;
        } else if (this.secondEnd.approximatelyEquals(this.secondNeighbour.firstEnd)) {
            return this.secondEnd;
        } else if (this.secondEnd.approximatelyEquals(this.secondNeighbour.secondEnd)) {
            return this.secondEnd;
        } else {
            return null;
        }
    }

    /**
     * Получаем точку, которая делит данный отрезок в указанном отношении.
     * @param ratio отношение длины отрезка между первым концом исходного отрезка
     *              и упомянутой точкой и длины исходного отрезка.
     * @returns упомянутая точка.
     */
    public getRatioPoint(ratio: number): PointOnShpere {
        if (ratio == 0) {
            return this.firstEnd
        } else if (ratio == 1) {
            return this.secondEnd
        }

        let lambda = ratio / (1 - ratio)

        let lat = (this.firstEnd.lat + lambda * this.secondEnd.lat) / (1 + lambda)
        let lon = (this.firstEnd.lon + lambda * this.secondEnd.lon) / (1 + lambda)

        return new PointOnShpere(lat, lon)
    }

    public getFirstEnd(): PointOnShpere {
        return this.firstEnd
    }

    public getSecondEnd(): PointOnShpere {
        return this.secondEnd
    }

    public adjustFirst(): void {
        this.firstEnd.lon += 180

        // if (this.firstEnd.lon >= 360) {
        //     this.firstEnd.lon -= 360
        // }
    }

    public adjustSecond(): void {
        this.secondEnd.lon += 180

        // if (this.secondEnd.lon >= 360) {
        //     this.secondEnd.lon -= 360
        // }
    }
}