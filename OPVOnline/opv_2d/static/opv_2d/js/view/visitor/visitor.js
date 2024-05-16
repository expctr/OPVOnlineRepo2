"use strict";
class Visitor {
    constructor(context, display) {
        this.context = context;
        this.display = display;
    }
    visitBackground(background) {
        background.draw(this.context, this.display);
    }
    visitBrokenLine(brokenLine) {
        brokenLine.draw(this.context, this.display);
    }
    visitEllipse(ellipse) {
        ellipse.draw(this.context, this.display);
    }
    visitGraphicalSegment(graphicalSegment) {
        graphicalSegment.draw(this.context, this.display);
    }
    visitLabel(label) {
        label.draw(this.context, this.display);
    }
    visitPolygon(polygon) {
        polygon.draw(this.context, this.display);
    }
    visitTetragon(tetragon) {
        tetragon.draw(this.context, this.display);
    }
    visitImage(image) {
        image.draw(this.context, this.display);
    }
}
