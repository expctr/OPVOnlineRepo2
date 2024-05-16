/*
 * В данном файле содержится реализация модели для
 * паттерна MVC для управления страницей 2D визуализации.
 */

/**
 * Модель для паттерна MVC.
 * @author Иван Шагурин
 */
class Model {
	/**
	 * Представление для паттерна MVC.
	 */
	private readonly view: View

	/**
	 * Текстовое поле с номером текущего файла.
	 */
	private readonly currentFileNumberInput: HTMLInputElement

	/**
	 * Текствое поле с общим числом файлов выбранного типа.
	 */
	private readonly filesNumberInput: HTMLInputElement

	/**
	 * Текстовое поле с именем текущего файла.
	 */
	private readonly fileNameInput: HTMLInputElement

	/**
	 * Календарь с датой и времененем текущего файла.
	 */
	private readonly datetimeInput: HTMLInputElement

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

	private readonly showDayNightCheckBox: HTMLInputElement

	private readonly cloudinessCheckBox: HTMLInputElement

	private readonly denoiseCheckbox: HTMLInputElement

	private readonly continentsCheckbox: HTMLInputElement

	/**
	 * Ползунок для выбора номера файла.
	 */
	private readonly fileNumberRangeInput: HTMLInputElement

	/**
	 * Общее число файлов выбранного типа.
	 */
	private filesNumber: number | undefined = 0

	/**
	 * Словарь, ключами которого являются координаты единиц
	 * геоинформационных данных, а значениями - соответствующие
	 * единицы геоинформационных данных.
	 */
	public geoinformationDataUnits: { [key: string]: GeoinformationDataUnit } = {}

	public terminatorVertices: PointPolar[][] = []

	public continentsVertices: PointPolar[][] = []

	/**
	 * Индекс текущего файла.
	 */
	public currentFileIndex: number = 0

	/**
	 * Уровень границы.
	 */
	public marginLevel: number = 1

	/**
	 * Список ребер границы.
	 */
	public marginSegments: Segment[] = []

	/**
	 * Список отрезков, которые соединяют середины соседних отрезков границы.
	 */
	public middleMarginSegments: Segment[] = []

	/**
	 * Флажок, который поднят, если модель не готова переключаться к другому файлу.
	 */
	// private lockFlag: boolean = false

	/**
	 * Выбранный тип файлов.
	 */
	private fileType: FileType | null | undefined = undefined

	// console.log(response.cloudinessCellsGeomagneticCoordinatesData)
	// console.log(response.cloudinessCellsDescription)

	public cloudinessCellsGeomagneticCoordinates: [number, number][][] | null = null

	public cloudinessCellsValues: number[][] | null = null

	public cloudinessDatetimeRepresentation: string | null = null

	private readonly citiesCheckbox: HTMLInputElement

	private readonly extendedFunctionality1Checkbox: HTMLInputElement

	public cloudinessImageSrc: string | null = null

	public cloudinessMltRotationAngle: number = 0

	/**
	 * Флажок, который поднят, если нужно ожидать завершения
	 * процедуры восстановления индекса файла.
	 */
	// private waitForFileIndexRecovery: boolean = false

	// private waitForTerminatorVisualization: boolean = false

	/**
	 * Конструктор - создание нового объекта.
	 * @param view представление для паттерна MVC.
	 * @param currentFileNumberInput текстовое поле с номером текущего файла.
	 * @param filesNumberInput текствое поле с общим числом файлов выбранного типа.
	 * @param fileNameInput текстовое поле с именем текущего файла.
	 * @param datetimeInput календарь с датой и времененем текущего файла.
	 * @param northRadio флажок для выбора северной полусферы.
	 * @param southRadio флажок для выбора южной полусферы.
	 * @param forecastRadio флажок для выбора прогноза.
	 * @param nowcastRadio флажок для выбора наблюдаемых данных.
	 * @param diffuseRadio флажок для выбора вклада рассеянного сияния.
	 * @param ionsRadio флажок для выбора вклада ионов.
	 * @param monoRadio флажок для выбора вклада моноэнергетических пиков.
	 * @param waveRadio флажок для выбора вклада "broadband" ускорения.
	 * @param totalRadio флажок для выбора данных об общем вкладе авроральных компонент.
	 * @param fileNumberRangeInput ползунок для выбора номера файла.
	 */
	public constructor(
		view: View,
		currentFileNumberInput: HTMLInputElement,
		filesNumberInput: HTMLInputElement,
		fileNameInput: HTMLInputElement,
		datetimeInput: HTMLInputElement,
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
		showDayNightCheckBox: HTMLInputElement,
		cloudinessCheckBox: HTMLInputElement,
		denoiseCheckbox: HTMLInputElement,
		continentsCheckbox: HTMLInputElement,
		fileNumberRangeInput: HTMLInputElement,
		citiesCheckbox: HTMLInputElement,
		extendedFunctionality1Checkbox: HTMLInputElement) {
		this.view = view
		this.currentFileNumberInput = currentFileNumberInput
		this.filesNumberInput = filesNumberInput
		this.fileNameInput = fileNameInput
		this.datetimeInput = datetimeInput
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
		this.showDayNightCheckBox = showDayNightCheckBox
		this.cloudinessCheckBox = cloudinessCheckBox
		this.denoiseCheckbox = denoiseCheckbox
		this.continentsCheckbox = continentsCheckbox
		this.fileNumberRangeInput = fileNumberRangeInput
		this.citiesCheckbox = citiesCheckbox
		this.extendedFunctionality1Checkbox = extendedFunctionality1Checkbox
	}

