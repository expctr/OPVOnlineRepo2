"use strict";
class SmoothMarginBuilder {
    constructor() {
        this.graphicalComposite = new GraphicalComposite();
    }
    build(middleMarginSegments, color, visualizationDisplay) {
        var _a;
        this.graphicalComposite = new GraphicalComposite();
        for (let i = 0; i < middleMarginSegments.length; ++i) {
            let middleSegment = middleMarginSegments[i];
            if (middleSegment.getFirstNeighbour() != null) {
                this.buildBezierCurve(middleSegment.getFirstNeighbour().getMiddle(), 
                // @ts-ignore
                middleSegment.getIntersectionWithFirstNeighbour(), middleSegment.getMiddle(), color);
            }
            if (middleSegment.getSecondNeighbour() != null) {
                this.buildBezierCurve(middleSegment.getMiddle(), 
                // @ts-ignore
                middleSegment.getIntersectionWithSecondNeighbour(), (_a = middleSegment.getSecondNeighbour()) === null || _a === void 0 ? void 0 : _a.getMiddle(), color);
            }
        }
    }
    buildBezierCurve(firstPoint, secondPoint, thirdPoint, color) {
        let firstSegment = new Segment(firstPoint, secondPoint, null);
        let secondSegment = new Segment(secondPoint, thirdPoint, null);
        let previousPoint = null;
        for (let t = 0; t <= 1; t += 0.01) {
            let intermediateSegment = new Segment(firstSegment.getRatioPoint(t), secondSegment.getRatioPoint(t), null);
            let currentPoint = intermediateSegment.getRatioPoint(t);
            if (previousPoint != null) {
                this.graphicalComposite.add(new GraphicalSegment(SmoothMarginBuilder.MARGIN_WIDTH, color, previousPoint.x, previousPoint.y, currentPoint.x, currentPoint.y));
            }
            previousPoint = currentPoint;
        }
    }
    getGraphicalComponent() {
        return this.graphicalComposite;
    }
}
SmoothMarginBuilder.MARGIN_WIDTH = 10;
SmoothMarginBuilder.smoothMarginBuilder = new SmoothMarginBuilder();
