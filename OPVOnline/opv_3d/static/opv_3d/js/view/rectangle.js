"use strict";
/*
 * В данном файле содержится реализация прямоугольника на плоскости.
 */
/**
 * Прямоугольник на плоскости.
 * @author Иван Шагурин
 */
class Rectangle {
    /**
     * Конструктор - создание нового объекта.
     * @param x координата x левой верхней вершины.
     * @param y координата y левой верхней вершины.
     * @param width ширина.
     * @param height высота.
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