	private parseCloudinessCellsGeomagneticCoordinates(cloudinessCellsGeomagneticCoordinatesData: string): void {
		if (cloudinessCellsGeomagneticCoordinatesData.length == 0) {
			this.cloudinessCellsGeomagneticCoordinates = null
			return
		}

		this.cloudinessCellsGeomagneticCoordinates = []
		let rows = cloudinessCellsGeomagneticCoordinatesData.split('\n').filter(element => element)

		for (let i = 0; i < rows.length; ++i) {
			let splitRow = rows[i].split(" ").filter(element => element)
			let newRow: [number, number][] = []

			for (let j = 0; j < splitRow.length; ++j) {
				let geomagneticCoordinates = splitRow[j].split("#")
				let geomagneticLatitude = Math.abs(parseFloat(geomagneticCoordinates[0]))
				let mlt = parseFloat(geomagneticCoordinates[1])

				newRow.push([geomagneticLatitude, mlt])
			}

			this.cloudinessCellsGeomagneticCoordinates.push(newRow)
		}
	}

	private parseCloudinessCellsValues(cloudinessCellsValuesData: string): void {
		if (cloudinessCellsValuesData.length == 0) {
			this.cloudinessCellsValues = null
			return
		}

		this.cloudinessCellsValues = []
		let rows = cloudinessCellsValuesData.split('\n').filter(element => element)

		for (let i = 0; i < rows.length; ++i) {
			let splitRow = rows[i].split(" ").filter(element => element)
			let newRow: number[] = []

			for (let j = 0; j < splitRow.length; ++j) {
				let cloudinessCellValue = parseFloat(splitRow[j])

				newRow.push(cloudinessCellValue)
			}

			this.cloudinessCellsValues.push(newRow)
		}
	}

	public getCurrentFileIndex() {
		return this.currentFileIndex
	}

	/**
	 * Получаем количество файлов и данные последнего
	 * файла выбранного типа от сервера.
	 * @returns
	 */
	public getFilesNumberAndLastFileData = () => { // async
		// if (this.lockFlag) {
		// 	return
		// }

		// this.lockFlag = true

		let filesNumber: number | null | undefined = undefined
		let data: string | null | undefined = undefined
		let fileName: string | null | undefined = undefined
		let fileDateTime: string | null | undefined = undefined

		this.fileType = this.getFileTypeFromGUI()
		let fileTypeRepresentation = this.fileType?.getStringRepresentation()

		if (fileTypeRepresentation == null) {
			return
		}

		$.ajax({
			url: '2d/util',
			method: 'get',
			dataType: 'json',
			async: false,
			data: { purpose: 'get files number and last file data', filesType: fileTypeRepresentation },
			success: function (response) {
				filesNumber = parseInt(response.filesNumber)
				data = response.data
				fileName = response.fileName
				fileDateTime = response.fileDateTime
			},
			error: function (response) {
				alert('Ошибка при попытке получить число файлов и последний файл выбранного типа.')
				filesNumber = null
				data = null
				fileName = null
				fileDateTime = null
			},
		})

		// while ((filesNumber == undefined)
		// 	|| (data == undefined)
		// 	|| (fileName == undefined)
		// 	|| (fileDateTime == undefined)) {
		// 	await this.delay(100);
		// }

		if ((filesNumber == null)
			|| (data == null)
			|| (fileName == null)
			|| (fileDateTime == null)) {
			return
		}

		this.filesNumber = filesNumber
		this.currentFileIndex = filesNumber - 1

		// @ts-ignore
		this.filesNumberInput.value = this.filesNumber.toString()
		this.fileNumberRangeInput.min = '0'
		this.fileNumberRangeInput.max = (this.filesNumber - 1).toString()
		this.fileNumberRangeInput.step = '1'
		this.fileNumberRangeInput.value = this.currentFileIndex.toString()
		this.datetimeInput.value = fileDateTime

		if (this.denoiseCheckbox.checked) {
			data = this.denoise(data)
		}

		this.parseGeoinformationDataUnits(data)
		this.prepareToDrawSmoothMargin()
		this.getTerminatorVerticesCoordinates()
		this.getContinentsVerticesCoordinates()

		this.processCloudiness2()
		this.getContinentsVerticesCoordinates()

		this.view.showRebuild(
			this.geoinformationDataUnits,
			this.marginLevel,
			this.middleMarginSegments,
			this.terminatorVertices,
			this.cloudinessImageSrc,
			this.cloudinessMltRotationAngle,
			this.continentsVertices,
			this.getCities(),
			this.getTotalMltRotationAngle(),
			null)
		this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString()
		this.fileNumberRangeInput.value = this.currentFileIndex.toString()
		this.fileNameInput.value = fileName

		// this.recoverFileIndexAndFileType()
	}

