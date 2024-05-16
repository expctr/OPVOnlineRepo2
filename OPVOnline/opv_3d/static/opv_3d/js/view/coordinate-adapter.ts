/*
 * В данном файле содержится класс для преобразования координат.
 */

/**
 * Класс для преобразования координат.
 * @author Иван Шагурин
 */
class CoordinateAdapter {
	/**
	 * Дисплей.
	 */
	display: Display | null = null

	/**
	 * Координата x в системе отсчета холста.
	 */
	xInCanvas: number = 0

	/**
	 * Координата y в системе отсчета холста.
	 */
	yInCanvas: number = 0

	public static firstCoordinateAdapter: CoordinateAdapter = new CoordinateAdapter()
	public static secondCoordinateAdapter: CoordinateAdapter = new CoordinateAdapter()
	public static thirdCoordinateAdapter: CoordinateAdapter = new CoordinateAdapter()
	public static fourthCoordinateAdapter: CoordinateAdapter = new CoordinateAdapter()

	/**
	 * Конструктор - создание нового объекта.
	 * @param display дисплей.
	 */
	private constructor() {
	}

	public setDisplay(display: Display) {
		this.display = display
	}

	/**
	 * Устанавливаем коордианты.
	 * @param x координата x.
	 * @param y координата y.
	 * @param coordinateSystem система отсчета, в которой заданы упомянутые координаты.
	 */
	public set(
		x: number,
		y: number,
		coordinateSystem: CoordinateSystem
	): void {
		switch (coordinateSystem) {
			case CoordinateSystem.CANVAS:
				this.xInCanvas = x
				this.yInCanvas = y
				break
			case CoordinateSystem.DISPLAY:
				this.xInCanvas = x + this.display!.getOffsetX()
				this.yInCanvas = -y + this.display!.getOffsetY()
				break
			case CoordinateSystem.WEBGL:
				this.xInCanvas = x * 4
				this.yInCanvas = y * 4
			default:
				alert('Неизвестная система координат')
		}
	}

	/**
	 * Получаем координату x в заданной системе отсчета.
	 * @param coordinateSystem упомянутая система отсчета.
	 * @returns упомянутая координата x.
	 */
	public getX(coordinateSystem: CoordinateSystem): number {
		switch (coordinateSystem) {
			case CoordinateSystem.CANVAS:
				return this.xInCanvas
			case CoordinateSystem.DISPLAY:
				return this.xInCanvas - this.display!.getOffsetX()
			case CoordinateSystem.WEBGL:
				return this.xInCanvas / 4
			default:
				alert('Неизвестная система координат')
				return 0
		}
	}

	/**
	 * Получаем координату y в заданной системе отсчета.
	 * @param coordinateSystem упомянутая система отсчета.
	 * @returns упомянутая координата y.
	 */
	public getY(coordinateSystem: CoordinateSystem): number {
		switch (coordinateSystem) {
			case CoordinateSystem.CANVAS:
				return this.yInCanvas
			case CoordinateSystem.DISPLAY:
				return -this.yInCanvas + this.display!.getOffsetY()
			case CoordinateSystem.WEBGL:
				return this.yInCanvas / 4
			default:
				alert('Неизвестная система координат')
				return 0
		}
	}
}
