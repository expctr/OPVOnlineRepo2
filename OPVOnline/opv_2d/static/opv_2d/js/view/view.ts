/*
 * В данном файле содержится реализация представления для паттерна MVC для управления
 * страницей 2D визуализации.
 */

/**
 * Представление для паттерна MVC.
 * @author Иван Шагурин
 */
class View {
	/**
	 * Цвет границы.
	 */
	private readonly MARGIN_COLOR_FIRST: Color = new Color(0, 0, 0, 1)

	private readonly MARGIN_COLOR_SECOND: Color = new Color(255, 255, 255, 1)

	/**
	 * Дисплей для визуализации.
	 */
	public readonly visualizationDisplay: Display

	/**
	 * Дисплей для отображения цветовой шкалы.
	 */
	public readonly colorIndicatorDisplay: Display

	/**
	 * Флажок, который поднят, если нужно отображать тепловую карту.
	 */
	public readonly showHeatmapCheckbox: HTMLInputElement

	/**
	 * Флажок, который поднят, если нужно отображать границу.
	 */
	public readonly showMarginCheckbox: HTMLInputElement

	/**
	 * Флажок, который поднят, если граница должны быть гладкой.
	 */
	public readonly smoothMarginCheckbox: HTMLInputElement

	public readonly showDayNightCheckbox: HTMLInputElement

	public readonly cloudinessCheckBox: HTMLInputElement

	public readonly continentsCheckbox: HTMLInputElement

	public readonly visualizationBuilder = new ConcreteBuilder()

	public readonly colorIndicatorBuilder = new ConcreteBuilder()

	private drawingManager: DrawingManager | null = null

	/**
	 * Конструктор - создание нового объекта.
	 * @param visualizationCanvas холст для визуализации.
	 * @param visualizationCanvasWidth ширина хосла для визуалиазци.
	 * @param visualizationCanvasHeight высота холста для визуализации.
	 * @param colorIndicatorCanvas холст для отображения цветовой шкалы.
	 * @param colorIndicatorCanvasWidth ширина холста для визуализации цветовой шкалы.
	 * @param colorIndicatorCanvasHeight высота холста для визуализации цветовой шкалы.
	 * @param showHeatmapCheckbox флажок, который поднят, если нужно отображать тепловую карту.
	 * @param showMarginCheckbox флажок, который поднят, если нужно отображать границу.
	 * @param smoothMarginCheckbox флажок, который поднят, если граница должны быть гладкой.
	 */
	public constructor(
		visualizationCanvas: HTMLCanvasElement,
		visualizationCanvasWidth: number,
		visualizationCanvasHeight: number,
		colorIndicatorCanvas: HTMLCanvasElement,
		colorIndicatorCanvasWidth: number,
		colorIndicatorCanvasHeight: number,
		showHeatmapCheckbox: HTMLInputElement,
		showMarginCheckbox: HTMLInputElement,
		smoothMarginCheckbox: HTMLInputElement,
		showDayNightCheckbox: HTMLInputElement,
		cloudinessCheckBox: HTMLInputElement,
		continentsCheckbox: HTMLInputElement) {
		this.visualizationDisplay = new Display(
			visualizationCanvas,
			visualizationCanvasWidth,
			visualizationCanvasHeight,
			true,
			0.85)
		this.colorIndicatorDisplay = new Display(
			colorIndicatorCanvas,
			colorIndicatorCanvasWidth,
			colorIndicatorCanvasHeight,
			false,
			0.28)
		this.showHeatmapCheckbox = showHeatmapCheckbox;
		this.showMarginCheckbox = showMarginCheckbox
		this.smoothMarginCheckbox = smoothMarginCheckbox
		this.showDayNightCheckbox = showDayNightCheckbox
		this.cloudinessCheckBox = cloudinessCheckBox
		this.continentsCheckbox = continentsCheckbox
	}

	public setDrawingManager(): void {
		this.drawingManager = new DrawingManager(this)
	}

	public runDrawingManager(): void {
		this.drawingManager?.run()
	}