	/**
	 * Получаем количество файлов и данные файла по дате
	 * и времени от сервера.
	 * @returns 
	 */
	public getFilesNumberAndFileDataByDateTime = () => { // async
		// if (this.lockFlag) {
		// 	return
		// }

		// this.lockFlag = true

		let filesNumber: number | null | undefined = undefined
		let data: string | null | undefined = undefined
		let fileName: string | null | undefined = undefined
		let fileIndex: number | null | undefined = undefined
		let inputFileDateTime: string = this.datetimeInput.value
		let resultFileDateTime: string | null | undefined = undefined

		this.fileType = this.getFileTypeFromGUI()
		let fileTypeRepresentation = this.fileType?.getStringRepresentation()

		$.ajax({
			url: '2d/util',
			method: 'get',
			dataType: 'json',
			async: false,
			data: {
				purpose: 'get files number and file data by datetime',
				filesType: fileTypeRepresentation,
				inputFileDateTime: inputFileDateTime
			},
			success: function (response) {
				filesNumber = response.filesNumber
				data = response.data
				fileName = response.fileName
				fileIndex = response.fileIndex
				resultFileDateTime = response.fileDateTime
			},
			error: function (response) {
				alert('Ошибка при попытке получить число файлов выбранного типа и файл по дате и времени.')
				filesNumber = null
				data = null
				fileName = null
				fileIndex = null
				resultFileDateTime = null
			},
		})

		// while ((filesNumber == undefined)
		// 	|| (data == undefined)
		// 	|| (fileName == undefined)
		// 	|| (fileIndex == undefined)
		// 	|| (resultFileDateTime == undefined)) {
		// 	await this.delay(100)
		// }

		if ((filesNumber == null)
			|| (data == null)
			|| (fileName == null)
			|| (fileIndex == null)
			|| (resultFileDateTime == null)) {
			return
		}

		this.filesNumber = filesNumber
		this.currentFileIndex = parseInt(fileIndex)

		// @ts-ignore
		this.filesNumberInput.value = this.filesNumber.toString()
		this.fileNumberRangeInput.min = '0'
		this.fileNumberRangeInput.max = (this.filesNumber - 1).toString()
		this.fileNumberRangeInput.step = '1'
		this.fileNumberRangeInput.value = this.currentFileIndex.toString()
		this.datetimeInput.value = resultFileDateTime

		if (this.denoiseCheckbox.checked) {
			data = this.denoise(data)
		}
		this.parseGeoinformationDataUnits(data)
		this.prepareToDrawSmoothMargin()
		this.getTerminatorVerticesCoordinates()
		this.getContinentsVerticesCoordinates()

		this.processCloudiness2()
		this.getContinentsVerticesCoordinates()

		this.view.showRebuild(
			this.geoinformationDataUnits,
			this.marginLevel,
			this.middleMarginSegments,
			this.terminatorVertices,
			this.cloudinessImageSrc,
			this.cloudinessMltRotationAngle,
			this.continentsVertices,
			this.getCities(),
			this.getTotalMltRotationAngle(),
			null)
		this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString()
		this.fileNameInput.value = fileName
		this.currentFileNumberInput.value = (parseInt(fileIndex) + 1).toString()

		// this.recoverFileIndexAndFileType()
	}

	/**
	 * Задерживаем поток на указанное количество миллисекунд.
	 * @param ms указанное количество миллисекунд.
	 * @returns промис для ожидания на указанное количество миллисекунд.
	 */
	// private delay = (ms: number) => new Promise(res => setTimeout(res, ms));

	/**
	 * Получаем тип файла от элементов GUI.
	 * @returns тип файла, который задает GUI.
	 */
	public getFileTypeFromGUI(): FileType | null {
		let horizonSideType = this.getHorizonSideTypeFromGUI()
		let castType = this.getCastTypeFromGUI()
		let radiationType = this.getRadiationTypeFromGUI()

		if ((horizonSideType == null) || (castType == null) || (radiationType == null)) {
			return null
		}

		return new FileType(
			horizonSideType,
			castType,
			radiationType
		)
	}

	/**
	 * Получаем перечисление с типом полусферы
	 * от элементов GUI.
	 * @returns перечисленрие с типом полусферы,
	 *          который задает GUI.
	 */
	private getHorizonSideTypeFromGUI(): HorizonSideType | null {
		if (this.northRadio.checked) {
			return HorizonSideType.NORTH
		} else if (this.southRadio.checked) {
			return HorizonSideType.SOUTH
		} else {
			return null
		}
	}

	/**
	 * Получаем тип прогноза / наблюдаемого значения от GUI.
	 * @returns перечисление с типом прогноза / наблюдаемого значения,
	 *          который задает GUI.
	 */
	private getCastTypeFromGUI(): CastType | null {
		if (this.forecastRadio.checked) {
			return CastType.FORECAST
		} else if (this.nowcastRadio.checked) {
			return CastType.NOWCAST
		} else if (this.secondForecastRadio.checked) {
			return CastType.SECOND_FORECAST
		} else {
			return null
		}
	}

	/**
	 * Получаем тип излучения от элементов GUI.
	 * @returns перечисление с типом излучения,
	 *          который задает GUI.
	 */
	private getRadiationTypeFromGUI(): RadiationType | null {
		if (this.diffuseRadio.checked) {
			return RadiationType.DIFFUSE
		} else if (this.ionsRadio.checked) {
			return RadiationType.IONS
		} else if (this.monoRadio.checked) {
			return RadiationType.MONO
		} else if (this.waveRadio.checked) {
			return RadiationType.WAVE
		} else if (this.totalRadio.checked) {
			return RadiationType.TOTAL
		} else {
			return null
		}
	}

