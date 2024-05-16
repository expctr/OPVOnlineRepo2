/*
 * В данном файле содержится реализация радиус-вектора.
 */

/**
 * Радиус-вектор.
 * @author Иван Шагурин
 */
class RadiusVector {
	/**
	 * Конец радиус-вектора.
	 */
	private arrowhead: Point = new Point(0, 0)

	/**
	 * Получаем координату x конца радиус-вектора.
	 * @returns упомянутая координата x.
	 */
	public getArrowheadX(): number {
		return this.arrowhead.x
	}

	/**
	 * Получаем координату y конца радиус-вектора.
	 * @returns упомянутая координата y.
	 */
	public getArrowheadY(): number {
		return this.arrowhead.y
	}

	/**
	 * Получаем длину радиус-вектора.
	 * @returns упомянутая длина.
	 */
	public getLength(): number {
		return Math.sqrt(
			this.arrowhead.x * this.arrowhead.x
			+ this.arrowhead.y * this.arrowhead.y
		)
	}

	/**
	 * Конструктор - создание нового объекта.
	 * @param xFrom координата x начала.
	 * @param yFrom координата y начала.
	 * @param xTo координата x конца.
	 * @param yTo координата y конца.
	 */
	public constructor(
		xFrom: number,
		yFrom: number,
		xTo: number,
		yTo: number
	) {
		this.arrowhead = new Point(xTo - xFrom, yTo - yFrom)
	}

	/**
	 * Применяем поворот к радиус-вектору.
	 * @param angle угол поворота.
	 */
	public applyRotation(angle: number): void {
		let xRotated: number
			= this.arrowhead.x * Math.cos(angle)
			- this.arrowhead.y * Math.sin(angle)
		let yRotated: number
			= this.arrowhead.x * Math.sin(angle)
			+ this.arrowhead.y * Math.cos(angle)

		this.arrowhead.x = xRotated
		this.arrowhead.y = yRotated
	}

	/**
	 * Применяем гомотетию к радиус-вектору.
	 * @param ratio коэффициент гомотетии.
	 */
	public applyHomothety(ratio: number): void {
		this.arrowhead.x *= ratio
		this.arrowhead.y *= ratio
	}
}