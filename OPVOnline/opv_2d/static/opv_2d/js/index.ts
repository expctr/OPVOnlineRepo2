/*
 * Это главный файл, который отвечает за работу страницы 2D визуализации.
 */

window.onload = () => {
	/*
 * В данном файле содержится скрипт, запускающий программу.
 */

	/**
	 * Текстовое поле с номером текущего файла.
	 */
	let currentFileNumberInput = <HTMLInputElement>document.getElementById('current-file-number-input')

	/**
	 * Текствое поле с общим числом файлов выбранного типа.
	 */
	let filesNumberInput = <HTMLInputElement>document.getElementById('files-number-input')

	/**
	 * Текстовое поле с именем текущего файла.
	 */
	let fileNameInput = <HTMLInputElement>document.getElementById('file-name-input')

	/**
	 * Кнопка "Предыдущий файл".
	 */
	let gotoPreviousFileButton = <HTMLButtonElement>document.getElementById('go-to-previous-file-button')

	/**
	 * Кнопка "Следующий файл".
	 */
	let gotoNextFileButton = <HTMLButtonElement>document.getElementById('go-to-next-file-button')

	/**
	 * Кнопка "Перейти к файлу".
	 */
	let gotoFileButton = <HTMLButtonElement>document.getElementById('go-to-certain-file-button')

	/**
	 * Текстовое поле для отоборажения номера файла,
	 * к которому нужно перейти.
	 */
	let gotoCertainFileInput = <HTMLInputElement>document.getElementById('go-to-certain-file-input')

	/**
	 *  Календарь с датой и времененем текущего файла.
	 */
	let datetimeInput = <HTMLInputElement>document.getElementById('datetime-input')

	/**
	 * Кнопка "Выбрать дату и время".
	 */
	// let selectDateAndTimeButton = <HTMLButtonElement>document.getElementById('go-to-file-by-datetime')

	/**
	 * Холст для визуализации.
	 */
	let visualizationCanvas = <HTMLCanvasElement>document.getElementById('visualization-canvas')

	/**
	 * Холст для отображения цветовой шкалы.
	 */
	let colorIndicatorCanvas = <HTMLCanvasElement>document.getElementById('color-indicator-canvas')

	/**
	 * Кнопка "Сдвиг и размер по умолчанию".
	 */
	let defaultOffsetAndSizesButton = <HTMLButtonElement>document.getElementById('default-offset-and-sizes-button')

	let changeColorIndicatorCanvasVisibilityButton = <HTMLButtonElement>document.getElementById('change-color-indicator-visibility-button')

	/**
	 * Флажок для выбора северной полусферы.
	 */
	let northRadio = <HTMLInputElement>document.getElementById('north-radio')

	/**
	 * Флажок для выбора южной полусферы.
	 */
	let southRadio = <HTMLInputElement>document.getElementById('south-radio')

	/**
	 * Флажок для выбора прогноза.
	 */
	let forecastRadio = <HTMLInputElement>document.getElementById('forecast-radio')

	/**
	 * Флажок для выбора наблюдаемых данных.
	 */
	let nowcastRadio = <HTMLInputElement>document.getElementById('nowcast-radio')

	let secondForecastRadio = <HTMLInputElement>document.getElementById('second-forecast-radio')

	/**
	 * Флажок для выбора вклада рассеянного сияния.
	 */
	let diffuseRadio = <HTMLInputElement>document.getElementById('diffuse-radio')

	/**
	 * Флажок для выбора вклада ионов.
	 */
	let ionsRadio = <HTMLInputElement>document.getElementById('ions-radio')

	/**
	 * Флажок для выбора вклада моноэнергетических пиков.
	 */
	let monoRadio = <HTMLInputElement>document.getElementById('mono-radio')

	/**
	 * Флажок для выбора вклада "broadband" ускорения.
	 */
	let waveRadio = <HTMLInputElement>document.getElementById('wave-radio')

	/**
	 * Флажок для выбора данных об общем вкладе авроральных компонент.
	 */
	let totalRadio = <HTMLInputElement>document.getElementById('total-radio')

	/**
	 * Текстовое поле для отображения предельного значения цветовой шкалы.
	 */
	let colorIndicatorLimitInput = <HTMLInputElement>document.getElementById('color-indicator-limit-input')

	/**
	 * Ползунок для выбора номера файла.
	 */
	let fileNumberRangeInput = <HTMLInputElement>document.getElementById('file-number-range-input')

	/**
	 * Текстовое поле для отображения уровня границы.
	 */
	let marginLevelInput = <HTMLInputElement>document.getElementById('margin-level-input')

	/**
	 * Флажок "Отображать тепловую карту".
	 */
	let showHeatmapCheckbox = <HTMLInputElement>document.getElementById('show-heatmap-checkbox')

	/**
	 * Флажок "Отображать границу".
	 */
	let showMarginCheckbox = <HTMLInputElement>document.getElementById('show-margin-checkbox')

	/**
	 * Флажок "Гладкая граница".
	 */
	let smoothMarginCheckbox = <HTMLInputElement>document.getElementById('smooth-margin-checkbox')

	let showDayNightCheckbox = <HTMLInputElement>document.getElementById('show-day-night-checkbox')

	let cloudinessCheckBox = <HTMLInputElement>document.getElementById('cloudiness-checkbox')

	let denoiseCheckbox = <HTMLInputElement>document.getElementById('denoise-checkbox')

	let continentsCheckbox = <HTMLInputElement>document.getElementById('continents-checkbox')

	let additionalFileInfoButton = <HTMLButtonElement>document.getElementById('additional-file-info-button')

	let citiesCheckbox = <HTMLInputElement>document.getElementById('cities-checkbox')

	// let extendedFunctionality1Checkbox = <HTMLInputElement>document.getElementById('extended-functionality-1-checkbox')

	northRadio.checked = true
	nowcastRadio.checked = true
	totalRadio.checked = true
	showHeatmapCheckbox.checked = true
	showMarginCheckbox.checked = true
	smoothMarginCheckbox.checked = true
	showDayNightCheckbox.checked = true
	// cloudinessCheckBox.checked = true
	denoiseCheckbox.checked = true
	continentsCheckbox.checked = true
	citiesCheckbox.checked = true

	/**
	 * Представление для паттерна MVC.
	 */
	let view = new View(
		visualizationCanvas,
		578 * 4, 461 * 4,
		colorIndicatorCanvas,
		120 * 4, 461 * 4,
		showHeatmapCheckbox,
		showMarginCheckbox,
		smoothMarginCheckbox,
		showDayNightCheckbox,
		cloudinessCheckBox,
		continentsCheckbox
	)

	view.setDrawingManager()
	view.hideColorIndicatorCanvas()
	view.runDrawingManager()

	/**
	 * Модель для паттерна MVC.
	 */
	let model = new Model(
		view,
		currentFileNumberInput,
		filesNumberInput,
		fileNameInput,
		datetimeInput,
		northRadio,
		southRadio,
		forecastRadio,
		nowcastRadio,
		secondForecastRadio,
		diffuseRadio,
		ionsRadio,
		monoRadio,
		waveRadio,
		totalRadio,
		showDayNightCheckbox,
		cloudinessCheckBox,
		denoiseCheckbox,
		continentsCheckbox,
		fileNumberRangeInput,
		citiesCheckbox,
		// extendedFunctionality1Checkbox
	)
	model.getFilesNumberAndLastFileData()

	/**
	 * Контроллер для паттерна MVC.
	 */
	let controller = new Controller(
		view,
		model,
		gotoPreviousFileButton,
		gotoNextFileButton,
		gotoFileButton,
		gotoCertainFileInput,
		datetimeInput,
		defaultOffsetAndSizesButton,
		changeColorIndicatorCanvasVisibilityButton,
		northRadio,
		southRadio,
		forecastRadio,
		nowcastRadio,
		secondForecastRadio,
		diffuseRadio,
		ionsRadio,
		monoRadio,
		waveRadio,
		totalRadio,
		colorIndicatorLimitInput,
		showHeatmapCheckbox,
		showMarginCheckbox,
		smoothMarginCheckbox,
		fileNumberRangeInput,
		marginLevelInput,
		showDayNightCheckbox,
		cloudinessCheckBox,
		denoiseCheckbox,
		continentsCheckbox,
		additionalFileInfoButton,
		citiesCheckbox,
		// extendedFunctionality1Checkbox
	)
	controller.addEventListeners()

	colorIndicatorLimitInput.value = GeoinformationDataUnit.maxValue.toString()
	marginLevelInput.value = model.marginLevel.toString()

	let fileNumberLabel = <HTMLLabelElement>document.getElementById("file-number-label")
	let fromLabel = <HTMLLabelElement>document.getElementById("from-label")
	let fileNameLabel = <HTMLLabelElement>document.getElementById("file-name-label")

	fileNumberLabel.style.display = "none"
	currentFileNumberInput.style.display = "none"
	fromLabel.style.display = "none"
	filesNumberInput.style.display = "none"
	fileNameLabel.style.display = "none"
	fileNameInput.style.display = "none"
	gotoFileButton.style.display = "none"
	gotoCertainFileInput.style.display = "none"

	controller.enableAndDisableSomeGUIElements()
}