	/**
	 * Получаем единицы геониформационных данных по
	 * их строковым представлениям.
	 * @param data строковое представление единиц геоинформационных данных.
	 */
	private parseGeoinformationDataUnits(data: string): void {
		this.geoinformationDataUnits = {}
		let split_data = data.split('\n')

		for (let i = 0; i < split_data.length; ++i) {
			let geoinformationDataUnit = GeoinformationDataUnit.parse(split_data[i])
			this.geoinformationDataUnits[geoinformationDataUnit.getCoordinatesRepresentation()]
				= geoinformationDataUnit
		}
	}

	private parseTerminatorVertices(data: string) {
		this.terminatorVertices = []

		let splitData = data.split('@').filter(element => element)

		for (let i = 0; i < splitData.length; ++i) {
			this.terminatorVertices.push([])
			let splitSplitData = splitData[i].split('\n').filter(element => element)

			for (let j = 0; j < splitSplitData.length; ++j) {
				let splitRow = splitSplitData[j].split(' ')
				let polarDistance = parseFloat(splitRow[0])
				let polarAngle = parseFloat(splitRow[1])

				this.terminatorVertices[this.terminatorVertices.length - 1]
					.push(new PointPolar(polarDistance, polarAngle))
			}
		}
	}

	private parseContinentsVertices(data: string, rotatinAngle: number) {
		this.continentsVertices = []

		let splitData = data.split('@').filter(element => element)

		for (let i = 0; i < splitData.length; ++i) {
			this.continentsVertices.push([])
			let splitSplitData = splitData[i].split('\n').filter(element => element)

			for (let j = 0; j < splitSplitData.length; ++j) {
				let splitRow = splitSplitData[j].split(' ')
				let polarDistance = parseFloat(splitRow[0])
				let polarAngle = parseFloat(splitRow[1])

				polarAngle += rotatinAngle

				if (polarAngle >= 24) {
					polarAngle -= 24
				}

				if (polarAngle < 0) {
					polarAngle += 24
				}

				this.continentsVertices[this.continentsVertices.length - 1]
					.push(new PointPolar(polarDistance, polarAngle))
			}
		}

		// console.log(this.continentsVertices)
	}

	// public processCloudiness() {
	// 	if (this.cloudinessCheckBox.checked) {
	// 		let dateTime: string = this.datetimeInput.value
	// 		let horizonSide = (this.getFileTypeFromGUI()?.horizonSideType == HorizonSideType.NORTH)
	// 			? 'north' : 'south'

	// 		let cloudinessCellsGeomagneticCoordinatesData = ""
	// 		let cloudinessCellsValuesData = ""
	// 		let cloudinessDatetimeRepresentation = ""

	// 		let time1 = performance.now()
	// 		$.ajax({
	// 			url: '2d/cloudiness',
	// 			method: 'get',
	// 			dataType: 'json',
	// 			async: false,
	// 			data: {
	// 				dateTime: dateTime,
	// 				horizonSide: horizonSide
	// 			},
	// 			success: function (response) {
	// 				// alert('Данные об облачности получены')
	// 				cloudinessCellsGeomagneticCoordinatesData
	// 					= response.cloudinessCellsGeomagneticCoordinatesData
	// 				cloudinessCellsValuesData
	// 					= response.cloudinessCellsValuesData
	// 				cloudinessDatetimeRepresentation = response.cloudinessDatetime
	// 			},
	// 			error: function (response) {
	// 				alert('Ошибка при попытке получить данные об облачности.')
	// 			},
	// 		})
	// 		let time2 = performance.now()
	// 		console.log(`processCloudiness ajax took ${(time2 - time1) / 1} milliseconds`)


	// 		time1 = performance.now()
	// 		this.parseCloudinessCellsGeomagneticCoordinates(
	// 			cloudinessCellsGeomagneticCoordinatesData)
	// 		this.parseCloudinessCellsValues(
	// 			cloudinessCellsValuesData)
	// 		this.cloudinessDatetimeRepresentation = cloudinessDatetimeRepresentation
	// 		time2 = performance.now()
	// 		console.log(`parsing in ajax took ${(time2 - time1) / 1} milliseconds`)
	// 	}
	// }

	public processCloudiness2(): void {
		if (!this.cloudinessCheckBox.checked) {
			return
		}

		// alert('processCloudiness2')

		let dateTime: string = this.datetimeInput.value
		let horizonSide = (this.getFileTypeFromGUI()?.horizonSideType == HorizonSideType.NORTH)
			? 'north' : 'south'

		let cloudinessBase64 = ""
		let cloudinessMltRotationAngle = 0

		$.ajax({
			url: '2d/cloudiness',
			method: 'get',
			dataType: 'json',
			async: false,
			data: {
				dateTime: dateTime,
				horizonSide: horizonSide
			},
			success: function (response) {
				let textEncoder = new TextEncoder()
				let textDecoder = new TextDecoder()
				cloudinessBase64 = textDecoder.decode(textEncoder.encode(
					response.cloudinessBase64))
				cloudinessMltRotationAngle = parseFloat(response.cloudinessMltRotationAngle)
			},
			error: function (response) {
				alert('Ошибка при попытке получить данные об облачности.')
			},
		})

		if (cloudinessBase64 == "") {
			this.cloudinessImageSrc = null
			this.cloudinessMltRotationAngle = 0
		} else {
			this.cloudinessImageSrc = "data:image/png;base64," + cloudinessBase64;
			this.cloudinessMltRotationAngle = cloudinessMltRotationAngle
		}
	}

