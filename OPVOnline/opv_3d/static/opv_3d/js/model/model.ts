/*
 * В данном файле содержится реализация модели из паттерна MVC для управления страницей
 * 3D визуализации.
 */

class Model {
    private flag: boolean = false

    private view: View

    private northRadio = <HTMLInputElement>document.getElementById('north-radio')

    private southRadio = <HTMLInputElement>document.getElementById('south-radio')

    private forecastRadio = <HTMLInputElement>document.getElementById('forecast-radio')

    private nowcastRadio = <HTMLInputElement>document.getElementById('nowcast-radio')

    private secondForecastRadio = <HTMLInputElement>document.getElementById('second-forecast-radio')

    private diffuseRadio = <HTMLInputElement>document.getElementById('diffuse-radio')

    private ionsRadio = <HTMLInputElement>document.getElementById('ions-radio')

    private monoRadio = <HTMLInputElement>document.getElementById('mono-radio')

    private waveRadio = <HTMLInputElement>document.getElementById('wave-radio')

    private totalRadio = <HTMLInputElement>document.getElementById('total-radio')

    private datetimeInput = <HTMLInputElement>document.getElementById('datetime-input')

    private currentFileNumberInput = <HTMLInputElement>document.getElementById('current-file-number-input')

    private fileNameInput = <HTMLInputElement>document.getElementById('file-name-input')

    private filesNumberInput = <HTMLInputElement>document.getElementById('files-number-input')

    private denoiseCheckbox = <HTMLInputElement>document.getElementById('denoise-checkbox')

    public ovationPrimeData3DUnits: OvationPrimeData3DUnit[] = []

    private fileType: FileType | null | undefined = undefined

    private filesNumber: number | undefined = 0

    private currentFileIndex: number = 0

    private fileNumberRangeInput: HTMLInputElement
        = <HTMLInputElement>document.getElementById('file-number-range-input')

    public marginLevel: number = 1

    public marginSegments: SegmentOnSphere[] = []

    /**
     * Список отрезков, которые соединяют середины соседних отрезков границы.
     */
    public middleMarginSegments: SegmentOnSphere[] = []

    private readonly smoothMarginCheckbox
        = <HTMLInputElement>document.getElementById('smooth-margin-checkbox')

    public constructor(view: View) {
        this.view = view
    }

    public getCurrentFileIndex() {
        return this.currentFileIndex
    }

    public getCertainFileData(): void {
        let description: string | undefined = undefined

        this.fileType = this.getFileTypeFromGUI()
        let fileTypeRepresentation = this.fileType?.getStringRepresentation()

        if (fileTypeRepresentation == null) {
            return
        }

        $.ajax({
            url: '3d/certain-file-data',
            method: 'get',
            dataType: 'json',
            async: false,
            data: { filesType: fileTypeRepresentation },
            success: function (response) {
                description = response.unitsDescription
            },
            error: function (response) {
                alert('Ошибка при попытке получить данные определенного файла.')
            },
        })

        if (description) {
            this.parseOvationPrimeData3DUnits(description)
        }

        this.prepareToDrawSmoothMargin()

        this.view.show(
            this.ovationPrimeData3DUnits,
            this.marginLevel,
            this.middleMarginSegments)
    }

    public getFilesNumberAndLastFileData = () => { // async
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
            url: '3d/last-file-data',
            method: 'get',
            dataType: 'json',
            async: false,
            data: { filesType: fileTypeRepresentation },
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

        if ((filesNumber == null)
            || (data == null)
            || (fileName == null)
            || (fileDateTime == null)) {
            return
        }

        this.filesNumber = filesNumber
        this.currentFileIndex = filesNumber - 1

        // console.log(this.filesNumber)

        // @ts-ignore
        this.filesNumberInput.value = this.filesNumber.toString()
        this.fileNumberRangeInput.min = '0'
        this.fileNumberRangeInput.max = (this.filesNumber - 1).toString()
        this.fileNumberRangeInput.step = '1'
        this.fileNumberRangeInput.value = this.currentFileIndex.toString()
        this.datetimeInput.value = fileDateTime

        // //@ts-ignore
        // let split_data = data.split('\n')

        // for (let i = 0; i < split_data.length; ++i) {
        //     console.log(split_data[i])
        // }

        if (this.denoiseCheckbox.checked) {
            data = this.denoise(data)
        }

        // this.parseGeoinformationDataUnits(data)
        // this.prepareToDrawSmoothMargin()
        // this.getTerminatorVerticesCoordinates()
        // this.getContinentsVerticesCoordinates()

        // this.processCloudiness()
        this.parseOvationPrimeData3DUnits(data)

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
        this.prepareToDrawSmoothMargin()

        this.view.show(
            this.ovationPrimeData3DUnits,
            this.marginLevel,
            this.middleMarginSegments)

        this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString()
        this.fileNumberRangeInput.value = this.currentFileIndex.toString()
        this.fileNameInput.value = fileName

        // this.recoverFileIndexAndFileType()
    }