	public showRebuild(
		geoinformationDataUnits:
			{ [key: string]: GeoinformationDataUnit } | null,
		marginLevel: number,
		middleMarginSegments: Segment[],
		terminatorVertices: PointPolar[][] | null,
		cloudinessImageSrc: string | null,
		cloudinessMltRotationAngle: number,
		continentsVertices: PointPolar[][] | null,
		cities: NamedPointPolar[] | null,
		totalMltRotationAngle: number,
		mouseEvent: MouseEvent | null
	) {
		let drawingCommand = new DrawingCommand(true)
		drawingCommand.set(
			geoinformationDataUnits,
			marginLevel,
			middleMarginSegments,
			terminatorVertices,
			cloudinessMltRotationAngle,
			continentsVertices,
			cities,
			totalMltRotationAngle,
			mouseEvent
		)

		if (cloudinessImageSrc != null) {
			let image = new Image()

			image.onload = () => {
				drawingCommand.setLoadedImageFlagAsTrue()
			}

			image.src = cloudinessImageSrc
			drawingCommand.setCloudinessImage(image)
		}

		this.drawingManager?.addCommand(drawingCommand)
	}

	public showWithoutRebuild() {
		let drawingCommand = new DrawingCommand(false)

		this.drawingManager?.addCommand(drawingCommand)
	}

	public drawRebuild(
		geoinformationDataUnits:
			{ [key: string]: GeoinformationDataUnit } | null,
		marginLevel: number,
		middleMarginSegments: Segment[],
		terminatorVertices: PointPolar[][] | null,
		cloudinessImage: HTMLImageElement | null,
		cloudinessMltRotationAngle: number,
		continentsVertices: PointPolar[][] | null,
		cities: NamedPointPolar[] | null,
		totalMltRotationAngle: number,
		mouseEvent: MouseEvent | null,
		drawingCommand: DrawingCommand) {
		let rotationAngleInRadians = totalMltRotationAngle / 24 * 2 * Math.PI
		this.visualizationDisplay.setRotationAngleInRadians(rotationAngleInRadians)

		this.visualizationBuilder.reset()
		this.visualizationBuilder.buildBackground()

		// let geoinformationDataUnitVertices
		// 	= this.getGeoinformationDataUnitVertices(geoinformationDataUnits)
		// this.visualizationBuilder.reset()
		// this.visualizationBuilder.buildBackground()

		if ((this.continentsCheckbox.checked) && (continentsVertices != null)) {
			this.visualizationBuilder.buildContinentsAndOcean(
				continentsVertices, this.visualizationDisplay)
		}

		if ((geoinformationDataUnits != null) && (this.showHeatmapCheckbox.checked)) {
			this.visualizationBuilder.buildGeoinformationDataUnits(
				geoinformationDataUnits, this.visualizationDisplay)
		}

		if (this.cloudinessCheckBox.checked && cloudinessImage != null) {
			this.visualizationBuilder.buildCloudiness(
				cloudinessImage,
				cloudinessMltRotationAngle + totalMltRotationAngle,
				this.visualizationDisplay,
				drawingCommand.setLoadedImageFlagAsTrue)
		}

		if ((this.showDayNightCheckbox.checked) && (terminatorVertices != null)) {
			this.visualizationBuilder.buildTerminator(terminatorVertices, this.visualizationDisplay)
		}

		if ((this.continentsCheckbox.checked) && (continentsVertices != null)) {
			this.visualizationBuilder.buildContinentsBorders(
				continentsVertices, this.visualizationDisplay)
		}

		this.visualizationBuilder.buildThinGridCircles(this.visualizationDisplay)
		this.visualizationBuilder.buildThickGridCircles(this.visualizationDisplay)
		this.visualizationBuilder.buildThinGridLines(this.visualizationDisplay)
		this.visualizationBuilder.buildThickGridLines(this.visualizationDisplay)

		if ((geoinformationDataUnits != null) && (this.showMarginCheckbox.checked)) {
			if (this.smoothMarginCheckbox.checked) {
				this.visualizationBuilder.buildSmoothMargin(middleMarginSegments, this.getMarginColor(), this.visualizationDisplay)
			} else {
				this.visualizationBuilder.buildBrokenMargin(geoinformationDataUnits, marginLevel, this.getMarginColor(), this.visualizationDisplay)
			}
		}

		this.visualizationBuilder.buildThickGridLinesLabels(this.visualizationDisplay)
		this.visualizationBuilder.buildThickGridCirclesLabels(this.visualizationDisplay)

		if (cities != null) {
			this.visualizationBuilder.buildCities(this.visualizationDisplay, cities)
		}

		// console.log("MouseEvent:")
		// console.log(MouseEvent)
		// console.log("geoinformationDataUnits != null:")
		// console.log(geoinformationDataUnits != null)

		if ((mouseEvent != null) && (geoinformationDataUnits != null)) {
			// console.log("orange")
			this.visualizationBuilder.buildGeoinformationUnitInfoLabel(
				this.visualizationDisplay,
				mouseEvent,
				geoinformationDataUnits
			)
		}

		let graphicalComponent: GraphicalComponent
			= this.visualizationBuilder.getResult()
		let visitor = new Visitor(
			//@ts-ignore
			this.visualizationDisplay.getContext(),
			this.visualizationDisplay)

		graphicalComponent.doTraversal(visitor)

		// console.log(graphicalComponent)

		this.colorIndicatorBuilder.reset()
		this.colorIndicatorBuilder.buildBackground()

		this.colorIndicatorBuilder.buildColorIndicator(this.colorIndicatorDisplay)

		let secondGraphicalComponent: GraphicalComponent
			= this.colorIndicatorBuilder.getResult()
		let secondVisitor = new Visitor(
			//@ts-ignore
			this.colorIndicatorDisplay.getContext(),
			this.colorIndicatorDisplay
		)

		secondGraphicalComponent.doTraversal(secondVisitor)
	}

