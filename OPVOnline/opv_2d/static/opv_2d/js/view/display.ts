/*
 * В данном файле содержится дисплей для визуализации.
 */

/**
 * Дисплей.
 * @author Иван Шагурин
 */
class Display {
	/**
	 * Коэффициент сжатия изображения по умолчанию.
	 */
	// private static readonly DEFAULT_COMPRESSION_RATIO: number = 0.85

	/**
	 * Коэффициент, который задает позицию изображения по умолчанию.
	 */
	private static readonly DEFAULT_POSITION_RATIO: number = 0.5

	/**
	 * Коэффициент увеличения размеров дисплея при
	 * однократной прокрутке колесика мыши.
	 */
	public static readonly INCREASE_SIZE_RATIO: number = 1.2

	/**
	 * Минимальная ширина.
	 */
	// private static readonly MIN_WIDTH: number = 1567
	private static readonly MIN_WIDTH: number = 1000

	/**
	 * Минимальная высота.
	 */
	// private static readonly MIN_HEIGHT: number = 1567
	private static readonly MIN_HEIGHT: number = 100

	/**
	 * Максимальная ширина.
	 */
	private static readonly MAX_WIDTH: number = 9705

	/**
	 * Максмальная высота.
	 */
	private static readonly MAX_HEIGHT: number = 9705

	/**
	 * Минимальный сдвиг по оси X.
	 */
	private static readonly MIN_OFFSET_X: number = -5254

	/**
	 * Максимальный сдвиг по оси X.
	 */
	private static readonly MAX_OFFSET_X: number = 7585

	/**
	 * Минимальный сдвиг по оси Y.
	 */
	private static readonly MIN_OFFSET_Y: number = -5309

	/**
	 * Максимальный сдвиг по оси Y.
	 */
	private static readonly MAX_OFFSET_Y: number = 7140

	/**
	 * Холст.
	 */
	public readonly canvas: HTMLCanvasElement | null = null

	/**
	 * Объект для рисования на холсте.
	 */
	private readonly context: CanvasRenderingContext2D | null = null

	public readonly gl: WebGLRenderingContext | null = null

	/**
	 * Ширина.
	 */
	private width: number = 0

	/**
	 * Высота.
	 */
	private height: number = 0

	/**
	 * Сдвиг по оси X.
	 */
	private offsetX: number = 0

	/**
	 * Сдвиг по оси Y.
	 */
	private offsetY: number = 0

	private rotationAngleInRadians: number = 0

	/**
	 * Конструктор - создание нового объекта.
	 * @param canvas холст.
	 * @param width ширина холста.
	 * @param height высота холста.
	 * @param squareSizes флаг, который поднят, если размеры
	 *                    дисплея должны быть квадратными. Иначе
	 *                    его ширина и высота пропорциональны ширине
	 *                    и высоте холста.
	 */
	public constructor(
		canvas: HTMLCanvasElement,
		width: number,
		height: number,
		squareSizes: boolean,
		comprassionRatio: number,) {
		this.canvas = canvas

		this.context = canvas.getContext('2d')

		this.canvas.width = width
		this.canvas.height = height

		this.makeDefaulOffsetAndtSizes(squareSizes, comprassionRatio)
	}

	public getContext(): CanvasRenderingContext2D | null {
		return this.context
	}

	/**
	 * Устанавливаем сдвиг и размеры дисплея по умолчанию.
	 * @param squareSizes флаг, который поднят, если размеры
	 *                    дисплея должны быть квадратными. Иначе
	 *                    его ширина и высота пропорциональны ширине
	 *                    и высоте холста.
	 * @returns 
	 */
	public makeDefaulOffsetAndtSizes(squareSizes: boolean, comprassionRatio: number): void {
		if (this.canvas == null) {
			return
		}

		if (squareSizes) {
			this.width = Math.min(
				this.canvas.width,
				this.canvas.height
			) * comprassionRatio
			this.height = Math.min(
				this.canvas.width,
				this.canvas.height
			) * comprassionRatio
		} else {
			this.width = this.canvas.width * comprassionRatio
			this.height = this.canvas.height * comprassionRatio
		}

		this.offsetX = this.canvas.width * Display.DEFAULT_POSITION_RATIO
		this.offsetY = this.canvas.height * Display.DEFAULT_POSITION_RATIO
	}

	/**
	 * Задаем холсту указанные размеры.
	 * @param width ширина холста.
	 * @param height высота холста.
	 * @returns 
	 */
	public adjustCanvasSizes(width: number, height: number): void {
		if (this.canvas == null) {
			return
		}

		this.canvas.width = width
		this.canvas.height = height
	}

	/**
	 * Получаем сдвиг по оси X.
	 * @returns упомянутый свдиг.
	 */
	public getOffsetX(): number {
		return this.offsetX
	}

	/**
	 * Получаем сдвиг по оси Y.
	 * @returns упомянутый сдвиг.
	 */
	public getOffsetY(): number {
		return this.offsetY
	}

	/**
	 * Получаем ширину.
	 * @returns упомянутая ширина.
	 */
	public getWidth(): number {
		return this.width
	}

	/**
	 * Получаем высоту.
	 * @returns упомянутая высота.
	 */
	public getHeight(): number {
		return this.height
	}

	public getCanvasWidth(): number {
		return this.canvas!.width
	}

	public getCanvasHeight(): number {
		return this.canvas!.height
	}

	/**
	 * Меняем сдвиг на указанные расстояния по оси X и Y.
	 * @param deltaX сдвиг по оси X.
	 * @param deltaY сдвиг по сои Y.
	 */
	public changeOffset(deltaX: number, deltaY: number): void {
		if ((Display.MIN_OFFSET_X <= this.offsetX + deltaX)
			&& (this.offsetX + deltaX <= Display.MAX_OFFSET_X)) {
			this.offsetX += deltaX
		}

		if ((Display.MIN_OFFSET_Y <= this.offsetY + deltaY)
			&& (this.offsetY + deltaY <= Display.MAX_OFFSET_Y)) {
			this.offsetY += deltaY
		}
	}

	/**
	 * Увеличиваем размеры, если это возможно.
	 * @returns true, если размеры были увеличины. Иначе - false.
	 */
	public increaseSizes(): boolean {
		if ((this.width * Display.INCREASE_SIZE_RATIO > Display.MAX_WIDTH)
			|| (this.height * Display.INCREASE_SIZE_RATIO > Display.MAX_HEIGHT)) {
			return false
		} else {
			this.width *= Display.INCREASE_SIZE_RATIO
			this.height *= Display.INCREASE_SIZE_RATIO

			return true
		}
	}

	/**
	 * Уменьшаем размеры, если это возможно.
	 * @returns true, если размеры были уменьшены. Иначе - false.
	 */
	public decreaseSizes(): boolean {
		if ((this.width / Display.INCREASE_SIZE_RATIO < Display.MIN_WIDTH)
			|| (this.height / Display.INCREASE_SIZE_RATIO) < Display.MIN_HEIGHT) {
			return false
		} else {
			this.width /= Display.INCREASE_SIZE_RATIO
			this.height /= Display.INCREASE_SIZE_RATIO

			return true
		}
	}

	public setRotationAngleInRadians(rotationAngleInRadians: number): void {
		this.rotationAngleInRadians = rotationAngleInRadians
	}

	public getRotationAngleInRadians(): number {
		return this.rotationAngleInRadians
	}

	public hideCanvas(): void {
		this.canvas!.style.display = "none"
	}

	public showCanvas(): void {
		this.canvas!.style.display = "inline"
	}

	public canvasIsVisible(): boolean {
		return this.canvas!.style.display != "none"
	}
}