	/**
	 * Переходим к файлу с указанным индексом.
	 * @param fileIndex упомянутый индекс файла.
	 * @returns 
	 */
	public gotoCertainFile = (fileIndex: number) => { // async
		let _start = Date.now()
		// if (this.lockFlag) {
		// 	return
		// }

		// this.lockFlag = true

		this.fileType = this.getFileTypeFromGUI()
		let fileTypeRepresentation = this.fileType?.getStringRepresentation()

		if (fileTypeRepresentation == null) {
			return
		}

		// while (this.filesNumber == undefined) {
		// 	await this.delay(100);
		// }

		//@ts-ignore
		if ((fileIndex < 0) || (fileIndex > this.filesNumber - 1)) {
			return
		}

		this.currentFileIndex = fileIndex

		let data: string | null | undefined = undefined
		let fileName: string | null | undefined = undefined
		let fileDateTime: string | null | undefined = undefined

		// console.log(`before ajax: ${Date.now() - _start} ms`);
		_start = Date.now()

		let start = Date.now();
		$.ajax({
			url: '2d/util',
			method: 'get',
			dataType: 'json',
			async: false,
			data: {
				purpose: 'get file data by index',
				filesType: fileTypeRepresentation,
				fileIndex: (this.currentFileIndex).toString()
			},
			success: function (response) {
				data = response.data
				fileName = response.fileName
				fileDateTime = response.fileDateTime
			},
			error: function (response) {
				alert('Ошибка при попытке получить данные из файла.')
				data = null
				fileName = null
				fileDateTime = null
			},
		})
		// console.log(`ajax: ${Date.now() - start} ms`);

		if ((data == null)
			|| (fileName == null)
			|| (fileDateTime == null)) {
			return
		}

		this.datetimeInput.value = fileDateTime

		if (this.denoiseCheckbox.checked) {
			start = Date.now();
			data = this.denoise(data)
			// console.log(`denoise: ${Date.now() - start} ms`);
		}

		start = Date.now();
		this.parseGeoinformationDataUnits(data)
		// console.log(`parseGeoinformationDataUnits(data): ${Date.now() - start} ms`);

		start = Date.now();
		this.prepareToDrawSmoothMargin()
		// console.log(`prepareToDrawSmoothMargin(): ${Date.now() - start} ms`);

		start = Date.now();
		this.getTerminatorVerticesCoordinates()
		// console.log(`getTerminatorVerticesCoordinates(): ${Date.now() - start} ms`);

		start = Date.now();
		this.getContinentsVerticesCoordinates()
		// console.log(`getContinentsVerticesCoordinates(): ${Date.now() - start} ms`);

		start = Date.now();
		this.processCloudiness2()
		this.getContinentsVerticesCoordinates()
		// console.log(`processCloudiness(): ${Date.now() - start} ms`);

		start = Date.now();
		this.view.showRebuild(
			this.geoinformationDataUnits,
			this.marginLevel,
			this.middleMarginSegments,
			this.terminatorVertices,
			this.cloudinessImageSrc,
			this.cloudinessMltRotationAngle,
			this.continentsVertices,
			this.getCities(),
			this.getTotalMltRotationAngle(),
			null)
		this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString()
		this.fileNumberRangeInput.value = this.currentFileIndex.toString()
		this.fileNameInput.value = fileName
		// console.log(`show: ${Date.now() - start} ms`);

		// this.getTerminatorVerticesCoordinates()
		// this.recoverFileIndexAndFileType()

		// console.log(`after ajax: ${Date.now() - _start} ms`)
	}

	/**
	 * Переходим к файлу, дата и время которого являются
	 * ближайшими к выбранным.
	 * @returns 
	 */
	public gotoFileByDatetime = () => { // async
		// if (this.lockFlag) {
		// 	return
		// }

		// this.lockFlag = true

		this.fileType = this.getFileTypeFromGUI()
		let fileTypeRepresentation = this.fileType?.getStringRepresentation()

		if (fileTypeRepresentation == null) {
			return
		}

		// while (this.filesNumber == undefined) {
		// 	await this.delay(100);
		// }

		let inputFileDateTime: string = this.datetimeInput.value
		let data: string | null | undefined = undefined
		let fileName: string | null | undefined = undefined
		let fileIndex: string | null | undefined = undefined
		let resultFileDateTime: string | null | undefined = undefined

		$.ajax({
			url: '2d/util',
			method: 'get',
			dataType: 'json',
			async: false,
			data: {
				purpose: 'get file data by datetime',
				filesType: fileTypeRepresentation,
				inputFileDateTime: inputFileDateTime
			},
			success: function (response) {
				data = response.data
				fileName = response.fileName
				fileIndex = response.fileIndex
				resultFileDateTime = response.fileDateTime
			},
			error: function (response) {
				alert('Ошибка при попытке получить файл по дате и времени.')
				data = null
				fileName = null
				fileIndex = null
				resultFileDateTime = null
			},
		})

		// while ((data == undefined)
		// 	|| (fileName == undefined)
		// 	|| (fileIndex == undefined)
		// 	|| (resultFileDateTime == undefined)) {
		// 	await this.delay(100)
		// }

		if ((data == null)
			|| (fileName == null)
			|| (fileIndex == null)
			|| (resultFileDateTime == null)) {
			return
		}

		this.currentFileIndex = parseInt(fileIndex)
		this.datetimeInput.value = resultFileDateTime

		if (this.denoiseCheckbox.checked) {
			data = this.denoise(data)
		}

		this.parseGeoinformationDataUnits(data)
		this.prepareToDrawSmoothMargin()
		this.getTerminatorVerticesCoordinates()
		this.getContinentsVerticesCoordinates()

		this.processCloudiness2()
		this.getContinentsVerticesCoordinates()

		this.view.showRebuild(
			this.geoinformationDataUnits,
			this.marginLevel,
			this.middleMarginSegments,
			this.terminatorVertices,
			this.cloudinessImageSrc,
			this.cloudinessMltRotationAngle,
			this.continentsVertices,
			this.getCities(),
			this.getTotalMltRotationAngle(),
			null)
		this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString()
		this.fileNumberRangeInput.value = this.currentFileIndex.toString()
		this.fileNameInput.value = fileName

		// this.recoverFileIndexAndFileType()
	}

