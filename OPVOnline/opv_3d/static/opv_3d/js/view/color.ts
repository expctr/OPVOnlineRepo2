/*
 * В данном файле содержится класс для работы с цветом.
 */

/**
 * Класс для работы с цветом.
 * @author Иван Шагурин
 */
class Color {
    /**
     * Красная компонента цвета.
     */
    public red: number

    /**
     * Зеленая компонента цвета.
     */
    public green: number

    /**
     * Синяя компонента цвета.
     */
    public blue: number

    public alpha: number

    /**
     * Конструктор - создание нового объекта.
     * @param red красная компонента цвета.
     * @param green зеленая компонента цвета.
     * @param blue синяя компонента цвета.
     */
    public constructor(red: number, green: number, blue: number, alpha: number) {
        this.red = red
        this.green = green
        this.blue = blue
        this.alpha = alpha
    }

    /**
     * Получаем цвет, который находится между указанными цветами и делит
     * отрезок между ними в заданном отношении.
     * @param leftBound левая граница отрезка, задающего отношение цветов.
     * @param leftBoundColor цвет левой границы отрезка, задающего отношение цветов.
     * @param rightBound левая граница отрезка, задающего отношение цветов.
     * @param rightBoundColor цвет правой границы отрезка, задающего отношение цветов.
     * @param intermediateValue координата точки на отрезке, задающего отношение цветов.
     *                          Определяет цвет промежуточной точки.
     * @returns упомянутый промежуточны1 цвет
     */
    public static getIntermediateColor(
        leftBound: number, leftBoundColor: Color,
        rightBound: number, rightBoundColor: Color,
        intermediateValue: number
    ): Color {
        if (intermediateValue == leftBound) {
            return leftBoundColor
        } else if (intermediateValue == rightBound) {
            return rightBoundColor
        }

        let lambda = (intermediateValue - leftBound)
            / (rightBound - intermediateValue)

        let red = (leftBoundColor.red + lambda * rightBoundColor.red)
            / (1 + lambda)
        let green = (leftBoundColor.green + lambda * rightBoundColor.green)
            / (1 + lambda)
        let blue = (leftBoundColor.blue + lambda * rightBoundColor.blue)
            / (1 + lambda)

        let alpha = (leftBoundColor.alpha + lambda * rightBoundColor.alpha)
            / (1 + lambda)

        return new Color(red, green, blue, alpha)
    }

    /**
     * Получаем цвет, который делит отрезок между указанными цветами пополам.
     * @param firstColor первый цвет.
     * @param secondColor второй цвет.
     * @returns цвет, который является серединой отрезка между указаннми цветами.
     */
    public static getMiddleColor(firstColor: Color, secondColor: Color): Color {
        let red = (firstColor.red + secondColor.red) / 2
        let green = (firstColor.green + secondColor.green) / 2
        let blue = (firstColor.blue + secondColor.blue) / 2

        return new Color(red, green, blue, 1)
    }

    /**
     * Получаем строковое представление цвета.
     * @returns упомянутое строковое представление.
     */
    public toString(): string {
        return 'rgb(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.alpha + ')'
    }

    public getRedRatio(): number {
        return this.red / 255
    }

    public getGreenRatio(): number {
        return this.green / 255
    }

    public getBlueRatio(): number {
        return this.blue / 255
    }

    public getAlpha(): number {
        return this.alpha * 255
    }

    public getRed(): number {
        return this.red
    }

    public getGreen(): number {
        return this.green
    }

    public getBlue(): number {
        return this.blue
    }
}