	public drawWithoutRebuild() {
		let graphicalComponent: GraphicalComponent
			= this.visualizationBuilder.getResult()
		let visitor = new Visitor(
			//@ts-ignore
			this.visualizationDisplay.getContext(),
			this.visualizationDisplay)

		graphicalComponent.doTraversal(visitor)

		// console.log(graphicalComponent)

		this.colorIndicatorBuilder.reset()
		this.colorIndicatorBuilder.buildBackground()

		this.colorIndicatorBuilder.buildColorIndicator(this.colorIndicatorDisplay)

		let secondGraphicalComponent: GraphicalComponent
			= this.colorIndicatorBuilder.getResult()
		let secondVisitor = new Visitor(
			//@ts-ignore
			this.colorIndicatorDisplay.getContext(),
			this.colorIndicatorDisplay
		)

		secondGraphicalComponent.doTraversal(secondVisitor)
	}

	// private getGeoinformationDataUnitVertices(
	// 	geoinformationDataUnits: { [key: string]: GeoinformationDataUnit } | null): number[] {
	// 	// let arraySize = this.getDictionarySize(geoinformationDataUnits) * 6 * 6
	// 	// let vertices = new Float32Array(arraySize)
	// 	let array = []

	// 	for (let key in geoinformationDataUnits) {
	// 		let currentGeoinformationDataUnit = geoinformationDataUnits[key]

	// 		let firstPoint
	// 			= currentGeoinformationDataUnit
	// 				.getFirstPoint(this.visualizationDisplay.getWidth())
	// 		let secondPoint
	// 			= currentGeoinformationDataUnit
	// 				.getSecondPoint(this.visualizationDisplay.getWidth())
	// 		let thirdPoint
	// 			= currentGeoinformationDataUnit
	// 				.getThirdPoint(this.visualizationDisplay.getWidth())
	// 		let fourthPoint
	// 			= currentGeoinformationDataUnit
	// 				.getFourhtPoint(this.visualizationDisplay.getWidth())

	// 		// let xInDisplay
	// 		// 	= currentGeoinformationDataUnit.getStandardX(
	// 		// 		this.visualizationDisplay.getWidth())
	// 		// let yInDisplay
	// 		// 	= currentGeoinformationDataUnit.getStandardY(
	// 		// 		this.visualizationDisplay.getHeight())

	// 		CoordinateAdapter.firstCoordinateAdapter.setDisplay(this.visualizationDisplay)
	// 		CoordinateAdapter.firstCoordinateAdapter.set(firstPoint.x, firstPoint.y, CoordinateSystem.DISPLAY)
	// 		CoordinateAdapter.secondCoordinateAdapter.setDisplay(this.visualizationDisplay)
	// 		CoordinateAdapter.secondCoordinateAdapter.set(secondPoint.x, secondPoint.y, CoordinateSystem.DISPLAY)
	// 		CoordinateAdapter.thirdCoordinateAdapter.setDisplay(this.visualizationDisplay)
	// 		CoordinateAdapter.thirdCoordinateAdapter.set(thirdPoint.x, thirdPoint.y, CoordinateSystem.DISPLAY)
	// 		CoordinateAdapter.fourthCoordinateAdapter.setDisplay(this.visualizationDisplay)
	// 		CoordinateAdapter.fourthCoordinateAdapter.set(fourthPoint.x, fourthPoint.y, CoordinateSystem.DISPLAY)

