/*
 * В данном файле содержится реализация интерфейса, который соответсвтует компоненте
 * в паттерне Composite.
 */

class GraphicalComposite implements GraphicalComponent {
    private components: GraphicalComponent[] = []

    public constructor() {

    }

    public add(graphicalComponent: GraphicalComponent) {
        this.components.push(graphicalComponent)
    }

    doTraversal(visitor: Visitor): void {
        for (let component of this.components) {
            component.doTraversal(visitor)
        }
    }
}