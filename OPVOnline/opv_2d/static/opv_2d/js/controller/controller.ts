/*
 * В данном файле содержится реализация контроллера для
 * паттерна MVC для управления страницей 2D визуализации.
 */


/**
 * Контроллер для паттерна MVC.
 * @author Иван Шагурин
 */

class Controller {
	/**
	 * Представление для паттерна MVC.
	 */
	private readonly view: View

	/**
	 * Модель для паттерна MVC.
	 */
	private readonly model: Model

	/**
	 * Вспомогательная переменная с координатой x.
	 */
	private x: number = 0

	/**
	 * Вспомогательная переменная с координатой y.
	 */
	private y: number = 0

	/**
	 * Флажок, который поднят, если нужно двигать изображение.
	 */
	private moveFlag: boolean = false

	private options: Options | null = null

	/**
	 * Флажок, который поднят, если нужно отображать информацию
	 * о фрагментах изображения.
	 */
	private showGeoinformationDataUnitInfoFlag: boolean = false

	/**
	 * Кнопка "Предыдущий файл".
	 */
	private readonly gotoPreviousFileButton: HTMLButtonElement

	/**
	 * Кнопка "Следующий файл".
	 */
	private readonly gotoNextFileButton: HTMLButtonElement

	/**
	 * Кнопка "Перейти к файлу".
	 */
	private readonly gotoFileButton: HTMLButtonElement

	/**
	 * Текстовое поле для отоборажения номера файла,
	 * к которому нужно перейти.
	 */
	private readonly gotoCertainFileInput: HTMLInputElement


	/**
	 * Кнопка "Выбрать дату и время".
	 */
	// private readonly selectDateAndTimeButton: HTMLButtonElement

	private readonly datetimeInput: HTMLInputElement

	/**
	 * Кнопка "Сдвиг и размер по умолчанию".
	 */
	private readonly defaultOffsetAndSizesButton: HTMLButtonElement

	private readonly changeColorIndicatorCanvasVisibilityButton: HTMLButtonElement

	/**
	 * Флажок для выбора северной полусферы.
	 */
	private readonly northRadio: HTMLInputElement

	/**
	 * Флажок для выбора южной полусферы.
	 */
	private readonly southRadio: HTMLInputElement

	/**
	 * Флажок для выбора прогноза.
	 */
	private readonly forecastRadio: HTMLInputElement

	/**
	 * Флажок для выбора наблюдаемых данных.
	 */
	private readonly nowcastRadio: HTMLInputElement

	private readonly secondForecastRadio: HTMLInputElement

	/**
	 * Флажок для выбора вклада рассеянного сияния.
	 */
	private readonly diffuseRadio: HTMLInputElement

	/**
	 * Флажок для выбора вклада ионов.
	 */
	private readonly ionsRadio: HTMLInputElement

	/**
	 * Флажок для выбора вклада моноэнергетических пиков.
	 */
	private readonly monoRadio: HTMLInputElement

	/**
	 * Флажок для выбора вклада "broadband" ускорения.
	 */
	private readonly waveRadio: HTMLInputElement

	/**
	 * Флажок для выбора данных об общем вкладе авроральных компонент.
	 */
	private readonly totalRadio: HTMLInputElement

	/**
	 * Текстовое поле для отображения предельного значения цветовой шкалы.
	 */
	private readonly colorIndicatorLimitInput: HTMLInputElement

	/**
	 * Флажок "Отображать тепловую карту".
	 */
	public readonly showHeatmapCheckBox: HTMLInputElement

	/**
	 * Флажок "Отображать границу".
	 */
	private readonly showMarginCheckBox: HTMLInputElement

	/**
	 * Флажок "Гладкая граница".
	 */
	private readonly smoothMarginCheckBox: HTMLInputElement

	/**
	 * Ползунок для выбора номера файла.
	 */
	private readonly fileNumberRangeInput: HTMLInputElement

	/**
	 * Текстовое поле для отображения уровня границы.
	 */
	private readonly marginLevelInput: HTMLInputElement

	private readonly showDayNightCheckBox: HTMLInputElement

	private readonly cloudinessCheckBox: HTMLInputElement

	private readonly denoiseCheckbox: HTMLInputElement

	private readonly continentsCheckbox: HTMLInputElement

	private readonly additionalFileInfoButton: HTMLButtonElement

	private readonly citiesCheckbox: HTMLInputElement

