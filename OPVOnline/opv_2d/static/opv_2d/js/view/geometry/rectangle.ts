/*
 * В данном файле содержится реализация прямоугольника на плоскости.
 */

/**
 * Прямоугольник на плоскости.
 * @author Иван Шагурин
 */
class Rectangle {
    /**
     * Координата x левой верхней вершины.
     */
    public x: number

    /**
     * Координата y левой верхней вершины.
     */
    public y: number

    /**
     * Ширина.
     */
    public width: number

    /**
     * Высота.
     */
    public height: number

    /**
     * Конструктор - создание нового объекта.
     * @param x координата x левой верхней вершины.
     * @param y координата y левой верхней вершины.
     * @param width ширина.
     * @param height высота.
     */
    public constructor(x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
}
