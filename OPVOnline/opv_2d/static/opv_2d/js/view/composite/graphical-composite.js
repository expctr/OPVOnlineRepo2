"use strict";
class GraphicalComposite {
    constructor() {
        this.components = [];
    }
    add(graphicalComponent) {
        this.components.push(graphicalComponent);
    }
    doTraversal(visitor) {
        for (let component of this.components) {
            component.doTraversal(visitor);
        }
    }
}