	/**
	 * Переходим к предыдущему файлу.
	 * @returns 
	 */
	public gotoPreviousFile(): void {
		if (this.filesNumber == undefined) {
			return
		} else if (this.currentFileIndex < 1) {
			return
		}

		this.gotoCertainFile(this.currentFileIndex - 1)
	}

	/**
	 * Переходим к следующему файлу.
	 * @returns 
	 */
	public gotoNextFile(): void {
		if (this.filesNumber == undefined) {
			return
		} else if (this.currentFileIndex >= this.filesNumber - 1) {
			return
		}

		// alert("here")
		// console.log(typeof this.currentFileIndex)
		// console.log(this.currentFileIndex)
		// console.log(this.currentFileIndex + 1)

		this.gotoCertainFile(this.currentFileIndex + 1)
	}

	/**
	 * Получаем количество файлов выбранного типа.
	 * @returns упомянутое количество файлов.
	 */
	public getFilesNumber(): number | undefined {
		return this.filesNumber
	}

	/**
	 * Выполняем подготовку к рисованию сглаженной границы.
	 */
	public prepareToDrawSmoothMargin(): void {
		this.findMarginSegments()
		this.connectMarginSegments()
		this.findMiddleMarginSegments()
		this.connectMiddleMarginSegments()
	}

	/**
	 * Находим ребра границы.
	 */
	private findMarginSegments(): void {
		this.marginSegments = []

		this.findRadialMarginSegments()
		this.findRoundMarginSegments()
	}

	/**
	 * Находим ребра границы, которые лежат на радиальных линиях
	 * координатной решетки.
	 * @returns 
	 */
	private findRadialMarginSegments(): void {
		if (Object.keys(this.geoinformationDataUnits).length == 0) {
			return
		}

		for (let polarAngle = 0; polarAngle <= 23.75; polarAngle += 0.25) {
			for (let polarDistance = 50.5; polarDistance <= 89.5; polarDistance += 0.5) {
				let first = this.geoinformationDataUnits[polarAngle.toString() + ' ' + polarDistance.toString()]

				if (first == undefined) {
					continue
				}

				let nextPolarAngle = polarAngle - 0.25

				if (nextPolarAngle < 0) {
					nextPolarAngle = 23.75
				}

				let second = this.geoinformationDataUnits[nextPolarAngle.toString() + ' ' + polarDistance.toString()]

				if (second == undefined) {
					continue
				}

				if (this.view.marginIsLocated(first.getValue(), second.getValue(), this.marginLevel)) {
					let firstPoint = first.getFirstPoint(this.view.visualizationDisplay.getWidth())
					let fourthPoint = first.getFourhtPoint(this.view.visualizationDisplay.getWidth())

					this.marginSegments.push(
						new Segment(
							firstPoint,
							fourthPoint,
							SegmentOrientation.RADIAL
						)
					)
				}
			}
		}
	}

	/**
	 * Находим ребра границы, которые приближенно лежат на круговых
	 * линиях границы.
	 * @returns 
	 */
	private findRoundMarginSegments(): void {
		if (Object.keys(this.geoinformationDataUnits).length == 0) {
			return
		}

		for (let polarAngle = 0; polarAngle <= 23.75; polarAngle += 0.25) {
			for (let polarDistance = 50.5; polarDistance <= 89.5; polarDistance += 0.5) {
				let first = this.geoinformationDataUnits[polarAngle.toString() + ' ' + polarDistance.toString()]

				if (first == undefined) {
					continue
				}

				let nextPolarDistance = polarDistance - 0.5

				let second = this.geoinformationDataUnits[polarAngle.toString() + ' ' + nextPolarDistance.toString()]

				if (second == undefined) {
					continue
				}

				if (this.view.marginIsLocated(first.getValue(), second.getValue(), this.marginLevel)) {
					let firstPoint = first.getFirstPoint(this.view.visualizationDisplay.getWidth())
					let secondPoint = first.getSecondPoint(this.view.visualizationDisplay.getWidth())

					this.marginSegments.push(
						new Segment(
							firstPoint,
							secondPoint,
							SegmentOrientation.ROUND
						)
					)
				}
			}
		}
	}

	/**
	 * Связываем соседние отрезки.
	 * @param segments список упомянутых отрезков.
	 */
	private connectSegments(segments: Segment[]): void {
		for (let i = 0; i < segments.length; ++i) {
			for (let j = 0; j < segments.length; ++j) {
				if (i == j) {
					continue
				}

				if (segments[i].isNewNeighbour(segments[j])) {
					segments[i].connectAsNeighbour(segments[j])
				}

				if (segments[i].hasBothNeighbours()) {
					break
				}
			}
		}
	}

