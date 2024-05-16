"use strict";
class BackgroundBuilder {
    constructor() {
        this.graphicalComposite = new GraphicalComposite();
    }
    build() {
        this.graphicalComposite = new GraphicalComposite();
        this.graphicalComposite.add(new Background(BackgroundBuilder.BACKGROUND_COLOR));
    }
    getGraphicalComponent() {
        return this.graphicalComposite;
    }
}
BackgroundBuilder.BACKGROUND_COLOR = new Color(39, 39, 39, 1);
BackgroundBuilder.backgroundBuilder = new BackgroundBuilder();