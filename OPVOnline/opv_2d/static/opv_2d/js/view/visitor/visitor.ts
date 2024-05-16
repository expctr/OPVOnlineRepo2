/*
 * В данном файле содержится реализация класса, который соответствует посетителю в
 * паттерне Visitor.
 */

class Visitor {
    private context: CanvasRenderingContext2D

    private display: Display

    public constructor(context: CanvasRenderingContext2D, display: Display) {
        this.context = context
        this.display = display
    }

    public visitBackground(background: Background): void {
        background.draw(this.context, this.display)
    }

    public visitBrokenLine(brokenLine: BrokenLine) {
        brokenLine.draw(this.context, this.display)
    }

    public visitEllipse(ellipse: Circle) {
        ellipse.draw(this.context, this.display)
    }

    public visitGraphicalSegment(graphicalSegment: GraphicalSegment) {
        graphicalSegment.draw(this.context, this.display)
    }

    public visitLabel(label: Label) {
        label.draw(this.context, this.display)
    }

    public visitPolygon(polygon: Polygon) {
        polygon.draw(this.context, this.display)
    }

    public visitTetragon(tetragon: Tetragon) {
        tetragon.draw(this.context, this.display)
    }

    public visitImage(image: ImageObject) {
        image.draw(this.context, this.display)
    }
}