	// private readonly extendedFunctionality1Checkbox: HTMLInputElement

	private readonly fileSelectionManager: FileSelectionManager

	/**
	 * Конструктор - создание нового объекта.
	 * @param view представление для паттерна MVC.
	 * @param model модель для паттерна MVC.
	 * @param gotoPreviousFileButton кнопка "Предыдущий файл".
	 * @param gotoNextFileButton кнопка "Следующий файл".
	 * @param gotoFileButton кнопка "Перейти к файлу".
	 * @param gotoCertainFileInput текстовое поле для отоборажения номера файла,
	 *                             к которому нужно перейти.
	 * @param selectDateAndTimeButton кнопка "Выбрать дату и время".
	 * @param defaultOffsetAndSizesButton кнопка "Сдвиг и размер по умолчанию".
	 * @param northRadio флажок для выбора северной полусферы.
	 * @param southRadio флажок для выбора южной полусферы.
	 * @param forecastRadio флажок для выбора прогноза.
	 * @param nowcastRadio флажок для выбора наблюдаемых данных.
	 * @param diffuseRadio флажок для выбора вклада рассеянного сияния.
	 * @param ionsRadio флажок для выбора вклада ионов.
	 * @param monoRadio флажок для выбора вклада моноэнергетических пиков.
	 * @param waveRadio флажок для выбора вклада "broadband" ускорения.
	 * @param totalRadio флажок для выбора данных об общем вкладе авроральных компонент.
	 * @param colorIndicatorLimitInput текстовое поле для отображения предельного значения цветовой шкалы.
	 * @param showHeatmapCheckBox флажок "Отображать тепловую карту".
	 * @param showMarginCheckBox флажок "Отображать границу".
	 * @param smoothMarginCheckBox флажок "Гладкая граница".
	 * @param fileNumberRangeInput ползунок для выбора номера файла.
	 * @param marginLevelInput текстовое поле для отображения уровня границы.
	 */
	public constructor(
		view: View,
		model: Model,
		gotoPreviousFileButton: HTMLButtonElement,
		gotoNextFileButton: HTMLButtonElement,
		gotoFileButton: HTMLButtonElement,
		gotoCertainFileInput: HTMLInputElement,
		datetimeInput: HTMLInputElement,
		defaultOffsetAndSizesButton: HTMLButtonElement,
		changeColorIndicatorCanvasVisibilityButton: HTMLButtonElement,
		northRadio: HTMLInputElement,
		southRadio: HTMLInputElement,
		forecastRadio: HTMLInputElement,
		nowcastRadio: HTMLInputElement,
		secondForecastRadio: HTMLInputElement,
		diffuseRadio: HTMLInputElement,
		ionsRadio: HTMLInputElement,
		monoRadio: HTMLInputElement,
		waveRadio: HTMLInputElement,
		totalRadio: HTMLInputElement,
		colorIndicatorLimitInput: HTMLInputElement,
		showHeatmapCheckBox: HTMLInputElement,
		showMarginCheckBox: HTMLInputElement,
		smoothMarginCheckBox: HTMLInputElement,
		fileNumberRangeInput: HTMLInputElement,
		marginLevelInput: HTMLInputElement,
		showDayNightCheckBox: HTMLInputElement,
		cloudinessCheckBox: HTMLInputElement,
		denoiseCheckbox: HTMLInputElement,
		continentsCheckbox: HTMLInputElement,
		additionalFileInfoButton: HTMLButtonElement,
		citiesCheckbox: HTMLInputElement
	) {
		this.view = view
		this.model = model
		this.gotoPreviousFileButton = gotoPreviousFileButton
		this.gotoNextFileButton = gotoNextFileButton
		this.gotoFileButton = gotoFileButton
		this.gotoCertainFileInput = gotoCertainFileInput
		// this.selectDateAndTimeButton = selectDateAndTimeButton
		this.datetimeInput = datetimeInput
		this.defaultOffsetAndSizesButton = defaultOffsetAndSizesButton
		this.changeColorIndicatorCanvasVisibilityButton
			= changeColorIndicatorCanvasVisibilityButton
		this.northRadio = northRadio
		this.southRadio = southRadio
		this.forecastRadio = forecastRadio
		this.nowcastRadio = nowcastRadio
		this.secondForecastRadio = secondForecastRadio
		this.diffuseRadio = diffuseRadio
		this.ionsRadio = ionsRadio
		this.monoRadio = monoRadio
		this.waveRadio = waveRadio
		this.totalRadio = totalRadio
		this.colorIndicatorLimitInput = colorIndicatorLimitInput
		this.showMarginCheckBox = showMarginCheckBox
		this.showHeatmapCheckBox = showHeatmapCheckBox
		this.smoothMarginCheckBox = smoothMarginCheckBox
		this.fileNumberRangeInput = fileNumberRangeInput
		this.marginLevelInput = marginLevelInput
		this.showDayNightCheckBox = showDayNightCheckBox
		this.cloudinessCheckBox = cloudinessCheckBox
		this.denoiseCheckbox = denoiseCheckbox
		this.continentsCheckbox = continentsCheckbox
		this.additionalFileInfoButton = additionalFileInfoButton
		this.citiesCheckbox = citiesCheckbox
		// this.extendedFunctionality1Checkbox = extendedFunctionality1Checkbox
		this.fileSelectionManager = new FileSelectionManager(model)
	}