    private getCoordinatesKey(mlt: number, magneticLat: number) {
        return mlt.toString() + "#" + magneticLat.toString()
    }

    private increaseMlt(mlt: number): number {
        let increasedMlt = mlt + 0.25

        if (increasedMlt >= 24.0) {
            increasedMlt -= 24.0
        }

        return increasedMlt
    }

    private parseOvationPrimeData3DUnits(description: string) {
        // this.ovationPrimeData3DUnits = []

        // let splitDescription = description.split('\n').filter(element => element)

        // for (let i = 0; i < splitDescription.length; ++i) {
        //     this.ovationPrimeData3DUnits.push(
        //         OvationPrimeData3DUnit.parse(splitDescription[i])
        //     )
        // }
        this.ovationPrimeData3DUnits = []

        let geomagneticCoordinatesAndGeographicCoordinatesWithValues:
            { [key: string]: [number, number, number] } = {}
        let splitDescription = description.split('\n').filter(element => element)

        for (let i = 0; i < splitDescription.length; ++i) {
            let splitRow = splitDescription[i].split(" ").filter(element => element)
            let mlt = parseFloat(splitRow[0])
            let magneticLat = parseFloat(splitRow[1])
            let value = parseFloat(splitRow[2])
            let geographicLat = parseFloat(splitRow[3])
            let geographicLon = parseFloat(splitRow[4])

            geomagneticCoordinatesAndGeographicCoordinatesWithValues
            [this.getCoordinatesKey(mlt, magneticLat)]
                = [geographicLat, geographicLon, value]
        }

        for (let mlt = 0.0; mlt <= 23.75; mlt += 0.25) {
            for (let magneticLat = 50.0; magneticLat <= 89.0; magneticLat += 0.5) {
                let firstPointLat
                    = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(mlt, magneticLat)][0]
                let firstPointLon
                    = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(mlt, magneticLat)][1]
                let secondPointLat
                    = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(this.increaseMlt(mlt), magneticLat)][0]
                let secondPointLon
                    = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(this.increaseMlt(mlt), magneticLat)][1]
                let thirdPointLat
                    = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(this.increaseMlt(mlt), magneticLat + 0.5)][0]
                let thirdPointLon
                    = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(this.increaseMlt(mlt), magneticLat + 0.5)][1]
                let fourthPointLat
                    = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(mlt, magneticLat + 0.5)][0]
                let fourthPointLon
                    = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(mlt, magneticLat + 0.5)][1]
                let height = 95
                let value = geomagneticCoordinatesAndGeographicCoordinatesWithValues[this.getCoordinatesKey(mlt, magneticLat)][2]
                let firstPointMlt = mlt
                let firstPointMagneticLat = magneticLat

                this.ovationPrimeData3DUnits.push(
                    new OvationPrimeData3DUnit(
                        firstPointLat,
                        firstPointLon,
                        secondPointLat,
                        secondPointLon,
                        thirdPointLat,
                        thirdPointLon,
                        fourthPointLat,
                        fourthPointLon,
                        height,
                        value,
                        firstPointMlt,
                        firstPointMagneticLat
                    )
                )
            }
        }
    }

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

    public gotoCertainFile = (fileIndex: number) => { // async
        this.fileType = this.getFileTypeFromGUI()
        let fileTypeRepresentation = this.fileType?.getStringRepresentation()

        if (fileTypeRepresentation == null) {
            return
        }

        //@ts-ignore
        if ((fileIndex < 0) || (fileIndex > this.filesNumber - 1)) {
            return
        }

        this.currentFileIndex = fileIndex

        let data: string | null | undefined = undefined
        let fileName: string | null | undefined = undefined
        let fileDateTime: string | null | undefined = undefined

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

        if ((data == null)
            || (fileName == null)
            || (fileDateTime == null)) {
            return
        }

        this.datetimeInput.value = fileDateTime

        if (this.denoiseCheckbox.checked) {
            data = this.denoise(data)
        }

        // this.parseGeoinformationDataUnits(data)
        this.parseOvationPrimeData3DUnits(data)

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

        this.prepareToDrawSmoothMargin()

        this.view.show(
            this.ovationPrimeData3DUnits,
            this.marginLevel,
            this.middleMarginSegments)


        this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString()
        this.fileNumberRangeInput.value = this.currentFileIndex.toString()
        this.fileNameInput.value = fileName
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

    public getFilesNumberAndFileDataByDateTime = () => { // async
        let filesNumber: number | null | undefined = undefined
        let data: string | null | undefined = undefined
        let fileName: string | null | undefined = undefined
        let fileIndex: number | null | undefined = undefined
        let inputFileDateTime: string = this.datetimeInput.value
        let resultFileDateTime: string | null | undefined = undefined

        this.fileType = this.getFileTypeFromGUI()
        let fileTypeRepresentation = this.fileType?.getStringRepresentation()

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
        // this.parseGeoinformationDataUnits(data)
        // this.prepareToDrawSmoothMargin()
        // this.getTerminatorVerticesCoordinates()
        // this.getContinentsVerticesCoordinates()
        this.parseOvationPrimeData3DUnits(data)

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
        this.prepareToDrawSmoothMargin()

        this.view.show(
            this.ovationPrimeData3DUnits,
            this.marginLevel,
            this.middleMarginSegments)
        this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString()
        this.fileNameInput.value = fileName
        this.currentFileNumberInput.value = (parseInt(fileIndex) + 1).toString()
    }

    public getFilesNumber(): number | undefined {
        return this.filesNumber
    }

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
            url: '3d/file-data-by-datetime',
            method: 'get',
            dataType: 'json',
            async: false,
            data: {
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

        // this.parseGeoinformationDataUnits(data)
        // this.prepareToDrawSmoothMargin()
        // this.getTerminatorVerticesCoordinates()
        // this.getContinentsVerticesCoordinates()
        this.parseOvationPrimeData3DUnits(data)

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
        this.prepareToDrawSmoothMargin()

        this.view.show(
            this.ovationPrimeData3DUnits,
            this.marginLevel,
            this.middleMarginSegments)
        this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString()
        this.fileNumberRangeInput.value = this.currentFileIndex.toString()
        this.fileNameInput.value = fileName

        // this.recoverFileIndexAndFileType()
    }

    /**
 * Выполняем подготовку к рисованию сглаженной границы.
 */
    public prepareToDrawSmoothMargin(): void {
        if (!this.smoothMarginCheckbox.checked) {
            return
        }

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
        let dict
            = this.view.convertOvationPrimeData3DUnits(this.ovationPrimeData3DUnits)

        if (Object.keys(dict).length == 0) {
            return
        }

        for (let polarAngle = 0; polarAngle <= 23.75; polarAngle += 0.25) {
            for (let polarDistance = 50.5; polarDistance <= 89.5; polarDistance += 0.5) {
                let first = dict[polarAngle.toString() + ' ' + polarDistance.toString()]

                if (first == undefined) {
                    continue
                }

                let nextPolarAngle = polarAngle - 0.25

                if (nextPolarAngle < 0) {
                    nextPolarAngle = 23.75
                }

                let second = dict[nextPolarAngle.toString() + ' ' + polarDistance.toString()]

                if (second == undefined) {
                    continue
                }

                if (this.view.marginIsLocated(first.getValue(), second.getValue(), this.marginLevel)) {
                    let firstPoint = first.getFirstPoint()
                    let fourthPoint = first.getFourthPoint()

                    this.marginSegments.push(
                        new SegmentOnSphere(
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
        let dict = this.view.convertOvationPrimeData3DUnits(this.ovationPrimeData3DUnits)
        if (Object.keys(dict).length == 0) {
            return
        }

        for (let polarAngle = 0; polarAngle <= 23.75; polarAngle += 0.25) {
            for (let polarDistance = 50.5; polarDistance <= 89.5; polarDistance += 0.5) {
                let first = dict[polarAngle.toString() + ' ' + polarDistance.toString()]

                if (first == undefined) {
                    continue
                }

                let nextPolarDistance = polarDistance - 0.5

                let second = dict[polarAngle.toString() + ' ' + nextPolarDistance.toString()]

                if (second == undefined) {
                    continue
                }

                if (this.view.marginIsLocated(first.getValue(), second.getValue(), this.marginLevel)) {
                    let firstPoint = first.getFirstPoint()
                    let secondPoint = first.getSecondPoint()

                    this.marginSegments.push(
                        new SegmentOnSphere(
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
    private connectSegments(segments: SegmentOnSphere[]): void {
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

                    if (Math.abs(this.marginSegments[i].getFirstEnd().lat
                        - this.marginSegments[j].getFirstEnd().lat) > 20) {
                        console.log('here:')
                        console.log(this.marginSegments[i])
                        console.log(this.marginSegments[j])
                    }
                }

                if (this.marginSegments[i].isSecondNeighbour(this.marginSegments[j])) {
                    this.marginSegments[i].secondEndNeighbours.push(this.marginSegments[j])

                    if (Math.abs(this.marginSegments[i].getSecondEnd().lat
                        - this.marginSegments[j].getSecondEnd().lat) > 20) {
                        console.log('here:')
                        console.log(this.marginSegments[i])
                        console.log(this.marginSegments[j])
                    }
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
            if (this.marginSegments[i].getFirstNeighbour() != null) {
                let marginSegment = this.marginSegments[i]

                let newMiddleMarginSegment = new SegmentOnSphere(
                    marginSegment.getMiddle(),
                    marginSegment.getFirstNeighbour()!.getMiddle(),
                    null
                )

                let firstNeighbour = marginSegment.getFirstNeighbour()
                let intersectionWithFirstNeighbour
                    = marginSegment.getIntersectionWithFirstNeighbour()

                if (marginSegment.isBad()
                    || marginSegment.getFirstNeighbour()!.isBad()) {
                    if (marginSegment.isBad()) {
                        let buffer = marginSegment
                        //@ts-ignore
                        marginSegment = firstNeighbour
                        firstNeighbour = buffer
                    }

                    this.middleMarginSegments.push(
                        new SegmentOnSphere(
                            marginSegment.getMiddle(),
                            //@ts-ignore
                            intersectionWithFirstNeighbour,
                            null
                        )
                    )

                    this.middleMarginSegments.push(
                        //@ts-ignore
                        firstNeighbour
                    )
                } else {
                    this.middleMarginSegments.push(
                        newMiddleMarginSegment
                    )
                }
            }

            if (this.marginSegments[i].getSecondNeighbour() != null) {
                let marginSegment = this.marginSegments[i]

                let newMiddleMarginSegment = new SegmentOnSphere(
                    marginSegment.getMiddle(),
                    marginSegment.getSecondNeighbour()!.getMiddle(),
                    null
                )

                let secondNeighbour = marginSegment.getSecondNeighbour()
                let intersectionWithSecondNeighbour
                    = marginSegment.getIntersectionWithSecondNeighbour()

                if (marginSegment.isBad() || secondNeighbour?.isBad()) {
                    if (marginSegment.isBad()) {
                        let buffer = marginSegment
                        //@ts-ignore
                        marginSegment = secondNeighbour
                        secondNeighbour = buffer
                    }

                    this.middleMarginSegments.push(
                        new SegmentOnSphere(
                            marginSegment.getMiddle(),
                            //@ts-ignore
                            intersectionWithSecondNeighbour,
                            null
                        )
                    )

                    this.middleMarginSegments.push(
                        //@ts-ignore
                        secondNeighbour
                    )
                } else {
                    this.middleMarginSegments.push(
                        newMiddleMarginSegment
                    )
                }
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

    private denoise(data: string): string {
        // console.log('here')
        // console.log(data)

        let outputData = ""

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
                outputData = response.data
            },
            error: function (response) {
                alert('Ошибка при попытке фильровать шум.')
            },
        })

        return outputData
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

    public getSecondForecast() {
        let filesNumber: number | null | undefined = undefined
        let data: string | null | undefined = undefined
        let fileName: string | null | undefined = undefined
        let fileDateTime: string | null | undefined = undefined

        $.ajax({
            url: '3d/second-forecast',
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

        console.log(data)

        if (data) {
            this.parseOvationPrimeData3DUnits(data)
        }

        this.prepareToDrawSmoothMargin()

        this.filesNumber = filesNumber
        this.currentFileIndex = filesNumber - 1

        //@ts-ignore
        this.filesNumberInput.value = this.filesNumber.toString()

        console.log(this.ovationPrimeData3DUnits)

        this.view.show(
            this.ovationPrimeData3DUnits,
            this.marginLevel,
            this.middleMarginSegments)

        this.currentFileNumberInput.value = (this.currentFileIndex + 1).toString()
        this.fileNumberRangeInput.value = this.currentFileIndex.toString()
        this.fileNameInput.value = fileName
        this.datetimeInput.value = fileDateTime
    }
}