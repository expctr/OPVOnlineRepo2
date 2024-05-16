"use strict";
class ColorIndicatorBuilder {
    constructor() {
        this.graphicalComposite = new GraphicalComposite();
    }
    build(colorIndicatorDisplay) {
        this.graphicalComposite = new GraphicalComposite();
        // this.graphicalComposite.add(new Background(BackgroundBuilder.BACKGROUND_COLOR))
        let outerRectangle = new Rectangle(-colorIndicatorDisplay.getWidth() / 4, colorIndicatorDisplay.getHeight() / 2, colorIndicatorDisplay.getWidth() / 4, colorIndicatorDisplay.getHeight());
        let totalNumberOfInnerRectangles = 300;
        for (let j = 0; j < 3; ++j) {
            for (let i = 0; i < totalNumberOfInnerRectangles; ++i) {
                let innerRectangle = this.getInnerRectangle(outerRectangle, totalNumberOfInnerRectangles, i);
                let ratio = i / totalNumberOfInnerRectangles;
                let value = GeoinformationDataUnit.maxValue * (1 - ratio);
                let color = GeoinformationDataUnit.getColor(value);
                // this.colorIndicatorDisplay.fillRectangle(
                //     innerRectangle.x,
                //     innerRectangle.y,
                //     innerRectangle.x + innerRectangle.width,
                //     innerRectangle.y - innerRectangle.height,
                //     color.toString()
                // )
                this.graphicalComposite.add(new Tetragon(innerRectangle.x, innerRectangle.y, innerRectangle.x + innerRectangle.width, innerRectangle.y, innerRectangle.x + innerRectangle.width, innerRectangle.y + innerRectangle.height, innerRectangle.x, innerRectangle.y + innerRectangle.height, color));
            }
        }
        // this.colorIndicatorDisplay.fillText(
        //     "ergs/cm2s",
        //     outerRectangle.x + outerRectangle.width * 1.7 - 50,
        //     outerRectangle.y - 50,
        //     'white',
        //     this.COLOR_INDICATOR_LABELS_FONT
        // )
        this.graphicalComposite.add(new Label(outerRectangle.x + outerRectangle.width * 1.7 - 170, 
        // outerRectangle.y - 70,
        outerRectangle.y + 100, "ergs/cm2s", new Color(255, 255, 255, 1), new Color(255, 255, 255, 0), 60, "Arial", false, 0, 0));
        // this.colorIndicatorDisplay.fillText(
        //     GeoinformationDataUnit.maxValue.toFixed(2).toString(),
        //     outerRectangle.x + outerRectangle.width * 1.7,
        //     outerRectangle.y - 50,
        //     'white',
        //     this.COLOR_INDICATOR_LABELS_FONT
        // )
        this.graphicalComposite.add(new Label(outerRectangle.x + outerRectangle.width * 1.7 + 50, outerRectangle.y, GeoinformationDataUnit.maxValue.toFixed(2).toString(), new Color(255, 255, 255, 1), new Color(255, 255, 255, 0), 60, "Arial", true, 0, 0));
        // this.colorIndicatorDisplay.fillText(
        //     (GeoinformationDataUnit.maxValue / 2).toFixed(2).toString(),
        //     outerRectangle.x + outerRectangle.width * 1.7,
        //     0,
        //     'white',
        //     this.COLOR_INDICATOR_LABELS_FONT
        // )
        this.graphicalComposite.add(new Label(outerRectangle.x + outerRectangle.width * 1.7 + 50, 0, (GeoinformationDataUnit.maxValue / 2).toFixed(2).toString(), new Color(255, 255, 255, 1), new Color(255, 255, 255, 0), 60, "Arial", true, 0, 0));
        // this.colorIndicatorDisplay.fillText(
        //     (0).toFixed(2).toString(),
        //     outerRectangle.x + outerRectangle.width * 1.7,
        //     -outerRectangle.y,
        //     'white',
        //     this.COLOR_INDICATOR_LABELS_FONT
        // )
        this.graphicalComposite.add(new Label(outerRectangle.x + outerRectangle.width * 1.7 + 50, -outerRectangle.y, (0).toFixed(2).toString(), new Color(255, 255, 255, 1), new Color(255, 255, 255, 0), 60, "Arial", true, 0, 0));
    }
    getGraphicalComponent() {
        return this.graphicalComposite;
    }
    /**
 * Получаем внутренний прямоугольник.
 * @param outerRectangle внешний прямоугольник.
 * @param totalNumberOfInnerRectangles общее число внутренний прямоугольников.
 * @param indexOfInnerRectangle индекс внутреннего прямогольника.
 * @returns упомянутый прямоугольник.
 */
    getInnerRectangle(outerRectangle, totalNumberOfInnerRectangles, indexOfInnerRectangle) {
        let innerRectangleHeight = outerRectangle.height / totalNumberOfInnerRectangles;
        let innerRectangleWidth = outerRectangle.width;
        let innerRectangleX = outerRectangle.x;
        let innerRectangleY = outerRectangle.y - innerRectangleHeight * indexOfInnerRectangle;
        return new Rectangle(innerRectangleX, innerRectangleY, innerRectangleWidth, innerRectangleHeight);
    }
}
// private static BACKGROUND_COLOR: Color = new Color(39, 39, 39, 1)
ColorIndicatorBuilder.colorIndicatorBuilder = new ColorIndicatorBuilder();
