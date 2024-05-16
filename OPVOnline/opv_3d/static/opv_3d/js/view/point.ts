/*
 * В данном файле содержится реализация точки на плоскости.
 */

/**
 * Точка на плоскости.
 * @author Иван Шагурин
 */
class Point {
	/**
	 * Точность, которая определяет равенство точек.
	 */
	public static readonly EPS: number = 0.01

	/**
	 * Координата x.
	 */
	public x: number = 0

	/**
	 * Координата y.
	 */
	public y: number = 0

	/**
	 * Конструктор - создание нового объекта.
	 * @param x координата x.
	 * @param y координата y.
	 */
	public constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	/**
	 * Устанавливаем приблизительное равенство между
	 * этой и указанной точкой.
	 * @param point точка, координаты которой надо сравнить с этой точкой.
	 * @returns true, если точки приблизительно равны. Иначе - false.
	 */
	public approximatelyEquals(point: Point): boolean {
		return (
			(Math.abs(this.x - point.x) <= Point.EPS)
			&& (Math.abs(this.y - point.y) <= Point.EPS)
		)
	}
}
