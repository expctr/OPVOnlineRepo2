/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за фон.
*/

class BackgroundBuilder {
    private static BACKGROUND_COLOR: Color = new Color(39, 39, 39, 1)

    public static backgroundBuilder: BackgroundBuilder = new BackgroundBuilder()

    private graphicalComposite: GraphicalComposite = new GraphicalComposite()

    private constructor() {
    }

    public build(): void {
        this.graphicalComposite = new GraphicalComposite()
        this.graphicalComposite.add(new Background(BackgroundBuilder.BACKGROUND_COLOR))
    }

    public getGraphicalComponent(): GraphicalComponent {
        return this.graphicalComposite;
    }
}