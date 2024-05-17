/*
 * В данном файле содержится реализация контроллера из паттерна MVC для управления
 * страницей 3D визуализации.
 */

class Controller {
    private readonly marksCheckbox = <HTMLInputElement>document.getElementById('marks-checkbox')

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

    private gotoPreviousFileButton = <HTMLInputElement>document.getElementById('go-to-previous-file-button')

    private gotoNextFileButton = <HTMLInputElement>document.getElementById('go-to-next-file-button')

    private readonly gotoFileButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('go-to-certain-file-button')

    private readonly gotoCertainFileInput = <HTMLInputElement>document.getElementById('go-to-certain-file-input')

    private readonly datetimeInput = <HTMLInputElement>document.getElementById('datetime-input')

    // private readonly selectDateAndTimeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('go-to-file-by-datetime')

    private readonly changeColorIndicatorVisibilityButton = <HTMLButtonElement>document.getElementById('change-color-indicator-visibility-button')

    private readonly showMarginCheckBox: HTMLInputElement = <HTMLInputElement>document.getElementById('show-margin-checkbox')

    private readonly smoothMarginCheckbox = <HTMLInputElement>document.getElementById('smooth-margin-checkbox')

    private readonly showDayNightCheckbox = <HTMLInputElement>document.getElementById('show-day-night-checkbox')

    private readonly denoiseCheckbox = <HTMLInputElement>document.getElementById('denoise-checkbox')

    private readonly colorIndicatorLimitInput = <HTMLInputElement>document.getElementById('color-indicator-limit-input')

    private readonly marginLevelInput = <HTMLInputElement>document.getElementById('margin-level-input')

    private readonly showHeatmapCheckbox = <HTMLInputElement>document.getElementById('show-heatmap-checkbox')

    private readonly fileNumberRangeInput = <HTMLInputElement>document.getElementById('file-number-range-input')

    private readonly additionalFileInfoButton = <HTMLButtonElement>document.getElementById('additional-file-info-button')

    private readonly model: Model

    private readonly view: View

    private readonly fileSelectionManager: FileSelectionManager

    private options: Options | null = null

    private fullScreenFlag = false

    //@ts-ignore
    private fullScreenButtonElementClone

    public constructor(model: Model, view: View) {
        this.model = model
        this.view = view
        this.fileSelectionManager = new FileSelectionManager(model)
    }

