/*
 * В данном файле содержится реализация класса, который соответствует точке в полярной
 * системе координат.
 */

class PointPolar {
	public polarDistance: number = 0

	public polarAngle: number = 0

	public constructor(polarDistance: number, polarAngle: number) {
		this.polarDistance = polarDistance
		this.polarAngle = polarAngle
	}

	/**
 * Получаем полярный угол.
 * @returns полярный угол.
 */
	public getPolarAngle(): number {
		return this.polarAngle
	}

	/**
	 * Получаем полярный угол в радианах.
	 * @returns полярный угол в радианах.
	 */
	public getStandardPolarAngle(): number {
		return (this.polarAngle - 6) * Math.PI / 12
	}

	/**
	 * Получаем полярное расстояние.
	 * @returns полярное расстояние.
	 */
	public getPolarDistance(): number {
		return this.polarDistance
	}

	/**
	 * Получаем стандартное полярное расстояние.
	 * @param displayWidth ширина экрана.
	 * @returns стандартное полярное расстояние.
	 */
	public getStandardPolarDistance(displayWidth: number): number {
		return (90 - this.polarDistance) / 80 * displayWidth
	}

	/**
	 * Получаем стандартную координату x.
	 * @param displayWidth ширина экрана.
	 * @returns стандартная координата x.
	 */
	public getStandardX(displayWidth: number): number {
		return this.getStandardPolarDistance(displayWidth)
			* Math.cos(this.getStandardPolarAngle())
	}

	/**
	 * Получаем стандартную координату y.
	 * @param displayWidth ширина экрана.
	 * @returns стандартная координата y.
	 */
	public getStandardY(displayWidth: number): number {
		return this.getStandardPolarDistance(displayWidth)
			* Math.sin(this.getStandardPolarAngle())
	}
}