	/**
	 * Связываем ребра границы.
	 */
	private connectMarginSegments(): void {
		for (let i = 0; i < this.marginSegments.length; ++i) {
			for (let j = 0; j < this.marginSegments.length; ++j) {
				if (i == j) {
					continue
				}

				if (this.marginSegments[i].isFirstNeighbour(this.marginSegments[j])) {
					this.marginSegments[i].firstEndNeighbours.push(this.marginSegments[j])
				}

				if (this.marginSegments[i].isSecondNeighbour(this.marginSegments[j])) {
					this.marginSegments[i].secondEndNeighbours.push(this.marginSegments[j])
				}
			}
		}

		for (let i = 0; i < this.marginSegments.length; ++i) {
			this.marginSegments[i].connectWithFirstTrueNeighbour()
			this.marginSegments[i].connectWithSecondTrueNeighbour()
		}
	}

	/**
	 * Находим отрезки, которые соединяют середины соседних
	 * ребер границы.
	 */
	private findMiddleMarginSegments(): void {
		this.middleMarginSegments = []

		for (let i = 0; i < this.marginSegments.length; ++i) {
			let marginSegment = this.marginSegments[i]

			if (marginSegment.getFirstNeighbour() != null) {
				this.middleMarginSegments.push(
					new Segment(
						marginSegment.getMiddle(),
						marginSegment.getFirstNeighbour()!.getMiddle(),
						null
					)
				)
			}

			if (marginSegment.getSecondNeighbour() != null) {
				this.middleMarginSegments.push(
					new Segment(
						marginSegment.getMiddle(),
						marginSegment.getSecondNeighbour()!.getMiddle(),
						null
					)
				)
			}
		}
	}

	/**
	 * Связываем соседние отрезки, которые соединяют середины
	 * соседних ребер границы.
	 */
	private connectMiddleMarginSegments(): void {
		this.connectSegments(this.middleMarginSegments)
	}

	private convertLatLngsArrayToString(latlngsArray: object): string {
		let result = ""

		//@ts-ignore
		for (let i = 0; i < latlngsArray[0].length; ++i) {
			//@ts-ignore
			let lat = latlngsArray[0][i].lat
			//@ts-ignore
			let lng = latlngsArray[0][i].lng

			//@ts-ignore
			result += lat + " " + lng + "\n"
		}

		return result
	}

	public getTerminatorVerticesCoordinates = () => { // async
		if (!this.showDayNightCheckBox.checked) {
			return
		}

		//@ts-ignore
		let latlngsArray = L.terminator({ time: this.datetimeInput.value + ":00Z" })._latlngs
		// let latlngsArray = L.terminator({ time: this.datetimeInput.value })._latlngs
		let data: string | undefined = undefined

		$.ajax({
			url: '2d/terminator',
			method: 'post',
			dataType: 'json',
			async: false,
			data: {
				csrfmiddlewaretoken: this.getCookie('csrftoken'),
				terminatorVerticesCoordinates: this.convertLatLngsArrayToString(latlngsArray),
				dateTime: this.datetimeInput.value,
				horizonSide: (this.northRadio.checked) ? 'north' : 'south'
			},
			success: function (response) {
				data = response.magneticCoordinates
			},
			error: function (response) {
				alert('Ошибка при попытке получить коордианты вершин терминатора.')
			},
		})

		if (data != undefined) {
			this.parseTerminatorVertices(data)
		}
	}

	public getContinentsVerticesCoordinates = () => {
		if (!this.continentsCheckbox.checked) {
			return
		}

		let data: string | undefined = undefined
		let rotationAngle: number = 0

		$.ajax({
			url: "2d/continents",
			method: "get",
			dataType: "json",
			async: false,
			data: {
				dateTime: this.datetimeInput.value,
				horizonSide: (this.northRadio.checked) ? 'north' : 'south'
			},
			success: function (response) {
				data = response.magneticCoordinates
				rotationAngle = parseFloat(response.rotationAngle)
			},
			error: function (response) {
				alert('Ошибка при попытке получить данные о континентах.')
			},
		})

		if (data != undefined) {
			this.parseContinentsVertices(data, rotationAngle)
		}
	}

