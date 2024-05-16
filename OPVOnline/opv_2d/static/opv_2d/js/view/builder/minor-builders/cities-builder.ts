/*
* В данном файле содержится реализация класса для конструирования графического объекта, который
* отвечает за города.
*/

class CitiesBuilder {
    public static citiesBuilder: CitiesBuilder = new CitiesBuilder()

    private graphicalComposite: GraphicalComposite = new GraphicalComposite()

    private constructor() {
    }

    public build(visualizationDisplay: Display, cities: NamedPointPolar[]): void {
        this.graphicalComposite = new GraphicalComposite()

        for (let i = 0; i < cities.length; ++i) {
            this.buildNamedPointPolar(visualizationDisplay, cities[i], new Color(0, 40, 0, 1), new Color(0, 0, 0, 1))
        }
    }

    private buildNamedPointPolar(visualizationDisplay: Display, namedPointPolar: NamedPointPolar, pointColor: Color, labelColor: Color) {
        let centerX
            = namedPointPolar
                .pointPolar
                .getStandardX(visualizationDisplay.getWidth())
        let centerY
            = namedPointPolar
                .pointPolar
                .getStandardY(visualizationDisplay.getWidth())


        CoordinateAdapter.firstCoordinateAdapter.setDisplay(visualizationDisplay)
        CoordinateAdapter.firstCoordinateAdapter.set(centerX, centerY, CoordinateSystem.CANVAS)

        this.graphicalComposite.add(new Circle(
            centerX - 15,
            centerY + 15,
            centerX + 15,
            centerY - 15,
            pointColor,
            true,
            1
        ))

        this.graphicalComposite.add(new Label(
            centerX,
            centerY,
            namedPointPolar.name,
            labelColor,
            new Color(0, 0, 0, 0),
            48,
            'Arial',
            false,
            20,
            -20
        ))
    }

    public getGraphicalComponent(): GraphicalComponent {
        return this.graphicalComposite;
    }
}