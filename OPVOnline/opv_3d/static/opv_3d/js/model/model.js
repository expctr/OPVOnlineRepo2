"use strict";
class Model {
    constructor(view) {
        this.flag = false;
        this.northRadio = document.getElementById('north-radio');
        this.southRadio = document.getElementById('south-radio');
        this.forecastRadio = document.getElementById('forecast-radio');
        this.nowcastRadio = document.getElementById('nowcast-radio');
        this.secondForecastRadio = document.getElementById('second-forecast-radio');
        this.diffuseRadio = document.getElementById('diffuse-radio');
        this.ionsRadio = document.getElementById('ions-radio');
        this.monoRadio = document.getElementById('mono-radio');
        this.waveRadio = document.getElementById('wave-radio');
        this.totalRadio = document.getElementById('total-radio');
        this.datetimeInput = document.getElementById('datetime-input');
        this.currentFileNumberInput = document.getElementById('current-file-number-input');
        this.fileNameInput = document.getElementById('file-name-input');
        this.filesNumberInput = document.getElementById('files-number-input');
        this.denoiseCheckbox = document.getElementById('denoise-checkbox');
        this.ovationPrimeData3DUnits = [];
        this.fileType = undefined;
        this.filesNumber = 0;
        this.currentFileIndex = 0;
        this.fileNumberRangeInput = document.getElementById('file-number-range-input');
        this.marginLevel = 1;
        this.marginSegments = [];
        /**
         * Список отрезков, которые соединяют середины соседних отрезков границы.
         */
        this.middleMarginSegments = [];
        this.smoothMarginCheckbox = document.getElementById('smooth-margin-checkbox');
        this.getFilesNumberAndLastFileData = () => {
            var _a;
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
                url: '3d/last-file-data',
                method: 'get',
                dataType: 'json',
                async: false,
                data: { filesType: fileTypeRepresentation },
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
            if ((filesNumber == null)
                || (data == null)
                || (fileName == null)
                || (fileDateTime == null)) {
                return;
            }
            this.filesNumber = filesNumber;
            this.currentFileIndex = filesNumber - 1;
            // console.log(this.filesNumber)
            // @ts-ignore
            this.filesNumberInput.value = this.filesNumber.toString();
            this.fileNumberRangeInput.min = '0';
            this.fileNumberRangeInput.max = (this.filesNumber - 1).toString();
            this.fileNumberRangeInput.step = '1';
            this.fileNumberRangeInput.value = this.currentFileIndex.toString();
            this.datetimeInput.value = fileDateTime;
            // //@ts-ignore
            // let split_data = data.split('\n')
            // for (let i = 0; i < split_data.length; ++i) {
            //     console.log(split_data[i])
            // }
            if (this.denoiseCheckbox.checked) {
                data = this.denoise(data);
            }
            // this.parseGeoinformationDataUnits(data)
            // this.prepareToDrawSmoothMargin()
            // this.getTerminatorVerticesCoordinates()
            // this.getContinentsVerticesCoordinates()
            // this.processCloudiness()
            this.parseOvationPrimeData3DUnits(data);
            // this.view.show(
            //     this.geoinformationDataUnits,
            //     this.marginLevel,
            //     this.middleMarginSegments,
            //     this.terminatorVertices,
            //     this.cloudinessCellsGeomagneticCoordinates,
            //     this.cloudinessCellsValues,
            //     this.getMLTRotationAngle(),
            //     this.continentsVertices,
            //     this.getCities(),
            //     this.getExtendedFunctionality1Info())
            this.prepareToDrawSmoothMargin();
            this.view.show(this.ovationPrimeData3DUnits, this.marginLevel, this.middleMarginSegments);
            this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString();
            this.fileNumberRangeInput.value = this.currentFileIndex.toString();
            this.fileNameInput.value = fileName;
            // this.recoverFileIndexAndFileType()
        };
        this.gotoCertainFile = (fileIndex) => {
            var _a;
            this.fileType = this.getFileTypeFromGUI();
            let fileTypeRepresentation = (_a = this.fileType) === null || _a === void 0 ? void 0 : _a.getStringRepresentation();
            if (fileTypeRepresentation == null) {
                return;
            }
            //@ts-ignore
            if ((fileIndex < 0) || (fileIndex > this.filesNumber - 1)) {
                return;
            }
            this.currentFileIndex = fileIndex;
            let data = undefined;
            let fileName = undefined;
            let fileDateTime = undefined;
            $.ajax({
                url: '3d/certain-file-data',
                method: 'get',
                dataType: 'json',
                async: false,
                data: {
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
            if ((data == null)
                || (fileName == null)
                || (fileDateTime == null)) {
                return;
            }
            this.datetimeInput.value = fileDateTime;
            if (this.denoiseCheckbox.checked) {
                data = this.denoise(data);
            }
            // this.parseGeoinformationDataUnits(data)
            this.parseOvationPrimeData3DUnits(data);
            // this.prepareToDrawSmoothMargin()
            // this.getTerminatorVerticesCoordinates()
            // this.getContinentsVerticesCoordinates()
            // this.processCloudiness()
            // this.view.show(
            //     this.geoinformationDataUnits,
            //     this.marginLevel,
            //     this.middleMarginSegments,
            //     this.terminatorVertices,
            //     this.cloudinessCellsGeomagneticCoordinates,
            //     this.cloudinessCellsValues,
            //     this.getMLTRotationAngle(),
            //     this.continentsVertices,
            //     this.getCities(),
            //     this.getExtendedFunctionality1Info())
            this.prepareToDrawSmoothMargin();
            this.view.show(this.ovationPrimeData3DUnits, this.marginLevel, this.middleMarginSegments);
            this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString();
            this.fileNumberRangeInput.value = this.currentFileIndex.toString();
            this.fileNameInput.value = fileName;
        };
        this.getFilesNumberAndFileDataByDateTime = () => {
            var _a;
            let filesNumber = undefined;
            let data = undefined;
            let fileName = undefined;
            let fileIndex = undefined;
            let inputFileDateTime = this.datetimeInput.value;
            let resultFileDateTime = undefined;
            this.fileType = this.getFileTypeFromGUI();
            let fileTypeRepresentation = (_a = this.fileType) === null || _a === void 0 ? void 0 : _a.getStringRepresentation();
            $.ajax({
                url: '3d/files-number-and-file-data-by-datetime',
                method: 'get',
                dataType: 'json',
                async: false,
                data: {
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
            // this.parseGeoinformationDataUnits(data)
            // this.prepareToDrawSmoothMargin()
            // this.getTerminatorVerticesCoordinates()
            // this.getContinentsVerticesCoordinates()
            this.parseOvationPrimeData3DUnits(data);
            // this.processCloudiness()
            // this.view.show(
            //     this.geoinformationDataUnits,
            //     this.marginLevel,
            //     this.middleMarginSegments,
            //     this.terminatorVertices,
            //     this.cloudinessCellsGeomagneticCoordinates,
            //     this.cloudinessCellsValues,
            //     this.getMLTRotationAngle(),
            //     this.continentsVertices,
            //     this.getCities(),
            //     this.getExtendedFunctionality1Info())
            this.prepareToDrawSmoothMargin();
            this.view.show(this.ovationPrimeData3DUnits, this.marginLevel, this.middleMarginSegments);
            this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString();
            this.fileNameInput.value = fileName;
            this.currentFileNumberInput.value = (parseInt(fileIndex) + 1).toString();
        };
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
                url: '3d/file-data-by-datetime',
                method: 'get',
                dataType: 'json',
                async: false,
                data: {
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
            // this.parseGeoinformationDataUnits(data)
            // this.prepareToDrawSmoothMargin()
            // this.getTerminatorVerticesCoordinates()
            // this.getContinentsVerticesCoordinates()
            this.parseOvationPrimeData3DUnits(data);
            // this.processCloudiness()
            // this.view.show(
            //     this.geoinformationDataUnits,
            //     this.marginLevel,
            //     this.middleMarginSegments,
            //     this.terminatorVertices,
            //     this.cloudinessCellsGeomagneticCoordinates,
            //     this.cloudinessCellsValues,
            //     this.getMLTRotationAngle(),
            //     this.continentsVertices,
            //     this.getCities(),
            //     this.getExtendedFunctionality1Info())
            this.prepareToDrawSmoothMargin();
            this.view.show(this.ovationPrimeData3DUnits, this.marginLevel, this.middleMarginSegments);
            this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString();
            this.fileNumberRangeInput.value = this.currentFileIndex.toString();
            this.fileNameInput.value = fileName;
            // this.recoverFileIndexAndFileType()
        };
        this.view = view;
    }
    getCurrentFileIndex() {
        return this.currentFileIndex;
    }
    getCertainFileData() {
        var _a;
        let description = undefined;
        this.fileType = this.getFileTypeFromGUI();
        let fileTypeRepresentation = (_a = this.fileType) === null || _a === void 0 ? void 0 : _a.getStringRepresentation();
        if (fileTypeRepresentation == null) {
            return;
        }
        $.ajax({
            url: '3d/certain-file-data',
            method: 'get',
            dataType: 'json',
            async: false,
            data: { filesType: fileTypeRepresentation },
            success: function (response) {
                description = response.unitsDescription;
            },
            error: function (response) {
                alert('Ошибка при попытке получить данные определенного файла.');
            },
        });
        if (description) {
            this.parseOvationPrimeData3DUnits(description);
        }
        this.prepareToDrawSmoothMargin();
        this.view.show(this.ovationPrimeData3DUnits, this.marginLevel, this.middleMarginSegments);
    }
    getCoordinatesKey(mlt, magneticLat) {
        return mlt.toString() + "#" + magneticLat.toString();
    }
    increaseMlt(mlt) {
        let increasedMlt = mlt + 0.25;
        if (increasedMlt >= 24.0) {
            increasedMlt -= 24.0;
        }
        return increasedMlt;
    }
    parseOvationPrimeData3DUnits(description) {
        // this.ovationPrimeData3DUnits = []
        // let splitDescription = description.split('\n').filter(element => element)
        // for (let i = 0; i < splitDescription.length; ++i) {
        //     this.ovationPrimeData3DUnits.push(
        //         OvationPrimeData3DUnit.parse(splitDescription[i])
        //     )
        // }
        this.ovationPrimeData3DUnits = [];
        let geomagneticCoordinatesAndGeographicCoordinatesWithValues = {};
        let splitDescription = description.split('\n').filter(element => element);
        for (let i = 0; i < splitDescription.length; ++i) {
            let splitRow = splitDescription[i].split(" ").filter(element => element);
            let mlt = parseFloat(splitRow[0]);
            let magneticLat = parseFloat(splitRow[1]);
            let value = parseFloat(splitRow[2]);
            let geographicLat = parseFloat(splitRow[3]);
            let geographicLon = parseFloat(splitRow[4]);
            geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(mlt, magneticLat)]
                = [geographicLat, geographicLon, value];
        }
        for (let mlt = 0.0; mlt <= 23.75; mlt += 0.25) {
            for (let magneticLat = 50.0; magneticLat <= 89.0; magneticLat += 0.5) {
                let firstPointLat = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(mlt, magneticLat)][0];
                let firstPointLon = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(mlt, magneticLat)][1];
                let secondPointLat = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(this.increaseMlt(mlt), magneticLat)][0];
                let secondPointLon = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(this.increaseMlt(mlt), magneticLat)][1];
                let thirdPointLat = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(this.increaseMlt(mlt), magneticLat + 0.5)][0];
                let thirdPointLon = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(this.increaseMlt(mlt), magneticLat + 0.5)][1];
                let fourthPointLat = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(mlt, magneticLat + 0.5)][0];
                let fourthPointLon = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(mlt, magneticLat + 0.5)][1];
                let height = 95;
                let value = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(mlt, magneticLat)][2];
                let firstPointMlt = mlt;
                let firstPointMagneticLat = magneticLat;
                this.ovationPrimeData3DUnits.push(new OvationPrimeData3DUnit(firstPointLat, firstPointLon, secondPointLat, secondPointLon, thirdPointLat, thirdPointLon, fourthPointLat, fourthPointLon, height, value, firstPointMlt, firstPointMagneticLat));
            }
        }
    }
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
    getFilesNumber() {
        return this.filesNumber;
    }
    /**
 * Выполняем подготовку к рисованию сглаженной границы.
 */
    prepareToDrawSmoothMargin() {
        if (!this.smoothMarginCheckbox.checked) {
            return;
        }
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
        let dict = this.view.convertOvationPrimeData3DUnits(this.ovationPrimeData3DUnits);
        if (Object.keys(dict).length == 0) {
            return;
        }
        for (let polarAngle = 0; polarAngle <= 23.75; polarAngle += 0.25) {
            for (let polarDistance = 50.5; polarDistance <= 89.5; polarDistance += 0.5) {
                let first = dict[polarAngle.toString() + ' ' + polarDistance.toString()];
                if (first == undefined) {
                    continue;
                }
                let nextPolarAngle = polarAngle - 0.25;
                if (nextPolarAngle < 0) {
                    nextPolarAngle = 23.75;
                }
                let second = dict[nextPolarAngle.toString() + ' ' + polarDistance.toString()];
                if (second == undefined) {
                    continue;
                }
                if (this.view.marginIsLocated(first.getValue(), second.getValue(), this.marginLevel)) {
                    let firstPoint = first.getFirstPoint();
                    let fourthPoint = first.getFourthPoint();
                    this.marginSegments.push(new SegmentOnSphere(firstPoint, fourthPoint, SegmentOrientation.RADIAL));
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
        let dict = this.view.convertOvationPrimeData3DUnits(this.ovationPrimeData3DUnits);
        if (Object.keys(dict).length == 0) {
            return;
        }
        for (let polarAngle = 0; polarAngle <= 23.75; polarAngle += 0.25) {
            for (let polarDistance = 50.5; polarDistance <= 89.5; polarDistance += 0.5) {
                let first = dict[polarAngle.toString() + ' ' + polarDistance.toString()];
                if (first == undefined) {
                    continue;
                }
                let nextPolarDistance = polarDistance - 0.5;
                let second = dict[polarAngle.toString() + ' ' + nextPolarDistance.toString()];
                if (second == undefined) {
                    continue;
                }
                if (this.view.marginIsLocated(first.getValue(), second.getValue(), this.marginLevel)) {
                    let firstPoint = first.getFirstPoint();
                    let secondPoint = first.getSecondPoint();
                    this.marginSegments.push(new SegmentOnSphere(firstPoint, secondPoint, SegmentOrientation.ROUND));
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
                    if (Math.abs(this.marginSegments[i].getFirstEnd().lat
                        - this.marginSegments[j].getFirstEnd().lat) > 20) {
                        console.log('here:');
                        console.log(this.marginSegments[i]);
                        console.log(this.marginSegments[j]);
                    }
                }
                if (this.marginSegments[i].isSecondNeighbour(this.marginSegments[j])) {
                    this.marginSegments[i].secondEndNeighbours.push(this.marginSegments[j]);
                    if (Math.abs(this.marginSegments[i].getSecondEnd().lat
                        - this.marginSegments[j].getSecondEnd().lat) > 20) {
                        console.log('here:');
                        console.log(this.marginSegments[i]);
                        console.log(this.marginSegments[j]);
                    }
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
            if (this.marginSegments[i].getFirstNeighbour() != null) {
                let marginSegment = this.marginSegments[i];
                let newMiddleMarginSegment = new SegmentOnSphere(marginSegment.getMiddle(), marginSegment.getFirstNeighbour().getMiddle(), null);
                let firstNeighbour = marginSegment.getFirstNeighbour();
                let intersectionWithFirstNeighbour = marginSegment.getIntersectionWithFirstNeighbour();
                if (marginSegment.isBad()
                    || marginSegment.getFirstNeighbour().isBad()) {
                    if (marginSegment.isBad()) {
                        let buffer = marginSegment;
                        //@ts-ignore
                        marginSegment = firstNeighbour;
                        firstNeighbour = buffer;
                    }
                    this.middleMarginSegments.push(new SegmentOnSphere(marginSegment.getMiddle(), 
                    //@ts-ignore
                    intersectionWithFirstNeighbour, null));
                    this.middleMarginSegments.push(
                    //@ts-ignore
                    firstNeighbour);
                }
                else {
                    this.middleMarginSegments.push(newMiddleMarginSegment);
                }
            }
            if (this.marginSegments[i].getSecondNeighbour() != null) {
                let marginSegment = this.marginSegments[i];
                let newMiddleMarginSegment = new SegmentOnSphere(marginSegment.getMiddle(), marginSegment.getSecondNeighbour().getMiddle(), null);
                let secondNeighbour = marginSegment.getSecondNeighbour();
                let intersectionWithSecondNeighbour = marginSegment.getIntersectionWithSecondNeighbour();
                if (marginSegment.isBad() || (secondNeighbour === null || secondNeighbour === void 0 ? void 0 : secondNeighbour.isBad())) {
                    if (marginSegment.isBad()) {
                        let buffer = marginSegment;
                        //@ts-ignore
                        marginSegment = secondNeighbour;
                        secondNeighbour = buffer;
                    }
                    this.middleMarginSegments.push(new SegmentOnSphere(marginSegment.getMiddle(), 
                    //@ts-ignore
                    intersectionWithSecondNeighbour, null));
                    this.middleMarginSegments.push(
                    //@ts-ignore
                    secondNeighbour);
                }
                else {
                    this.middleMarginSegments.push(newMiddleMarginSegment);
                }
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
    denoise(data) {
        // console.log('here')
        // console.log(data)
        let outputData = "";
        $.ajax({
            url: '3d/denoise',
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
    getSecondForecast() {
        let filesNumber = undefined;
        let data = undefined;
        let fileName = undefined;
        let fileDateTime = undefined;
        $.ajax({
            url: '3d/second-forecast',
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
        console.log(data);
        if (data) {
            this.parseOvationPrimeData3DUnits(data);
        }
        this.prepareToDrawSmoothMargin();
        this.filesNumber = filesNumber;
        this.currentFileIndex = filesNumber - 1;
        //@ts-ignore
        this.filesNumberInput.value = this.filesNumber.toString();
        console.log(this.ovationPrimeData3DUnits);
        this.view.show(this.ovationPrimeData3DUnits, this.marginLevel, this.middleMarginSegments);
        this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString();
        this.fileNumberRangeInput.value = this.currentFileIndex.toString();
        this.fileNameInput.value = fileName;
        this.datetimeInput.value = fileDateTime;
    }
}