	public getCookie(name: string) {
		var cookieValue = null;
		if (document.cookie && document.cookie !== '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) === (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}

	private denoise(data: string): string {
		// console.log('here')
		// console.log(data)

		let outputData = ""

		$.ajax({
			url: '2d/denoise',
			method: 'post',
			//headers: { 'X-CSRFToken': csrftoken },
			dataType: 'json',
			async: false,
			data: {
				csrfmiddlewaretoken: this.getCookie('csrftoken'),
				data: data
			},
			success: function (response) {
				outputData = response.data
			},
			error: function (response) {
				alert('Ошибка при попытке фильровать шум.')
			},
		})

		return outputData
	}

	// public getMLTRotationAngle(): number {
	// 	if (this.cloudinessDatetimeRepresentation == null) {
	// 		return 0
	// 	}

	// 	let rotationAngle = 0

	// 	$.ajax({
	// 		url: '2d/rotation-angle',
	// 		method: 'get',
	// 		dataType: 'json',
	// 		async: false,
	// 		data: {
	// 			currentDatetime: this.datetimeInput.value,
	// 			cloudinessDatetime: this.cloudinessDatetimeRepresentation
	// 		},
	// 		success: function (response) {
	// 			rotationAngle = parseFloat(response.rotationAngle)
	// 		},
	// 		error: function (response) {
	// 			alert('Ошибка при попытке получить угол поворота геомагнитной системы координат.')
	// 		},
	// 	})

	// 	return rotationAngle
	// }

	private parsePointPolarArray(description: string): NamedPointPolar[] {
		let namedPointPolarArray: NamedPointPolar[] = []
		let splitDescription = description.split('\n').filter(element => element)

		for (let i = 0; i < splitDescription.length; ++i) {
			let currentLine = splitDescription[i]
			let splitCurrentLine
				= currentLine.split(' ').filter(element => element)

			let namedPointPolar
				= new NamedPointPolar(
					splitCurrentLine[0],
					parseFloat(splitCurrentLine[1]),
					parseFloat(splitCurrentLine[2]))

			namedPointPolarArray.push(namedPointPolar)
		}

		return namedPointPolarArray
	}

	public getCities(): NamedPointPolar[] | null {
		if (!this.citiesCheckbox.checked) {
			return null
		}

		let citiesDescription = ''
		let cities: NamedPointPolar[] = []

		$.ajax({
			url: '2d/cities',
			method: 'get',
			dataType: 'json',
			async: false,
			data: {
				dateTime: this.datetimeInput.value,
				hemisphere: (this.northRadio.checked) ? 'north' : 'south'
			},
			success: function (response) {
				citiesDescription = response.citiesDescription
			},
			error: function (response) {
				alert('Ошибка при попытке получить данные о городах.')
			},
		})

		cities = this.parsePointPolarArray(citiesDescription)

		// console.log(cities)

		return cities
	}

	public parseExtendedFunctionalityClass1Array(
		description: string): ExtendedFunctionalityClass1[] {
		let extendedFunctionalityClass1Array
			: ExtendedFunctionalityClass1[] = []
		let splitDescription = description.split('\n').filter(element => element)

		for (let i = 0; i < splitDescription.length; ++i) {
			extendedFunctionalityClass1Array
				.push(ExtendedFunctionalityClass1.parse(
					splitDescription[i]))
		}

		return extendedFunctionalityClass1Array
	}

	public getExtendedFunctionality1Info(): ExtendedFunctionalityClass1[] | null {
		if (!this.extendedFunctionality1Checkbox.checked) {
			return null
		}

		let description = ''

		$.ajax({
			url: '2d/extended-functionality-1',
			method: 'get',
			dataType: 'json',
			async: false,
			data: {
				dateTime: this.datetimeInput.value,
				hemisphere: (this.northRadio.checked) ? 'north' : 'south'
			},
			success: function (response) {
				description = response.description
			},
			error: function (response) {
				alert('Ошибка при попытке получить данные расширенного функционала первого типа.')
			},
		})

		return this.parseExtendedFunctionalityClass1Array(description)
	}


	public getSecondForecast() {
		let filesNumber: number | null | undefined = undefined
		let data: string | null | undefined = undefined
		let fileName: string | null | undefined = undefined
		let fileDateTime: string | null | undefined = undefined

		$.ajax({
			url: 'second-forecast',
			method: 'get',
			dataType: 'json',
			async: false,
			data: {},
			success: function (response) {
				filesNumber = parseInt(response.filesNumber)
				data = response.data
				fileName = response.fileName
				fileDateTime = response.fileDateTime
			},
			error: function (response) {
				alert('Ошибка при попытке получить прогноз.')
			},
		})

		if ((filesNumber == null)
			|| (data == null)
			|| (fileName == null)
			|| (fileDateTime == null)) {
			return
		}

		this.parseGeoinformationDataUnits(data)
		this.prepareToDrawSmoothMargin()
		this.getTerminatorVerticesCoordinates()
		this.getContinentsVerticesCoordinates()

		this.processCloudiness2()
		this.getContinentsVerticesCoordinates()

		this.filesNumber = filesNumber
		this.currentFileIndex = filesNumber - 1

		//@ts-ignore
		this.filesNumberInput.value = this.filesNumber.toString()

		this.view.showRebuild(
			this.geoinformationDataUnits,
			this.marginLevel,
			this.middleMarginSegments,
			this.terminatorVertices,
			this.cloudinessImageSrc,
			this.cloudinessMltRotationAngle,
			this.continentsVertices,
			this.getCities(),
			this.getTotalMltRotationAngle(),
			null)

		this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString()
		this.fileNumberRangeInput.value = this.currentFileIndex.toString()
		this.fileNameInput.value = fileName
		this.datetimeInput.value = fileDateTime
	}

	public getTotalMltRotationAngle(): number {
		let dateTime: string = this.datetimeInput.value
		let horizonSide = (this.getFileTypeFromGUI()!.horizonSideType == HorizonSideType.NORTH)
			? 'north' : 'south'
		let totalMltRotationAngle = 0

		$.ajax({
			url: '2d/total-rotation-angle',
			method: 'get',
			dataType: 'json',
			async: false,
			data: {
				dateTime: dateTime,
				horizonSide: horizonSide
			},
			success: function (response) {
				totalMltRotationAngle = parseFloat(response.mltRotationAngle)
			},
			error: function (response) {
				alert('Ошибка при попытке получить общий угол поворота изображения.')
			},
		})

		return totalMltRotationAngle
	}
}