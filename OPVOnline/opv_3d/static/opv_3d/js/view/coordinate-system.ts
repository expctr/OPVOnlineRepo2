/*
 * В данном файле содержится перечисление с типом системы отсчета.
 */

/**
 * Перечисление с типом системы отсчета.
 * @author Иван Шагурин
 */
enum CoordinateSystem {
	/**
	 * Система отсчета относительно холста.
	 */
	CANVAS,
	/**
	 * Система отсчета относительно дисплея.
	 */
	DISPLAY,

	WEBGL,
}