	// 		let color = currentGeoinformationDataUnit.getColor()

	// 		array.push(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.WEBGL))
	// 		array.push(CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.WEBGL))
	// 		array.push(color.getRedRatio())
	// 		array.push(color.getGreenRatio())
	// 		array.push(color.getBlueRatio())
	// 		array.push(color.getAlpha())

	// 		array.push(CoordinateAdapter.secondCoordinateAdapter.getX(CoordinateSystem.WEBGL))
	// 		array.push(CoordinateAdapter.secondCoordinateAdapter.getY(CoordinateSystem.WEBGL))
	// 		array.push(color.getRedRatio())
	// 		array.push(color.getGreenRatio())
	// 		array.push(color.getBlueRatio())
	// 		array.push(color.getAlpha())

	// 		array.push(CoordinateAdapter.thirdCoordinateAdapter.getX(CoordinateSystem.WEBGL))
	// 		array.push(CoordinateAdapter.thirdCoordinateAdapter.getY(CoordinateSystem.WEBGL))
	// 		array.push(color.getRedRatio())
	// 		array.push(color.getGreenRatio())
	// 		array.push(color.getBlueRatio())
	// 		array.push(color.getAlpha())

	// 		array.push(CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.WEBGL))
	// 		array.push(CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.WEBGL))
	// 		array.push(color.getRedRatio())
	// 		array.push(color.getGreenRatio())
	// 		array.push(color.getBlueRatio())
	// 		array.push(color.getAlpha())

	// 		array.push(CoordinateAdapter.fourthCoordinateAdapter.getX(CoordinateSystem.WEBGL))
	// 		array.push(CoordinateAdapter.fourthCoordinateAdapter.getY(CoordinateSystem.WEBGL))
	// 		array.push(color.getRedRatio())
	// 		array.push(color.getGreenRatio())
	// 		array.push(color.getBlueRatio())
	// 		array.push(color.getAlpha())

	// 		array.push(CoordinateAdapter.thirdCoordinateAdapter.getX(CoordinateSystem.WEBGL))
	// 		array.push(CoordinateAdapter.thirdCoordinateAdapter.getY(CoordinateSystem.WEBGL))
	// 		array.push(color.getRedRatio())
	// 		array.push(color.getGreenRatio())
	// 		array.push(color.getBlueRatio())
	// 		array.push(color.getAlpha())
	// 	}

	// 	return array
	// }

	private getMarginColor(): Color {
		return (this.showHeatmapCheckbox.checked || this.continentsCheckbox.checked)
			? this.MARGIN_COLOR_FIRST
			: this.MARGIN_COLOR_SECOND
	}

	public marginIsLocated(firstValue: number, secondValue: number, marginLevel: number): boolean {
		return (
			((firstValue >= marginLevel) && (secondValue < marginLevel))
			|| ((firstValue < marginLevel) && (secondValue >= marginLevel))
		)
	}

	public hideColorIndicatorCanvas(): void {
		this.colorIndicatorDisplay.hideCanvas()
		this.visualizationDisplay.canvas!.style.left = "0"
		this.visualizationDisplay.canvas!.style.width = (120 + 578).toString() + "px"
		this.visualizationDisplay.canvas!.width = 4 * (120 + 578)
		this.visualizationDisplay.makeDefaulOffsetAndtSizes(true, 0.85)
		this.showWithoutRebuild()
	}

	public showColorIndicatorCanvas(): void {
		this.colorIndicatorDisplay.showCanvas()
		this.visualizationDisplay.canvas!.style.left = "120px"
		this.visualizationDisplay.canvas!.style.width = (578).toString() + "px"
		this.visualizationDisplay.canvas!.width = 4 * 578
		this.visualizationDisplay.makeDefaulOffsetAndtSizes(true, 0.85)
		this.showWithoutRebuild()
	}

	public changeColorIndicatorCanvasVisibility() {
		if (this.colorIndicatorDisplay.canvasIsVisible()) {
			this.hideColorIndicatorCanvas()
		} else {
			this.showColorIndicatorCanvas()
		}
	}
}

function delay(time: number) {
	return new Promise(resolve => setTimeout(resolve, time));
}