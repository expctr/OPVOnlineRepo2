"use strict";
/*
 * В данном файле содержится реализация модели для
 * паттерна MVC.
 */
/**
 * Модель для паттерна MVC.
 * @author Иван Шагурин
 */
class Model {
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
    constructor(view, currentFileNumberInput, filesNumberInput, fileNameInput, datetimeInput, northRadio, southRadio, forecastRadio, nowcastRadio, secondForecastRadio, diffuseRadio, ionsRadio, monoRadio, waveRadio, totalRadio, showDayNightCheckBox, cloudinessCheckBox, denoiseCheckbox, continentsCheckbox, fileNumberRangeInput, citiesCheckbox, extendedFunctionality1Checkbox) {
        /**
         * Общее число файлов выбранного типа.
         */
        this.filesNumber = 0;
        /**
         * Словарь, ключами которого являются координаты единиц
         * геоинформационных данных, а значениями - соответствующие
         * единицы геоинформационных данных.
         */
        this.geoinformationDataUnits = {};
        this.terminatorVertices = [];
        this.continentsVertices = [];
        /**
         * Индекс текущего файла.
         */
        this.currentFileIndex = 0;
        /**
         * Уровень границы.
         */
        this.marginLevel = 1;
        /**
         * Список ребер границы.
         */
        this.marginSegments = [];
        /**
         * Список отрезков, которые соединяют середины соседних отрезков границы.
         */
        this.middleMarginSegments = [];
        /**
         * Флажок, который поднят, если модель не готова переключаться к другому файлу.
         */
        // private lockFlag: boolean = false
        /**
         * Выбранный тип файлов.
         */
        this.fileType = undefined;
        // console.log(response.cloudinessCellsGeomagneticCoordinatesData)
        // console.log(response.cloudinessCellsDescription)
        this.cloudinessCellsGeomagneticCoordinates = null;
        this.cloudinessCellsValues = null;
        this.cloudinessDatetimeRepresentation = null;
        this.cloudinessImageSrc = null;
        this.cloudinessMltRotationAngle = 0;
        /**
         * Получаем количество файлов и данные последнего
         * файла выбранного типа от сервера.
         * @returns
         */
        this.getFilesNumberAndLastFileData = () => {
            // if (this.lockFlag) {
            // 	return
            // }
            var _a;
            // this.lockFlag = true
            let filesNumber = undefined;
            let data = undefined;
            let fileName = undefined;
            let fileDateTime = undefined;
            this.fileType = this.getFileTypeFromGUI();
            let fileTypeRepresentation = (_a = this.fileType) === null || _a === void 0 ? void 0 : _a.getStringRepresentation();
            if (fileTypeRepresentation == null) {
                return;
            }
            $.ajax({
                url: '2d/util',
                method: 'get',
                dataType: 'json',
                async: false,
                data: { purpose: 'get files number and last file data', filesType: fileTypeRepresentation },
                success: function (response) {
                    filesNumber = parseInt(response.filesNumber);
                    data = response.data;
                    fileName = response.fileName;
                    fileDateTime = response.fileDateTime;
                },
                error: function (response) {
                    alert('Ошибка при попытке получить число файлов и последний файл выбранного типа.');
                    filesNumber = null;
                    data = null;
                    fileName = null;
                    fileDateTime = null;
                },
            });
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
                return;
            }
            this.filesNumber = filesNumber;
            this.currentFileIndex = filesNumber - 1;
            // @ts-ignore
            this.filesNumberInput.value = this.filesNumber.toString();
            this.fileNumberRangeInput.min = '0';
            this.fileNumberRangeInput.max = (this.filesNumber - 1).toString();
            this.fileNumberRangeInput.step = '1';
            this.fileNumberRangeInput.value = this.currentFileIndex.toString();
            this.datetimeInput.value = fileDateTime;
            if (this.denoiseCheckbox.checked) {
                data = this.denoise(data);
            }
            this.parseGeoinformationDataUnits(data);
            this.prepareToDrawSmoothMargin();
            this.getTerminatorVerticesCoordinates();
            this.getContinentsVerticesCoordinates();
            this.processCloudiness2();
            this.getContinentsVerticesCoordinates();
            this.view.showRebuild(this.geoinformationDataUnits, this.marginLevel, this.middleMarginSegments, this.terminatorVertices, this.cloudinessImageSrc, this.cloudinessMltRotationAngle, this.continentsVertices, this.getCities(), this.getTotalMltRotationAngle(), null);
            this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString();
            this.fileNumberRangeInput.value = this.currentFileIndex.toString();
            this.fileNameInput.value = fileName;
            // this.recoverFileIndexAndFileType()
        };
        /**
         * Получаем количество файлов и данные файла по дате
         * и времени от сервера.
         * @returns
         */
        this.getFilesNumberAndFileDataByDateTime = () => {
            // if (this.lockFlag) {
            // 	return
            // }
            var _a;
            // this.lockFlag = true
            let filesNumber = undefined;
            let data = undefined;
            let fileName = undefined;
            let fileIndex = undefined;
            let inputFileDateTime = this.datetimeInput.value;
            let resultFileDateTime = undefined;
            this.fileType = this.getFileTypeFromGUI();
            let fileTypeRepresentation = (_a = this.fileType) === null || _a === void 0 ? void 0 : _a.getStringRepresentation();
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
                    filesNumber = response.filesNumber;
                    data = response.data;
                    fileName = response.fileName;
                    fileIndex = response.fileIndex;
                    resultFileDateTime = response.fileDateTime;
                },
                error: function (response) {
                    alert('Ошибка при попытке получить число файлов выбранного типа и файл по дате и времени.');
                    filesNumber = null;
                    data = null;
                    fileName = null;
                    fileIndex = null;
                    resultFileDateTime = null;
                },
            });
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
                return;
            }
            this.filesNumber = filesNumber;
            this.currentFileIndex = parseInt(fileIndex);
            // @ts-ignore
            this.filesNumberInput.value = this.filesNumber.toString();
            this.fileNumberRangeInput.min = '0';
            this.fileNumberRangeInput.max = (this.filesNumber - 1).toString();
            this.fileNumberRangeInput.step = '1';
            this.fileNumberRangeInput.value = this.currentFileIndex.toString();
            this.datetimeInput.value = resultFileDateTime;
            if (this.denoiseCheckbox.checked) {
                data = this.denoise(data);
            }
            this.parseGeoinformationDataUnits(data);
            this.prepareToDrawSmoothMargin();
            this.getTerminatorVerticesCoordinates();
            this.getContinentsVerticesCoordinates();
            this.processCloudiness2();
            this.getContinentsVerticesCoordinates();
            this.view.showRebuild(this.geoinformationDataUnits, this.marginLevel, this.middleMarginSegments, this.terminatorVertices, this.cloudinessImageSrc, this.cloudinessMltRotationAngle, this.continentsVertices, this.getCities(), this.getTotalMltRotationAngle(), null);
            this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString();
            this.fileNameInput.value = fileName;
            this.currentFileNumberInput.value = (parseInt(fileIndex) + 1).toString();
            // this.recoverFileIndexAndFileType()
        };
        /**
         * Переходим к файлу с указанным индексом.
         * @param fileIndex упомянутый индекс файла.
         * @returns
         */
        this.gotoCertainFile = (fileIndex) => {
            var _a;
            let _start = Date.now();
            // if (this.lockFlag) {
            // 	return
            // }
            // this.lockFlag = true
            this.fileType = this.getFileTypeFromGUI();
            let fileTypeRepresentation = (_a = this.fileType) === null || _a === void 0 ? void 0 : _a.getStringRepresentation();
            if (fileTypeRepresentation == null) {
                return;
            }
            // while (this.filesNumber == undefined) {
            // 	await this.delay(100);
            // }
            //@ts-ignore
            if ((fileIndex < 0) || (fileIndex > this.filesNumber - 1)) {
                return;
            }
            this.currentFileIndex = fileIndex;
            let data = undefined;
            let fileName = undefined;
            let fileDateTime = undefined;
            // console.log(`before ajax: ${Date.now() - _start} ms`);
            _start = Date.now();
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
                    data = response.data;
                    fileName = response.fileName;
                    fileDateTime = response.fileDateTime;
                },
                error: function (response) {
                    alert('Ошибка при попытке получить данные из файла.');
                    data = null;
                    fileName = null;
                    fileDateTime = null;
                },
            });
            // console.log(`ajax: ${Date.now() - start} ms`);
            if ((data == null)
                || (fileName == null)
                || (fileDateTime == null)) {
                return;
            }
            this.datetimeInput.value = fileDateTime;
            if (this.denoiseCheckbox.checked) {
                start = Date.now();
                data = this.denoise(data);
                // console.log(`denoise: ${Date.now() - start} ms`);
            }
            start = Date.now();
            this.parseGeoinformationDataUnits(data);
            // console.log(`parseGeoinformationDataUnits(data): ${Date.now() - start} ms`);
            start = Date.now();
            this.prepareToDrawSmoothMargin();
            // console.log(`prepareToDrawSmoothMargin(): ${Date.now() - start} ms`);
            start = Date.now();
            this.getTerminatorVerticesCoordinates();
            // console.log(`getTerminatorVerticesCoordinates(): ${Date.now() - start} ms`);
            start = Date.now();
            this.getContinentsVerticesCoordinates();
            // console.log(`getContinentsVerticesCoordinates(): ${Date.now() - start} ms`);
            start = Date.now();
            this.processCloudiness2();
            this.getContinentsVerticesCoordinates();
            // console.log(`processCloudiness(): ${Date.now() - start} ms`);
            start = Date.now();
            this.view.showRebuild(this.geoinformationDataUnits, this.marginLevel, this.middleMarginSegments, this.terminatorVertices, this.cloudinessImageSrc, this.cloudinessMltRotationAngle, this.continentsVertices, this.getCities(), this.getTotalMltRotationAngle(), null);
            this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString();
            this.fileNumberRangeInput.value = this.currentFileIndex.toString();
            this.fileNameInput.value = fileName;
            // console.log(`show: ${Date.now() - start} ms`);
            // this.getTerminatorVerticesCoordinates()
            // this.recoverFileIndexAndFileType()
            // console.log(`after ajax: ${Date.now() - _start} ms`)
        };
        /**
         * Переходим к файлу, дата и время которого являются
         * ближайшими к выбранным.
         * @returns
         */
        this.gotoFileByDatetime = () => {
            // if (this.lockFlag) {
            // 	return
            // }
            var _a;
            // this.lockFlag = true
            this.fileType = this.getFileTypeFromGUI();
            let fileTypeRepresentation = (_a = this.fileType) === null || _a === void 0 ? void 0 : _a.getStringRepresentation();
            if (fileTypeRepresentation == null) {
                return;
            }
            // while (this.filesNumber == undefined) {
            // 	await this.delay(100);
            // }
            let inputFileDateTime = this.datetimeInput.value;
            let data = undefined;
            let fileName = undefined;
            let fileIndex = undefined;
            let resultFileDateTime = undefined;
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
                    data = response.data;
                    fileName = response.fileName;
                    fileIndex = response.fileIndex;
                    resultFileDateTime = response.fileDateTime;
                },
                error: function (response) {
                    alert('Ошибка при попытке получить файл по дате и времени.');
                    data = null;
                    fileName = null;
                    fileIndex = null;
                    resultFileDateTime = null;
                },
            });
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
                return;
            }
            this.currentFileIndex = parseInt(fileIndex);
            this.datetimeInput.value = resultFileDateTime;
            if (this.denoiseCheckbox.checked) {
                data = this.denoise(data);
            }
            this.parseGeoinformationDataUnits(data);
            this.prepareToDrawSmoothMargin();
            this.getTerminatorVerticesCoordinates();
            this.getContinentsVerticesCoordinates();
            this.processCloudiness2();
            this.getContinentsVerticesCoordinates();
            this.view.showRebuild(this.geoinformationDataUnits, this.marginLevel, this.middleMarginSegments, this.terminatorVertices, this.cloudinessImageSrc, this.cloudinessMltRotationAngle, this.continentsVertices, this.getCities(), this.getTotalMltRotationAngle(), null);
            this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString();
            this.fileNumberRangeInput.value = this.currentFileIndex.toString();
            this.fileNameInput.value = fileName;
            // this.recoverFileIndexAndFileType()
        };
        this.getTerminatorVerticesCoordinates = () => {
            if (!this.showDayNightCheckBox.checked) {
                return;
            }
            //@ts-ignore
            let latlngsArray = L.terminator({ time: this.datetimeInput.value + ":00Z" })._latlngs;
            // let latlngsArray = L.terminator({ time: this.datetimeInput.value })._latlngs
            let data = undefined;
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
                    data = response.magneticCoordinates;
                },
                error: function (response) {
                    alert('Ошибка при попытке получить коордианты вершин терминатора.');
                },
            });
            if (data != undefined) {
                this.parseTerminatorVertices(data);
            }
        };
        this.getContinentsVerticesCoordinates = () => {
            if (!this.continentsCheckbox.checked) {
                return;
            }
            let data = undefined;
            let rotationAngle = 0;
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
                    data = response.magneticCoordinates;
                    rotationAngle = parseFloat(response.rotationAngle);
                },
                error: function (response) {
                    alert('Ошибка при попытке получить данные о континентах.');
                },
            });
            if (data != undefined) {
                this.parseContinentsVertices(data, rotationAngle);
            }
        };
        this.view = view;
        this.currentFileNumberInput = currentFileNumberInput;
        this.filesNumberInput = filesNumberInput;
        this.fileNameInput = fileNameInput;
        this.datetimeInput = datetimeInput;
        this.northRadio = northRadio;
        this.southRadio = southRadio;
        this.forecastRadio = forecastRadio;
        this.nowcastRadio = nowcastRadio;
        this.secondForecastRadio = secondForecastRadio;
        this.diffuseRadio = diffuseRadio;
        this.ionsRadio = ionsRadio;
        this.monoRadio = monoRadio;
        this.waveRadio = waveRadio;
        this.totalRadio = totalRadio;
        this.showDayNightCheckBox = showDayNightCheckBox;
        this.cloudinessCheckBox = cloudinessCheckBox;
        this.denoiseCheckbox = denoiseCheckbox;
        this.continentsCheckbox = continentsCheckbox;
        this.fileNumberRangeInput = fileNumberRangeInput;
        this.citiesCheckbox = citiesCheckbox;
        this.extendedFunctionality1Checkbox = extendedFunctionality1Checkbox;
    }
    parseCloudinessCellsGeomagneticCoordinates(cloudinessCellsGeomagneticCoordinatesData) {
        if (cloudinessCellsGeomagneticCoordinatesData.length == 0) {
            this.cloudinessCellsGeomagneticCoordinates = null;
            return;
        }
        this.cloudinessCellsGeomagneticCoordinates = [];
        let rows = cloudinessCellsGeomagneticCoordinatesData.split('\n').filter(element => element);
        for (let i = 0; i < rows.length; ++i) {
            let splitRow = rows[i].split(" ").filter(element => element);
            let newRow = [];
            for (let j = 0; j < splitRow.length; ++j) {
                let geomagneticCoordinates = splitRow[j].split("#");
                let geomagneticLatitude = Math.abs(parseFloat(geomagneticCoordinates[0]));
                let mlt = parseFloat(geomagneticCoordinates[1]);
                newRow.push([geomagneticLatitude, mlt]);
            }
            this.cloudinessCellsGeomagneticCoordinates.push(newRow);
        }
    }
    parseCloudinessCellsValues(cloudinessCellsValuesData) {
        if (cloudinessCellsValuesData.length == 0) {
            this.cloudinessCellsValues = null;
            return;
        }
        this.cloudinessCellsValues = [];
        let rows = cloudinessCellsValuesData.split('\n').filter(element => element);
        for (let i = 0; i < rows.length; ++i) {
            let splitRow = rows[i].split(" ").filter(element => element);
            let newRow = [];
            for (let j = 0; j < splitRow.length; ++j) {
                let cloudinessCellValue = parseFloat(splitRow[j]);
                newRow.push(cloudinessCellValue);
            }
            this.cloudinessCellsValues.push(newRow);
        }
    }
    getCurrentFileIndex() {
        return this.currentFileIndex;
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
    getFileTypeFromGUI() {
        let horizonSideType = this.getHorizonSideTypeFromGUI();
        let castType = this.getCastTypeFromGUI();
        let radiationType = this.getRadiationTypeFromGUI();
        if ((horizonSideType == null) || (castType == null) || (radiationType == null)) {
            return null;
        }
        return new FileType(horizonSideType, castType, radiationType);
    }
    /**
     * Получаем перечисление с типом полусферы
     * от элементов GUI.
     * @returns перечисленрие с типом полусферы,
     *          который задает GUI.
     */
    getHorizonSideTypeFromGUI() {
        if (this.northRadio.checked) {
            return HorizonSideType.NORTH;
        }
        else if (this.southRadio.checked) {
            return HorizonSideType.SOUTH;
        }
        else {
            return null;
        }
    }
    /**
     * Получаем тип прогноза / наблюдаемого значения от GUI.
     * @returns перечисление с типом прогноза / наблюдаемого значения,
     *          который задает GUI.
     */
    getCastTypeFromGUI() {
        if (this.forecastRadio.checked) {
            return CastType.FORECAST;
        }
        else if (this.nowcastRadio.checked) {
            return CastType.NOWCAST;
        }
        else if (this.secondForecastRadio.checked) {
            return CastType.SECOND_FORECAST;
        }
        else {
            return null;
        }
    }
    /**
     * Получаем тип излучения от элементов GUI.
     * @returns перечисление с типом излучения,
     *          который задает GUI.
     */
    getRadiationTypeFromGUI() {
        if (this.diffuseRadio.checked) {
            return RadiationType.DIFFUSE;
        }
        else if (this.ionsRadio.checked) {
            return RadiationType.IONS;
        }
        else if (this.monoRadio.checked) {
            return RadiationType.MONO;
        }
        else if (this.waveRadio.checked) {
            return RadiationType.WAVE;
        }
        else if (this.totalRadio.checked) {
            return RadiationType.TOTAL;
        }
        else {
            return null;
        }
    }
    /**
     * Получаем единицы геониформационных данных по
     * их строковым представлениям.
     * @param data строковое представление единиц геоинформационных данных.
     */
    parseGeoinformationDataUnits(data) {
        this.geoinformationDataUnits = {};
        let split_data = data.split('\n');
        for (let i = 0; i < split_data.length; ++i) {
            let geoinformationDataUnit = GeoinformationDataUnit.parse(split_data[i]);
            this.geoinformationDataUnits[geoinformationDataUnit.getCoordinatesRepresentation()]
                = geoinformationDataUnit;
        }
    }
    parseTerminatorVertices(data) {
        this.terminatorVertices = [];
        let splitData = data.split('@').filter(element => element);
        for (let i = 0; i < splitData.length; ++i) {
            this.terminatorVertices.push([]);
            let splitSplitData = splitData[i].split('\n').filter(element => element);
            for (let j = 0; j < splitSplitData.length; ++j) {
                let splitRow = splitSplitData[j].split(' ');
                let polarDistance = parseFloat(splitRow[0]);
                let polarAngle = parseFloat(splitRow[1]);
                this.terminatorVertices[this.terminatorVertices.length - 1]
                    .push(new PointPolar(polarDistance, polarAngle));
            }
        }
    }
    parseContinentsVertices(data, rotatinAngle) {
        this.continentsVertices = [];
        let splitData = data.split('@').filter(element => element);
        for (let i = 0; i < splitData.length; ++i) {
            this.continentsVertices.push([]);
            let splitSplitData = splitData[i].split('\n').filter(element => element);
            for (let j = 0; j < splitSplitData.length; ++j) {
                let splitRow = splitSplitData[j].split(' ');
                let polarDistance = parseFloat(splitRow[0]);
                let polarAngle = parseFloat(splitRow[1]);
                polarAngle += rotatinAngle;
                if (polarAngle >= 24) {
                    polarAngle -= 24;
                }
                if (polarAngle < 0) {
                    polarAngle += 24;
                }
                this.continentsVertices[this.continentsVertices.length - 1]
                    .push(new PointPolar(polarDistance, polarAngle));
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
    processCloudiness2() {
        var _a;
        if (!this.cloudinessCheckBox.checked) {
            return;
        }
        // alert('processCloudiness2')
        let dateTime = this.datetimeInput.value;
        let horizonSide = (((_a = this.getFileTypeFromGUI()) === null || _a === void 0 ? void 0 : _a.horizonSideType) == HorizonSideType.NORTH)
            ? 'north' : 'south';
        let cloudinessBase64 = "";
        let cloudinessMltRotationAngle = 0;
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
                let textEncoder = new TextEncoder();
                let textDecoder = new TextDecoder();
                cloudinessBase64 = textDecoder.decode(textEncoder.encode(response.cloudinessBase64));
                cloudinessMltRotationAngle = parseFloat(response.cloudinessMltRotationAngle);
            },
            error: function (response) {
                alert('Ошибка при попытке получить данные об облачности.');
            },
        });
        if (cloudinessBase64 == "") {
            this.cloudinessImageSrc = null;
            this.cloudinessMltRotationAngle = 0;
        }
        else {
            this.cloudinessImageSrc = "data:image/png;base64," + cloudinessBase64;
            this.cloudinessMltRotationAngle = cloudinessMltRotationAngle;
        }
    }
    /**
     * Переходим к предыдущему файлу.
     * @returns
     */
    gotoPreviousFile() {
        if (this.filesNumber == undefined) {
            return;
        }
        else if (this.currentFileIndex < 1) {
            return;
        }
        this.gotoCertainFile(this.currentFileIndex - 1);
    }
    /**
     * Переходим к следующему файлу.
     * @returns
     */
    gotoNextFile() {
        if (this.filesNumber == undefined) {
            return;
        }
        else if (this.currentFileIndex >= this.filesNumber - 1) {
            return;
        }
        // alert("here")
        // console.log(typeof this.currentFileIndex)
        // console.log(this.currentFileIndex)
        // console.log(this.currentFileIndex + 1)
        this.gotoCertainFile(this.currentFileIndex + 1);
    }
    /**
     * Получаем количество файлов выбранного типа.
     * @returns упомянутое количество файлов.
     */
    getFilesNumber() {
        return this.filesNumber;
    }
    /**
     * Выполняем подготовку к рисованию сглаженной границы.
     */
    prepareToDrawSmoothMargin() {
        this.findMarginSegments();
        this.connectMarginSegments();
        this.findMiddleMarginSegments();
        this.connectMiddleMarginSegments();
    }
    /**
     * Находим ребра границы.
     */
    findMarginSegments() {
        this.marginSegments = [];
        this.findRadialMarginSegments();
        this.findRoundMarginSegments();
    }
    /**
     * Находим ребра границы, которые лежат на радиальных линиях
     * координатной решетки.
     * @returns
     */
    findRadialMarginSegments() {
        if (Object.keys(this.geoinformationDataUnits).length == 0) {
            return;
        }
        for (let polarAngle = 0; polarAngle <= 23.75; polarAngle += 0.25) {
            for (let polarDistance = 50.5; polarDistance <= 89.5; polarDistance += 0.5) {
                let first = this.geoinformationDataUnits[polarAngle.toString() + ' ' + polarDistance.toString()];
                if (first == undefined) {
                    continue;
                }
                let nextPolarAngle = polarAngle - 0.25;
                if (nextPolarAngle < 0) {
                    nextPolarAngle = 23.75;
                }
                let second = this.geoinformationDataUnits[nextPolarAngle.toString() + ' ' + polarDistance.toString()];
                if (second == undefined) {
                    continue;
                }
                if (this.view.marginIsLocated(first.getValue(), second.getValue(), this.marginLevel)) {
                    let firstPoint = first.getFirstPoint(this.view.visualizationDisplay.getWidth());
                    let fourthPoint = first.getFourhtPoint(this.view.visualizationDisplay.getWidth());
                    this.marginSegments.push(new Segment(firstPoint, fourthPoint, SegmentOrientation.RADIAL));
                }
            }
        }
    }
    /**
     * Находим ребра границы, которые приближенно лежат на круговых
     * линиях границы.
     * @returns
     */
    findRoundMarginSegments() {
        if (Object.keys(this.geoinformationDataUnits).length == 0) {
            return;
        }
        for (let polarAngle = 0; polarAngle <= 23.75; polarAngle += 0.25) {
            for (let polarDistance = 50.5; polarDistance <= 89.5; polarDistance += 0.5) {
                let first = this.geoinformationDataUnits[polarAngle.toString() + ' ' + polarDistance.toString()];
                if (first == undefined) {
                    continue;
                }
                let nextPolarDistance = polarDistance - 0.5;
                let second = this.geoinformationDataUnits[polarAngle.toString() + ' ' + nextPolarDistance.toString()];
                if (second == undefined) {
                    continue;
                }
                if (this.view.marginIsLocated(first.getValue(), second.getValue(), this.marginLevel)) {
                    let firstPoint = first.getFirstPoint(this.view.visualizationDisplay.getWidth());
                    let secondPoint = first.getSecondPoint(this.view.visualizationDisplay.getWidth());
                    this.marginSegments.push(new Segment(firstPoint, secondPoint, SegmentOrientation.ROUND));
                }
            }
        }
    }
    /**
     * Связываем соседние отрезки.
     * @param segments список упомянутых отрезков.
     */
    connectSegments(segments) {
        for (let i = 0; i < segments.length; ++i) {
            for (let j = 0; j < segments.length; ++j) {
                if (i == j) {
                    continue;
                }
                if (segments[i].isNewNeighbour(segments[j])) {
                    segments[i].connectAsNeighbour(segments[j]);
                }
                if (segments[i].hasBothNeighbours()) {
                    break;
                }
            }
        }
    }
    /**
     * Связываем ребра границы.
     */
    connectMarginSegments() {
        for (let i = 0; i < this.marginSegments.length; ++i) {
            for (let j = 0; j < this.marginSegments.length; ++j) {
                if (i == j) {
                    continue;
                }
                if (this.marginSegments[i].isFirstNeighbour(this.marginSegments[j])) {
                    this.marginSegments[i].firstEndNeighbours.push(this.marginSegments[j]);
                }
                if (this.marginSegments[i].isSecondNeighbour(this.marginSegments[j])) {
                    this.marginSegments[i].secondEndNeighbours.push(this.marginSegments[j]);
                }
            }
        }
        for (let i = 0; i < this.marginSegments.length; ++i) {
            this.marginSegments[i].connectWithFirstTrueNeighbour();
            this.marginSegments[i].connectWithSecondTrueNeighbour();
        }
    }
    /**
     * Находим отрезки, которые соединяют середины соседних
     * ребер границы.
     */
    findMiddleMarginSegments() {
        this.middleMarginSegments = [];
        for (let i = 0; i < this.marginSegments.length; ++i) {
            let marginSegment = this.marginSegments[i];
            if (marginSegment.getFirstNeighbour() != null) {
                this.middleMarginSegments.push(new Segment(marginSegment.getMiddle(), marginSegment.getFirstNeighbour().getMiddle(), null));
            }
            if (marginSegment.getSecondNeighbour() != null) {
                this.middleMarginSegments.push(new Segment(marginSegment.getMiddle(), marginSegment.getSecondNeighbour().getMiddle(), null));
            }
        }
    }
    /**
     * Связываем соседние отрезки, которые соединяют середины
     * соседних ребер границы.
     */
    connectMiddleMarginSegments() {
        this.connectSegments(this.middleMarginSegments);
    }
    convertLatLngsArrayToString(latlngsArray) {
        let result = "";
        //@ts-ignore
        for (let i = 0; i < latlngsArray[0].length; ++i) {
            //@ts-ignore
            let lat = latlngsArray[0][i].lat;
            //@ts-ignore
            let lng = latlngsArray[0][i].lng;
            //@ts-ignore
            result += lat + " " + lng + "\n";
        }
        return result;
    }
    getCookie(name) {
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
    denoise(data) {
        // console.log('here')
        // console.log(data)
        let outputData = "";
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
                outputData = response.data;
            },
            error: function (response) {
                alert('Ошибка при попытке фильровать шум.');
            },
        });
        return outputData;
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
    parsePointPolarArray(description) {
        let namedPointPolarArray = [];
        let splitDescription = description.split('\n').filter(element => element);
        for (let i = 0; i < splitDescription.length; ++i) {
            let currentLine = splitDescription[i];
            let splitCurrentLine = currentLine.split(' ').filter(element => element);
            let namedPointPolar = new NamedPointPolar(splitCurrentLine[0], parseFloat(splitCurrentLine[1]), parseFloat(splitCurrentLine[2]));
            namedPointPolarArray.push(namedPointPolar);
        }
        return namedPointPolarArray;
    }
    getCities() {
        if (!this.citiesCheckbox.checked) {
            return null;
        }
        let citiesDescription = '';
        let cities = [];
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
                citiesDescription = response.citiesDescription;
            },
            error: function (response) {
                alert('Ошибка при попытке получить данные о городах.');
            },
        });
        cities = this.parsePointPolarArray(citiesDescription);
        // console.log(cities)
        return cities;
    }
    parseExtendedFunctionalityClass1Array(description) {
        let extendedFunctionalityClass1Array = [];
        let splitDescription = description.split('\n').filter(element => element);
        for (let i = 0; i < splitDescription.length; ++i) {
            extendedFunctionalityClass1Array
                .push(ExtendedFunctionalityClass1.parse(splitDescription[i]));
        }
        return extendedFunctionalityClass1Array;
    }
    getExtendedFunctionality1Info() {
        if (!this.extendedFunctionality1Checkbox.checked) {
            return null;
        }
        let description = '';
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
                description = response.description;
            },
            error: function (response) {
                alert('Ошибка при попытке получить данные расширенного функционала первого типа.');
            },
        });
        return this.parseExtendedFunctionalityClass1Array(description);
    }
    getSecondForecast() {
        let filesNumber = undefined;
        let data = undefined;
        let fileName = undefined;
        let fileDateTime = undefined;
        $.ajax({
            url: 'second-forecast',
            method: 'get',
            dataType: 'json',
            async: false,
            data: {},
            success: function (response) {
                filesNumber = parseInt(response.filesNumber);
                data = response.data;
                fileName = response.fileName;
                fileDateTime = response.fileDateTime;
            },
            error: function (response) {
                alert('Ошибка при попытке получить прогноз.');
            },
        });
        if ((filesNumber == null)
            || (data == null)
            || (fileName == null)
            || (fileDateTime == null)) {
            return;
        }
        this.parseGeoinformationDataUnits(data);
        this.prepareToDrawSmoothMargin();
        this.getTerminatorVerticesCoordinates();
        this.getContinentsVerticesCoordinates();
        this.processCloudiness2();
        this.getContinentsVerticesCoordinates();
        this.filesNumber = filesNumber;
        this.currentFileIndex = filesNumber - 1;
        //@ts-ignore
        this.filesNumberInput.value = this.filesNumber.toString();
        this.view.showRebuild(this.geoinformationDataUnits, this.marginLevel, this.middleMarginSegments, this.terminatorVertices, this.cloudinessImageSrc, this.cloudinessMltRotationAngle, this.continentsVertices, this.getCities(), this.getTotalMltRotationAngle(), null);
        this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString();
        this.fileNumberRangeInput.value = this.currentFileIndex.toString();
        this.fileNameInput.value = fileName;
        this.datetimeInput.value = fileDateTime;
    }
    getTotalMltRotationAngle() {
        let dateTime = this.datetimeInput.value;
        let horizonSide = (this.getFileTypeFromGUI().horizonSideType == HorizonSideType.NORTH)
            ? 'north' : 'south';
        let totalMltRotationAngle = 0;
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
                totalMltRotationAngle = parseFloat(response.mltRotationAngle);
            },
            error: function (response) {
                alert('Ошибка при попытке получить общий угол поворота аврорального овала.');
            },
        });
        return totalMltRotationAngle;
    }
}
