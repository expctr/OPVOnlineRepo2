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
	 * Перечисление с типом полусферы.
	 */
	public readonly horizonSideType: HorizonSideType

	/**
	 * Перечисление с типом прогноза / наблюдаемого значения.
	 */
	public readonly castType: CastType

	/**
	 * Перечисление с типом излучения.
	 */
	public readonly radiationType: RadiationType

	/**
	 * Конструктор - создание нового объекта.
	 * @param horizonSideType перечисление с типом полусферы.
	 * @param castType перечисление с типом прогноза / наблюдаемого значения.
	 * @param radiationType перечисление с типом излучения.
	 */
	public constructor(
		horizonSideType: HorizonSideType,
		castType: CastType,
		radiationType: RadiationType
	) {
		this.horizonSideType = horizonSideType
		this.castType = castType
		this.radiationType = radiationType
	}

	/**
	 * Получаем строковое представление класса.
	 * @returns описанное строковое представление.
	 */
	public getStringRepresentation(): string | null {
		let horizonSideTypeRepresentation = this.getHorizonSideTypeComponent()
		let castTypeRepresentation = this.getCastTypeComponent()
		let radiationTypeRepresentation = this.getRadiationTypeComponent()

		if (!horizonSideTypeRepresentation
			|| !castTypeRepresentation
			|| !radiationTypeRepresentation) {
			return null
		}

		return horizonSideTypeRepresentation
		+ ' ' + castTypeRepresentation
		+ ' ' + radiationTypeRepresentation
	}

	/**
	 * Получаем строковое представление типа полусферы.
	 * @returns описанное строковое представление.
	 */
	private getHorizonSideTypeComponent(): string | null {
		if (this.horizonSideType == HorizonSideType.NORTH) {
			return 'north'
		} else if (this.horizonSideType == HorizonSideType.SOUTH) {
			return 'south'
		} else {
			return null
		}
	}

	/**
	 * Получаем строковое представление с типом прогноза / наблюдаемого значения.
	 * @returns описаное строковое представление.
	 */
	private getCastTypeComponent(): string | null {
		if (this.castType == CastType.FORECAST) {
			return 'forecast'
		} else if (this.castType == CastType.NOWCAST) {
			return 'nowcast'
		} else {
			return null
		}
	}

	/**
	 * Получаем строковое представление типа излучения.
	 * @returns описанное строковое представление.
	 */
	private getRadiationTypeComponent(): string | null {
		if (this.radiationType == RadiationType.DIFFUSE) {
			return 'diffuse'
		} else if (this.radiationType == RadiationType.IONS) {
			return 'ions'
		} else if (this.radiationType == RadiationType.MONO) {
			return 'mono'
		} else if (this.radiationType == RadiationType.WAVE) {
			return 'wave'
		} else if (this.radiationType == RadiationType.TOTAL) {
			return 'total'
		} else {
			return null
		}
	}

	/**
	 * Проверяем равенство данного класса с аргументом.
	 * @param fileType аргумент для сравнения.
	 * @returns true, если проверка на равенство пройдена. Иначе - false.
	 */
	public isEqual(fileType: FileType | null): boolean {
		if (fileType == null) {
			return false
		}

		return (this.horizonSideType == fileType.horizonSideType)
		&& (this.castType == fileType.castType)
		&& (this.radiationType == fileType.radiationType)
	}
}