    public addEventListeners(): void {
        // this.marksCheckbox.addEventListener('change', () => {
        //     this.view.show(this.model.ovationPrimeData3DUnits, this.model.marginLevel)
        // })

        this.changeColorIndicatorVisibilityButton.addEventListener('click', () => {
            this.view.changeColorIndicatorCanvasVisibility()

            if (this.view.colorIndicatorDisplay.canvasIsVisible()) {
                this.changeColorIndicatorVisibilityButton.textContent = "Скрыть цветовую шкалу"
            } else {
                this.changeColorIndicatorVisibilityButton.textContent = "Показать цветовую шкалу"
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
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
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
        // this.selectDateAndTimeButton.addEventListener('click', () => { this.model.gotoFileByDatetime() })

        this.showMarginCheckBox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions()
            } else {
                this.visualize()
                this.saveOptions()
            }
        })

        this.smoothMarginCheckbox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions()
            } else {
                this.visualize()
                this.saveOptions()
            }
        })

        this.showDayNightCheckbox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions()
            } else {
                this.visualize()
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

        this.colorIndicatorLimitInput.addEventListener('input', this.colorIndicatorLimitInputInputEventListener)
        this.marginLevelInput.addEventListener('input', this.marginLevelInputInputEventListener)

        this.showHeatmapCheckbox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions()
            } else {
                this.visualize()
                this.saveOptions()
            }
        })

        this.fileNumberRangeInput.addEventListener('input',
            () => {
                console.log("here")
                this.fileSelectionManager.addCommand(parseInt(this.fileNumberRangeInput.value))
            })

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

        // let innerHTML = ""

        // let id = setInterval(() => {
        //     // console.log('innerHTML:')
        //     // console.log(this.view.viewer._fullscreenButton._container.innerHTML)

        //     if (innerHTML != "" && innerHTML != this.view.viewer._fullscreenButton._container.innerHTML) {
        //         console.log(this.view.viewer._fullscreenButton._container.innerHTML)
        //         console.log(innerHTML)
        //         clearInterval(id)
        //     }

        //     innerHTML = this.view.viewer._fullscreenButton._container.innerHTML
        // }, 5)

        // let fullScreenButton = <HTMLButtonElement>document.getElementById("full-screen-button")
        // fullScreenButton.addEventListener('click', () => {
        //     alert('ok')
        //     console.log('innerHTML:')
        //     console.log(this.view.viewer._fullscreenButton._container.innerHTML)
        //     this.toggleFullScreen()
        // })

        let element = this.view.viewer._fullscreenButton._element
        //@ts-ignore
        this.fullScreenButtonElementClone = element.cloneNode(true)

        //@ts-ignore
        element.parentNode.replaceChild(
            this.fullScreenButtonElementClone,
            element)

        //@ts-ignore
        this.fullScreenButtonElementClone.addEventListener('click', () => {
            // console.log('innerHTML:')
            // console.log(this.view.viewer._fullscreenButton._container.innerHTML)
            this.toggleFullScreen()
        })

        this.fullScreenButtonElementClone.innerHTML = "Full screen"
    }

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

    private visualize(): void {
        // this.model.prepareToDrawSmoothMargin()
        // this.model.processCloudiness()

        // this.view.show(
        //     this.model.geoinformationDataUnits,
        //     this.model.marginLevel,
        //     this.model.middleMarginSegments,
        //     this.model.terminatorVertices,
        //     this.model.cloudinessCellsGeomagneticCoordinates,
        //     this.model.cloudinessCellsValues,
        //     this.model.getMLTRotationAngle(),
        //     this.model.continentsVertices,
        //     this.model.getCities(),
        //     this.model.getExtendedFunctionality1Info())
        this.model.prepareToDrawSmoothMargin()

        this.view.show(
            this.model.ovationPrimeData3DUnits,
            this.model.marginLevel,
            this.model.middleMarginSegments)
    }

    private colorIndicatorLimitInputInputEventListener = () => {
        if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
            this.restoreOptions()
        } else {
            let newColorIndicatorLimit = parseFloat(this.colorIndicatorLimitInput.value)

            if (!Number.isNaN(newColorIndicatorLimit) && (newColorIndicatorLimit > 0)) {
                OvationPrimeData3DUnit.maxValue = newColorIndicatorLimit
                this.model.prepareToDrawSmoothMargin()
                // this.model.getTerminatorVerticesCoordinates()
                // this.view.show(
                // 	this.model.geoinformationDataUnits,
                // 	this.model.marginLevel,
                // 	this.model.middleMarginSegments,
                // 	this.model.terminatorVertices)
                this.visualize()
            }
        }
    }

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
            this.visualize()
        }
    }

    public enableAndDisableSomeGUIElements(): void {
        let fileType = this.model.getFileTypeFromGUI()

        this.secondForecastRadio.disabled
            = !((fileType?.horizonSideType == HorizonSideType.NORTH)
                && (fileType.radiationType == RadiationType.DIFFUSE))
        // this.selectDateAndTimeButton.disabled
        //     = fileType?.castType == CastType.SECOND_FORECAST
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
            this.showHeatmapCheckbox.checked,
            this.showMarginCheckBox.checked,
            this.smoothMarginCheckbox.checked,
            parseFloat(this.marginLevelInput.value),
            this.showDayNightCheckbox.checked,
            // this.cloudinessCheckbox.checked,
            this.denoiseCheckbox.checked,
        )
    }

    public restoreOptions(): void {
        this.datetimeInput.value
            = this.options!.datetime
        this.restoreFileTypeOptions()
        this.colorIndicatorLimitInput.value
            = this.options!.colorIndicatorLimit.toString()
        this.showHeatmapCheckbox.checked
            = this.options!.showHeatmapFlag
        this.showMarginCheckBox.checked
            = this.options!.showMarginFlag
        this.smoothMarginCheckbox.checked
            = this.options!.smoothMarginFlag
        this.marginLevelInput.value
            = this.options!.marginLevel.toString()
        this.showDayNightCheckbox.checked
            = this.options!.showDayNightFlag
        // this.cloudinessCheckBox.checked
        //     = this.options!.showCloudinessFlag
        this.denoiseCheckbox.checked
            = this.options!.denoiseFlag
        // this.continentsCheckbox.checked
        //     = this.options!.showContinentsFlag
        // this.citiesCheckbox.checked
        //     = this.options!.showCitiesFlag
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

    public toggleFullScreen(): void {
        // alert("toggle")

        let cesiumContainer = document.getElementById("cesiumContainer")

        //@ts-ignore
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if ('requestFullScreen' in document.body) {
                cesiumContainer!.requestFullscreen();
            } else if ('webkitRequestFullscreen' in document.body) {
                //@ts-ignore
                cesiumContainer.webkitRequestFullscreen();
            }
            //@ts-ignore
            // cesiumContainer.fullScreenIcon = 'fullscreen-exit';
            this.fullScreenButtonElementClone.innerHTML = 'Exit full screen'
        } else {
            //@ts-ignore
            if (document.exitFullscreen) {
                //@ts-ignore
                document.exitFullscreen();
                //@ts-ignore
            } else if (document.exitFullscreen) {
                //@ts-ignore
                document.webkitExitFullscreen();
            }

            this.fullScreenButtonElementClone.innerHTML = "Full screen"
        }
    }
}