	/**
	 * Добавляем элементам GUI обработчики событий.
	 * @returns
	 */
	public addEventListeners(): void {
		if (this.view.visualizationDisplay.canvas == null) {
			return
		}

		this.view.visualizationDisplay.canvas?.addEventListener('mousedown', this.viewVisualizationDisplayCanvasMousedownEventListener)
		this.view.visualizationDisplay.canvas?.addEventListener('mouseup', this.viewVisualizationDisplayCanvasMouseupEventListener)
		this.view.visualizationDisplay.canvas?.addEventListener('mousemove', this.viewVisualizationDisplayCanvasMousemoveEventListener)
		this.view.visualizationDisplay.canvas.addEventListener('mouseleave', () => {
			this.moveFlag = false
			this.showGeoinformationDataUnitInfoFlag = false
		})
		this.view.visualizationDisplay.canvas.onwheel = (event) => {
			this.viewVisualizationDisplayCanvasWheelEventListener(event)
		}
		this.gotoPreviousFileButton.addEventListener('click', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.saveOptions()
				this.model.gotoPreviousFile()
			}
		})
		this.gotoNextFileButton.addEventListener('click', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.saveOptions()
				this.model.gotoNextFile()
			}
		})
		this.gotoFileButton.addEventListener('click', this.gotoFileButtonClickEventListener)
		this.datetimeInput.addEventListener('input', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.saveOptions()
				this.model.gotoFileByDatetime()
			}
		})
		this.northRadio.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.saveOptions()
				this.enableAndDisableSomeGUIElements()
				this.model.getFilesNumberAndFileDataByDateTime()
			}
		})
		this.southRadio.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.saveOptions()
				this.enableAndDisableSomeGUIElements()
				this.model.getFilesNumberAndFileDataByDateTime()
			}
		})
		this.forecastRadio.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.saveOptions()
				this.enableAndDisableSomeGUIElements()
				this.model.getFilesNumberAndFileDataByDateTime()
			}
		})
		this.nowcastRadio.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { //  this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.saveOptions()
				this.enableAndDisableSomeGUIElements()
				this.model.getFilesNumberAndFileDataByDateTime()
			}
		})
		this.secondForecastRadio.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.saveOptions()
				this.enableAndDisableSomeGUIElements()
				this.model.getSecondForecast()
			}
		})
		this.diffuseRadio.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.saveOptions()
				this.enableAndDisableSomeGUIElements()
				this.model.getFilesNumberAndFileDataByDateTime()
			}
		})
		this.ionsRadio.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.saveOptions()
				this.enableAndDisableSomeGUIElements()
				this.model.getFilesNumberAndFileDataByDateTime()
			}
		})
		this.monoRadio.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.saveOptions()
				this.enableAndDisableSomeGUIElements()
				this.model.getFilesNumberAndFileDataByDateTime()
			}
		})
		this.waveRadio.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.saveOptions()
				this.enableAndDisableSomeGUIElements()
				this.model.getFilesNumberAndFileDataByDateTime()
			}
		})
		this.totalRadio.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.saveOptions()
				this.enableAndDisableSomeGUIElements()
				this.model.getFilesNumberAndFileDataByDateTime()
			}
		})
		this.colorIndicatorLimitInput.addEventListener('input', this.colorIndicatorLimitInputInputEventListener)
		this.defaultOffsetAndSizesButton.addEventListener('click',
			() => {
				if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
					return
				}

				this.view.visualizationDisplay.makeDefaulOffsetAndtSizes(true, 0.85)
				this.visualize(true, null)
			})
		this.changeColorIndicatorCanvasVisibilityButton.addEventListener('click', () => {
			this.view.changeColorIndicatorCanvasVisibility()

			if (this.view.colorIndicatorDisplay.canvasIsVisible()) {
				this.changeColorIndicatorCanvasVisibilityButton.textContent = "Скрыть цветовую шкалу"
			} else {
				this.changeColorIndicatorCanvasVisibilityButton.textContent = "Показать цветовую шкалу"
			}
		})
		this.fileNumberRangeInput.addEventListener('input',
			() => {
				// this.model
				// .gotoCertainFile(parseInt(this.fileNumberRangeInput.value)) 
				this.fileSelectionManager.addCommand(parseInt(this.fileNumberRangeInput.value))
			})
		this.marginLevelInput.addEventListener('input', this.marginLevelInputInputEventListener)
		this.showHeatmapCheckBox.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.visualize(true, null)
				this.saveOptions()
			}
		})
		this.showMarginCheckBox.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.visualize(true, null)
				this.saveOptions()
			}
		})
		this.smoothMarginCheckBox.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.visualize(true, null)
				this.saveOptions()
			}
		})
		this.showDayNightCheckBox.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.visualize(true, null)
				this.saveOptions()
			}
		})
		this.cloudinessCheckBox.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.visualize(true, null)
				this.saveOptions()
			}
		})

		this.denoiseCheckbox.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.model.gotoCertainFile(this.model.getCurrentFileIndex())
				this.saveOptions()
			}
		})

		this.continentsCheckbox.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.visualize(true, null)
				this.saveOptions()
			}
		})

		this.citiesCheckbox.addEventListener('change', () => {
			if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
				this.restoreOptions()
			} else {
				this.visualize(true, null)
				this.saveOptions()
			}
		})

		// this.extendedFunctionality1Checkbox.addEventListener('change', () => {
		// 	this.visualize(true, null)
		// })

		this.additionalFileInfoButton.addEventListener('click', () => {
			let fileNumberLabel = <HTMLInputElement>document.getElementById("file-number-label")
			let currentFileNumberInput = <HTMLInputElement>document.getElementById("current-file-number-input")
			let fromLabel = <HTMLLabelElement>document.getElementById("from-label")
			let filesNumberInput = <HTMLInputElement>document.getElementById('files-number-input')
			let fileNameLabel = <HTMLLabelElement>document.getElementById("file-name-label")
			let fileNameInput = <HTMLInputElement>document.getElementById("file-name-input")

			if (fileNumberLabel.style.display == "none") {
				fileNumberLabel.style.display = "inline"
			} else {
				fileNumberLabel.style.display = "none"
			}

			if (currentFileNumberInput.style.display == "none") {
				currentFileNumberInput.style.display = "inline"
			} else {
				currentFileNumberInput.style.display = "none"
			}

			if (fromLabel.style.display == "none") {
				fromLabel.style.display = "inline"
			} else {
				fromLabel.style.display = "none"
			}

			if (filesNumberInput.style.display == "none") {
				filesNumberInput.style.display = "inline"
			} else {
				filesNumberInput.style.display = "none"
			}

			if (fileNameLabel.style.display == "none") {
				fileNameLabel.style.display = "inline"
			} else {
				fileNameLabel.style.display = "none"
			}

			if (fileNameInput.style.display == "none") {
				fileNameInput.style.display = "inline"
			} else {
				fileNameInput.style.display = "none"
			}

			if (this.gotoFileButton.style.display == "none") {
				this.gotoFileButton.style.display = "inline"
			} else {
				this.gotoFileButton.style.display = "none"
			}

			if (this.gotoCertainFileInput.style.display == "none") {
				this.gotoCertainFileInput.style.display = "inline"
			} else {
				this.gotoCertainFileInput.style.display = "none"
			}
		})

		this.fileSelectionManager.run()
	}

	private visualize(rebuildFlag: boolean, mouseEvent: MouseEvent | null): void {
		if (rebuildFlag) {
			var startTime = performance.now()

			let time1 = performance.now()
			this.model.prepareToDrawSmoothMargin()
			let time2 = performance.now()
			// console.log(`prepareToDrawSmoothMargin() took ${(time2 - time1) / 1} milliseconds`)

			this.model.processCloudiness2()
			let time3 = performance.now()
			// console.log(`processCloudiness() took ${(time3 - time2) / 1} milliseconds`)

			this.model.getContinentsVerticesCoordinates()
			let time4 = performance.now()
			// console.log(`getContinentsVerticesCoordinates() took ${(time4 - time3) / 1} milliseconds`)

			// alert('here')

			this.view.showRebuild(
				this.model.geoinformationDataUnits,
				this.model.marginLevel,
				this.model.middleMarginSegments,
				this.model.terminatorVertices,
				this.model.cloudinessImageSrc,
				this.model.cloudinessMltRotationAngle,
				this.model.continentsVertices,
				this.model.getCities(),
				this.model.getTotalMltRotationAngle(),
				mouseEvent)

			var endTime = performance.now()

			// console.log(`visualize method took ${(endTime - startTime) / 1} milliseconds`)
		} else {
			this.view.showWithoutRebuild()
		}
	}

	/**
	 * Обработчик события, которое происходит при нажатии мыши на
	 * холст для визаулизации.
	 * @param event упомянутое событие.
	 * @returns 
	 */
	private viewVisualizationDisplayCanvasMousedownEventListener = (event: Event) => {
		let mouseEvent = <MouseEvent>(event)

		// if (mouseEvent.button == 1) {
		// 	alert(this.view.visualizationDisplay.getOffsetX() + ' ' + this.view.visualizationDisplay.getOffsetY())
		// }

		if (mouseEvent.button == 0) {
			this.moveFlag = true
		} else if (mouseEvent.button == 2) {
			this.showGeoinformationDataUnitInfoFlag = true

			if (this.view.visualizationDisplay.canvas == null) {
				return
			}

			// this.model.prepareToDrawSmoothMargin()
			// this.model.getTerminatorVerticesCoordinates()
			// this.view.show(
			// 	this.model.geoinformationDataUnits,
			// 	this.model.marginLevel,
			// 	this.model.middleMarginSegments,
			// 	this.model.terminatorVertices)
			this.visualize(true, mouseEvent)

			// let rect = this.view.visualizationDisplay.canvas.getBoundingClientRect()
			// this.view.paintLabel((mouseEvent.clientX - rect.left) * 4, (mouseEvent.clientY - rect.top) * 4,
			// 	this.model.geoinformationDataUnits)
		}

		this.x = mouseEvent.pageX
		this.y = mouseEvent.pageY
	}

	/**
	 * Обработчик события, которое происходит при отжатии мыши
	 * на холсте для визуализации.
	 * @param event упомянутое событие.
	 */
	private viewVisualizationDisplayCanvasMouseupEventListener = (event: Event) => {
		this.moveFlag = false
		this.showGeoinformationDataUnitInfoFlag = false
	}

	/**
	 * Обработчик события, которое происходит при движении мыши
	 * на холсте для визуализации.
	 * @param event упомянутое событие.
	 * @returns 
	 */
	private viewVisualizationDisplayCanvasMousemoveEventListener = (event: Event) => {
		if (this.moveFlag) {
			let mouseEvent = <MouseEvent>(event)
			let newX = mouseEvent.pageX
			let newY = mouseEvent.pageY
			let deltaX = (newX - this.x) * 4
			let deltaY = (newY - this.y) * 4
			this.x = newX
			this.y = newY
			this.view.visualizationDisplay.changeOffset(deltaX, deltaY)
			// this.model.prepareToDrawSmoothMargin()

			this.visualize(true, null)
		} else if (this.showGeoinformationDataUnitInfoFlag) {
			if (this.view.visualizationDisplay.canvas == null) {
				return
			}

			// this.model.prepareToDrawSmoothMargin()
			// // this.model.getTerminatorVerticesCoordinates()
			// this.view.show(
			// 	this.model.geoinformationDataUnits,
			// 	this.model.marginLevel,
			// 	this.model.middleMarginSegments,
			// 	this.model.terminatorVertices)
			// console.log("here")
			this.visualize(true, <MouseEvent>(event))

			// let mouseEvent = <MouseEvent>(event)

			// let rect = this.view.visualizationDisplay.canvas.getBoundingClientRect()
			// this.view.paintLabel((mouseEvent.clientX - rect.left) * 4, (mouseEvent.clientY - rect.top) * 4,
			// 	this.model.geoinformationDataUnits)
		}
	}

	/**
	 * Обработчик события, которое происходит при вращении колесика
	 * мыши, когда мышь наведена на холст для визуализации.
	 * @param event упомянутое событие.
	 * @returns 
	 */
	private viewVisualizationDisplayCanvasWheelEventListener = (event: Event) => {
		if (this.view.visualizationDisplay.canvas == null) {
			return
		}

		let wheelEvent = <WheelEvent>(event)

		const rect = this.view.visualizationDisplay.canvas.getBoundingClientRect()
		const xInCanvasInitial = wheelEvent.clientX - rect.left
		const yInCanvasInitial = wheelEvent.clientY - rect.top

		CoordinateAdapter.firstCoordinateAdapter.setDisplay(this.view.visualizationDisplay)
		CoordinateAdapter.firstCoordinateAdapter.set(xInCanvasInitial * 4, yInCanvasInitial * 4, CoordinateSystem.CANVAS)

		let xInDisplay0 = CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.DISPLAY_ROTATED)
		let yInDisplay0 = CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.DISPLAY_ROTATED)

		CoordinateAdapter.firstCoordinateAdapter.set(xInDisplay0, yInDisplay0, CoordinateSystem.DISPLAY_ROTATED)

		let xInCanvas0 = CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS)
		let yInCanvas0 = CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS)

		let lambda = 0
		let flag = false

		if (wheelEvent.deltaY < 0) {
			flag = this.view.visualizationDisplay.increaseSizes()
			lambda = Display.INCREASE_SIZE_RATIO
		} else {
			flag = this.view.visualizationDisplay.decreaseSizes()
			lambda = 1 / Display.INCREASE_SIZE_RATIO
		}

		let xInDisplay1 = xInDisplay0 * lambda
		let yInDisplay1 = yInDisplay0 * lambda

		CoordinateAdapter.firstCoordinateAdapter.set(xInDisplay1, yInDisplay1, CoordinateSystem.DISPLAY_ROTATED)

		let xInCanvas1 = CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS)
		let yInCanvas1 = CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS)

		let deltaX = xInCanvas1 - xInCanvas0
		let deltaY = yInCanvas1 - yInCanvas0

		if (flag) {
			this.view.visualizationDisplay.changeOffset(-deltaX, -deltaY)
		}

		this.visualize(true, null)
	}

	/**
	 * Обработчик события, которое происходит при клике мыши
	 * на кнопку для перехода к указанному файлу.
	 * @returns 
	 */
	private gotoFileButtonClickEventListener = () => {
		if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
			return
		}

		let fileNumber = parseInt(this.gotoCertainFileInput.value)

		if (Number.isNaN(fileNumber)) {
			alert("Номер файла указан некорректно.")
			return
		}

		if (this.model.getFilesNumber() == undefined) {
			return
		}

		// @ts-ignore
		if ((fileNumber < 1) || (this.model.getFilesNumber() < fileNumber)) {
			alert("Номер файла должен принимать значение от 1 до " + this.model.getFilesNumber() + ".")
			return
		}

		this.model.gotoCertainFile(fileNumber - 1)
		this.gotoCertainFileInput.value = ''
	}

	/**
	 * Обработчик события, которое происходит при изменении
	 * текста в поле для ввода предельного значения цветовой шкалы.
	 */
	private colorIndicatorLimitInputInputEventListener = () => {
		if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
			this.restoreOptions()
		} else {
			let newColorIndicatorLimit = parseFloat(this.colorIndicatorLimitInput.value)

			if (!Number.isNaN(newColorIndicatorLimit) && (newColorIndicatorLimit > 0)) {
				GeoinformationDataUnit.maxValue = newColorIndicatorLimit
				this.model.prepareToDrawSmoothMargin()
				this.visualize(true, null)
				this.saveOptions()
			}
		}
	}

	/**
	 * Обработчик события, которое происходит при изменении
	 * текста в поле для ввода уровня границы.
	 */
	private marginLevelInputInputEventListener = () => {
		let newMarginLevel = parseFloat(this.marginLevelInput.value)

		if (!Number.isNaN(newMarginLevel)) {
			this.model.marginLevel = newMarginLevel
			this.model.prepareToDrawSmoothMargin()
			// this.model.getTerminatorVerticesCoordinates()
			// this.view.show(
			// 	this.model.geoinformationDataUnits,
			// 	this.model.marginLevel,
			// 	this.model.middleMarginSegments,
			// 	this.model.terminatorVertices)
			this.visualize(true, null)
		}
	}

	public enableAndDisableSomeGUIElements(): void {
		let fileType = this.model.getFileTypeFromGUI()

		this.secondForecastRadio.disabled
			= !((fileType?.horizonSideType == HorizonSideType.NORTH)
				&& (fileType.radiationType == RadiationType.DIFFUSE))
		// this.selectDateAndTimeButton.disabled
		// 	= fileType?.castType == CastType.SECOND_FORECAST
		this.datetimeInput.disabled
			= fileType?.castType == CastType.SECOND_FORECAST
		this.gotoPreviousFileButton.disabled
			= fileType?.castType == CastType.SECOND_FORECAST
		this.gotoNextFileButton.disabled
			= fileType?.castType == CastType.SECOND_FORECAST
		this.gotoFileButton.disabled
			= fileType?.castType == CastType.SECOND_FORECAST
		this.fileNumberRangeInput.disabled
			= fileType?.castType == CastType.SECOND_FORECAST

		this.southRadio.disabled = fileType?.castType == CastType.SECOND_FORECAST
		this.ionsRadio.disabled = fileType?.castType == CastType.SECOND_FORECAST
		this.monoRadio.disabled = fileType?.castType == CastType.SECOND_FORECAST
		this.waveRadio.disabled = fileType?.castType == CastType.SECOND_FORECAST
		this.totalRadio.disabled = fileType?.castType == CastType.SECOND_FORECAST
	}

	public saveOptions(): void {
		this.options = new Options(
			this.datetimeInput.value,
			this.model.getFileTypeFromGUI(),
			parseFloat(this.colorIndicatorLimitInput.value),
			this.showHeatmapCheckBox.checked,
			this.showMarginCheckBox.checked,
			this.smoothMarginCheckBox.checked,
			parseFloat(this.marginLevelInput.value),
			this.showDayNightCheckBox.checked,
			this.cloudinessCheckBox.checked,
			this.denoiseCheckbox.checked,
			this.continentsCheckbox.checked,
			this.citiesCheckbox.checked
		)
	}

	public restoreOptions(): void {
		this.datetimeInput.value
			= this.options!.datetime
		this.restoreFileTypeOptions()
		this.colorIndicatorLimitInput.value
			= this.options!.colorIndicatorLimit.toString()
		this.showHeatmapCheckBox.checked
			= this.options!.showHeatmapFlag
		this.showMarginCheckBox.checked
			= this.options!.showMarginFlag
		this.smoothMarginCheckBox.checked
			= this.options!.smoothMarginFlag
		this.marginLevelInput.value
			= this.options!.marginLevel.toString()
		this.showDayNightCheckBox.checked
			= this.options!.showDayNightFlag
		this.cloudinessCheckBox.checked
			= this.options!.showCloudinessFlag
		this.denoiseCheckbox.checked
			= this.options!.denoiseFlag
		this.continentsCheckbox.checked
			= this.options!.showContinentsFlag
		this.citiesCheckbox.checked
			= this.options!.showCitiesFlag
	}

	public restoreFileTypeOptions(): void {
		this.northRadio.checked
			= this.options?.fileType?.horizonSideType
			== HorizonSideType.NORTH
		this.southRadio.checked
			= this.options?.fileType?.horizonSideType
			== HorizonSideType.SOUTH

		this.forecastRadio.checked
			= this.options?.fileType?.castType
			== CastType.FORECAST
		this.nowcastRadio.checked
			= this.options?.fileType?.castType
			== CastType.NOWCAST
		this.secondForecastRadio.checked
			= this.options?.fileType?.castType
			== CastType.SECOND_FORECAST

		this.diffuseRadio.checked
			= this.options?.fileType?.radiationType
			== RadiationType.DIFFUSE
		this.ionsRadio.checked
			= this.options?.fileType?.radiationType
			== RadiationType.IONS
		this.monoRadio.checked
			= this.options?.fileType?.radiationType
			== RadiationType.MONO
		this.waveRadio.checked
			= this.options?.fileType?.radiationType
			== RadiationType.WAVE
		this.totalRadio.checked
			= this.options?.fileType?.radiationType
			== RadiationType.TOTAL
	}
}