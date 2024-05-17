"use strict";
/*
 * В данном файле содержится реализация контроллера из паттерна MVC для управления
 * страницей 3D визуализации.
 */
class Controller {
    constructor(model, view) {
        this.marksCheckbox = document.getElementById('marks-checkbox');
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
        this.gotoPreviousFileButton = document.getElementById('go-to-previous-file-button');
        this.gotoNextFileButton = document.getElementById('go-to-next-file-button');
        this.gotoFileButton = document.getElementById('go-to-certain-file-button');
        this.gotoCertainFileInput = document.getElementById('go-to-certain-file-input');
        this.datetimeInput = document.getElementById('datetime-input');
        // private readonly selectDateAndTimeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('go-to-file-by-datetime')
        this.changeColorIndicatorVisibilityButton = document.getElementById('change-color-indicator-visibility-button');
        this.showMarginCheckBox = document.getElementById('show-margin-checkbox');
        this.smoothMarginCheckbox = document.getElementById('smooth-margin-checkbox');
        this.showDayNightCheckbox = document.getElementById('show-day-night-checkbox');
        this.denoiseCheckbox = document.getElementById('denoise-checkbox');
        this.colorIndicatorLimitInput = document.getElementById('color-indicator-limit-input');
        this.marginLevelInput = document.getElementById('margin-level-input');
        this.showHeatmapCheckbox = document.getElementById('show-heatmap-checkbox');
        this.fileNumberRangeInput = document.getElementById('file-number-range-input');
        this.additionalFileInfoButton = document.getElementById('additional-file-info-button');
        this.options = null;
        this.fullScreenFlag = false;
        this.gotoFileButtonClickEventListener = () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                return;
            }
            let fileNumber = parseInt(this.gotoCertainFileInput.value);
            if (Number.isNaN(fileNumber)) {
                alert("Номер файла указан некорректно.");
                return;
            }
            if (this.model.getFilesNumber() == undefined) {
                return;
            }
            // @ts-ignore
            if ((fileNumber < 1) || (this.model.getFilesNumber() < fileNumber)) {
                alert("Номер файла должен принимать значение от 1 до " + this.model.getFilesNumber() + ".");
                return;
            }
            this.model.gotoCertainFile(fileNumber - 1);
            this.gotoCertainFileInput.value = '';
        };
        this.colorIndicatorLimitInputInputEventListener = () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                let newColorIndicatorLimit = parseFloat(this.colorIndicatorLimitInput.value);
                if (!Number.isNaN(newColorIndicatorLimit) && (newColorIndicatorLimit > 0)) {
                    OvationPrimeData3DUnit.maxValue = newColorIndicatorLimit;
                    this.model.prepareToDrawSmoothMargin();
                    // this.model.getTerminatorVerticesCoordinates()
                    // this.view.show(
                    // 	this.model.geoinformationDataUnits,
                    // 	this.model.marginLevel,
                    // 	this.model.middleMarginSegments,
                    // 	this.model.terminatorVertices)
                    this.visualize();
                }
            }
        };
        this.marginLevelInputInputEventListener = () => {
            let newMarginLevel = parseFloat(this.marginLevelInput.value);
            if (!Number.isNaN(newMarginLevel)) {
                this.model.marginLevel = newMarginLevel;
                this.model.prepareToDrawSmoothMargin();
                // this.model.getTerminatorVerticesCoordinates()
                // this.view.show(
                // 	this.model.geoinformationDataUnits,
                // 	this.model.marginLevel,
                // 	this.model.middleMarginSegments,
                // 	this.model.terminatorVertices)
                this.visualize();
            }
        };
        this.model = model;
        this.view = view;
        this.fileSelectionManager = new FileSelectionManager(model);
    }
    addEventListeners() {
        // this.marksCheckbox.addEventListener('change', () => {
        //     this.view.show(this.model.ovationPrimeData3DUnits, this.model.marginLevel)
        // })
        this.changeColorIndicatorVisibilityButton.addEventListener('click', () => {
            this.view.changeColorIndicatorCanvasVisibility();
            if (this.view.colorIndicatorDisplay.canvasIsVisible()) {
                this.changeColorIndicatorVisibilityButton.textContent = "Скрыть цветовую шкалу";
            }
            else {
                this.changeColorIndicatorVisibilityButton.textContent = "Показать цветовую шкалу";
            }
        });
        this.northRadio.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.saveOptions();
                this.enableAndDisableSomeGUIElements();
                this.model.getFilesNumberAndFileDataByDateTime();
            }
        });
        this.southRadio.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.saveOptions();
                this.enableAndDisableSomeGUIElements();
                this.model.getFilesNumberAndFileDataByDateTime();
            }
        });
        this.forecastRadio.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.saveOptions();
                this.enableAndDisableSomeGUIElements();
                this.model.getFilesNumberAndFileDataByDateTime();
            }
        });
        this.nowcastRadio.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.saveOptions();
                this.enableAndDisableSomeGUIElements();
                this.model.getFilesNumberAndFileDataByDateTime();
            }
        });
        this.secondForecastRadio.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.saveOptions();
                this.enableAndDisableSomeGUIElements();
                this.model.getSecondForecast();
            }
        });
        this.diffuseRadio.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.saveOptions();
                this.enableAndDisableSomeGUIElements();
                this.model.getFilesNumberAndFileDataByDateTime();
            }
        });
        this.ionsRadio.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.saveOptions();
                this.enableAndDisableSomeGUIElements();
                this.model.getFilesNumberAndFileDataByDateTime();
            }
        });
        this.monoRadio.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.saveOptions();
                this.enableAndDisableSomeGUIElements();
                this.model.getFilesNumberAndFileDataByDateTime();
            }
        });
        this.waveRadio.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.saveOptions();
                this.enableAndDisableSomeGUIElements();
                this.model.getFilesNumberAndFileDataByDateTime();
            }
        });
        this.totalRadio.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.saveOptions();
                this.enableAndDisableSomeGUIElements();
                this.model.getFilesNumberAndFileDataByDateTime();
            }
        });
        this.gotoPreviousFileButton.addEventListener('click', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.saveOptions();
                this.model.gotoPreviousFile();
            }
        });
        this.gotoNextFileButton.addEventListener('click', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.saveOptions();
                this.model.gotoNextFile();
            }
        });
        this.gotoFileButton.addEventListener('click', this.gotoFileButtonClickEventListener);
        this.datetimeInput.addEventListener('input', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.saveOptions();
                this.model.gotoFileByDatetime();
            }
        });
        // this.selectDateAndTimeButton.addEventListener('click', () => { this.model.gotoFileByDatetime() })
        this.showMarginCheckBox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.visualize();
                this.saveOptions();
            }
        });
        this.smoothMarginCheckbox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.visualize();
                this.saveOptions();
            }
        });
        this.showDayNightCheckbox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.visualize();
                this.saveOptions();
            }
        });
        this.denoiseCheckbox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.model.gotoCertainFile(this.model.getCurrentFileIndex());
                this.saveOptions();
            }
        });
        this.colorIndicatorLimitInput.addEventListener('input', this.colorIndicatorLimitInputInputEventListener);
        this.marginLevelInput.addEventListener('input', this.marginLevelInputInputEventListener);
        this.showHeatmapCheckbox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.visualize();
                this.saveOptions();
            }
        });
        this.fileNumberRangeInput.addEventListener('input', () => {
            console.log("here");
            this.fileSelectionManager.addCommand(parseInt(this.fileNumberRangeInput.value));
        });
        this.additionalFileInfoButton.addEventListener('click', () => {
            let fileNumberLabel = document.getElementById("file-number-label");
            let currentFileNumberInput = document.getElementById("current-file-number-input");
            let fromLabel = document.getElementById("from-label");
            let filesNumberInput = document.getElementById('files-number-input');
            let fileNameLabel = document.getElementById("file-name-label");
            let fileNameInput = document.getElementById("file-name-input");
            if (fileNumberLabel.style.display == "none") {
                fileNumberLabel.style.display = "inline";
            }
            else {
                fileNumberLabel.style.display = "none";
            }
            if (currentFileNumberInput.style.display == "none") {
                currentFileNumberInput.style.display = "inline";
            }
            else {
                currentFileNumberInput.style.display = "none";
            }
            if (fromLabel.style.display == "none") {
                fromLabel.style.display = "inline";
            }
            else {
                fromLabel.style.display = "none";
            }
            if (filesNumberInput.style.display == "none") {
                filesNumberInput.style.display = "inline";
            }
            else {
                filesNumberInput.style.display = "none";
            }
            if (fileNameLabel.style.display == "none") {
                fileNameLabel.style.display = "inline";
            }
            else {
                fileNameLabel.style.display = "none";
            }
            if (fileNameInput.style.display == "none") {
                fileNameInput.style.display = "inline";
            }
            else {
                fileNameInput.style.display = "none";
            }
            if (this.gotoFileButton.style.display == "none") {
                this.gotoFileButton.style.display = "inline";
            }
            else {
                this.gotoFileButton.style.display = "none";
            }
            if (this.gotoCertainFileInput.style.display == "none") {
                this.gotoCertainFileInput.style.display = "inline";
            }
            else {
                this.gotoCertainFileInput.style.display = "none";
            }
        });
        this.fileSelectionManager.run();
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
        let element = this.view.viewer._fullscreenButton._element;
        //@ts-ignore
        this.fullScreenButtonElementClone = element.cloneNode(true);
        //@ts-ignore
        element.parentNode.replaceChild(this.fullScreenButtonElementClone, element);
        //@ts-ignore
        this.fullScreenButtonElementClone.addEventListener('click', () => {
            // console.log('innerHTML:')
            // console.log(this.view.viewer._fullscreenButton._container.innerHTML)
            this.toggleFullScreen();
        });
        this.fullScreenButtonElementClone.innerHTML = "Full screen";
    }
    visualize() {
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
        this.model.prepareToDrawSmoothMargin();
        this.view.show(this.model.ovationPrimeData3DUnits, this.model.marginLevel, this.model.middleMarginSegments);
    }
    enableAndDisableSomeGUIElements() {
        let fileType = this.model.getFileTypeFromGUI();
        this.secondForecastRadio.disabled
            = !(((fileType === null || fileType === void 0 ? void 0 : fileType.horizonSideType) == HorizonSideType.NORTH)
                && (fileType.radiationType == RadiationType.DIFFUSE));
        // this.selectDateAndTimeButton.disabled
        //     = fileType?.castType == CastType.SECOND_FORECAST
        this.gotoPreviousFileButton.disabled
            = (fileType === null || fileType === void 0 ? void 0 : fileType.castType) == CastType.SECOND_FORECAST;
        this.gotoNextFileButton.disabled
            = (fileType === null || fileType === void 0 ? void 0 : fileType.castType) == CastType.SECOND_FORECAST;
        this.gotoFileButton.disabled
            = (fileType === null || fileType === void 0 ? void 0 : fileType.castType) == CastType.SECOND_FORECAST;
        this.fileNumberRangeInput.disabled
            = (fileType === null || fileType === void 0 ? void 0 : fileType.castType) == CastType.SECOND_FORECAST;
        this.southRadio.disabled = (fileType === null || fileType === void 0 ? void 0 : fileType.castType) == CastType.SECOND_FORECAST;
        this.ionsRadio.disabled = (fileType === null || fileType === void 0 ? void 0 : fileType.castType) == CastType.SECOND_FORECAST;
        this.monoRadio.disabled = (fileType === null || fileType === void 0 ? void 0 : fileType.castType) == CastType.SECOND_FORECAST;
        this.waveRadio.disabled = (fileType === null || fileType === void 0 ? void 0 : fileType.castType) == CastType.SECOND_FORECAST;
        this.totalRadio.disabled = (fileType === null || fileType === void 0 ? void 0 : fileType.castType) == CastType.SECOND_FORECAST;
    }
    saveOptions() {
        this.options = new Options(this.datetimeInput.value, this.model.getFileTypeFromGUI(), parseFloat(this.colorIndicatorLimitInput.value), this.showHeatmapCheckbox.checked, this.showMarginCheckBox.checked, this.smoothMarginCheckbox.checked, parseFloat(this.marginLevelInput.value), this.showDayNightCheckbox.checked, 
        // this.cloudinessCheckbox.checked,
        this.denoiseCheckbox.checked);
    }
    restoreOptions() {
        this.datetimeInput.value
            = this.options.datetime;
        this.restoreFileTypeOptions();
        this.colorIndicatorLimitInput.value
            = this.options.colorIndicatorLimit.toString();
        this.showHeatmapCheckbox.checked
            = this.options.showHeatmapFlag;
        this.showMarginCheckBox.checked
            = this.options.showMarginFlag;
        this.smoothMarginCheckbox.checked
            = this.options.smoothMarginFlag;
        this.marginLevelInput.value
            = this.options.marginLevel.toString();
        this.showDayNightCheckbox.checked
            = this.options.showDayNightFlag;
        // this.cloudinessCheckBox.checked
        //     = this.options!.showCloudinessFlag
        this.denoiseCheckbox.checked
            = this.options.denoiseFlag;
        // this.continentsCheckbox.checked
        //     = this.options!.showContinentsFlag
        // this.citiesCheckbox.checked
        //     = this.options!.showCitiesFlag
    }
    restoreFileTypeOptions() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        this.northRadio.checked
            = ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.fileType) === null || _b === void 0 ? void 0 : _b.horizonSideType)
                == HorizonSideType.NORTH;
        this.southRadio.checked
            = ((_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.fileType) === null || _d === void 0 ? void 0 : _d.horizonSideType)
                == HorizonSideType.SOUTH;
        this.forecastRadio.checked
            = ((_f = (_e = this.options) === null || _e === void 0 ? void 0 : _e.fileType) === null || _f === void 0 ? void 0 : _f.castType)
                == CastType.FORECAST;
        this.nowcastRadio.checked
            = ((_h = (_g = this.options) === null || _g === void 0 ? void 0 : _g.fileType) === null || _h === void 0 ? void 0 : _h.castType)
                == CastType.NOWCAST;
        this.secondForecastRadio.checked
            = ((_k = (_j = this.options) === null || _j === void 0 ? void 0 : _j.fileType) === null || _k === void 0 ? void 0 : _k.castType)
                == CastType.SECOND_FORECAST;
        this.diffuseRadio.checked
            = ((_m = (_l = this.options) === null || _l === void 0 ? void 0 : _l.fileType) === null || _m === void 0 ? void 0 : _m.radiationType)
                == RadiationType.DIFFUSE;
        this.ionsRadio.checked
            = ((_p = (_o = this.options) === null || _o === void 0 ? void 0 : _o.fileType) === null || _p === void 0 ? void 0 : _p.radiationType)
                == RadiationType.IONS;
        this.monoRadio.checked
            = ((_r = (_q = this.options) === null || _q === void 0 ? void 0 : _q.fileType) === null || _r === void 0 ? void 0 : _r.radiationType)
                == RadiationType.MONO;
        this.waveRadio.checked
            = ((_t = (_s = this.options) === null || _s === void 0 ? void 0 : _s.fileType) === null || _t === void 0 ? void 0 : _t.radiationType)
                == RadiationType.WAVE;
        this.totalRadio.checked
            = ((_v = (_u = this.options) === null || _u === void 0 ? void 0 : _u.fileType) === null || _v === void 0 ? void 0 : _v.radiationType)
                == RadiationType.TOTAL;
    }
    toggleFullScreen() {
        // alert("toggle")
        let cesiumContainer = document.getElementById("cesiumContainer");
        //@ts-ignore
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if ('requestFullScreen' in document.body) {
                cesiumContainer.requestFullscreen();
            }
            else if ('webkitRequestFullscreen' in document.body) {
                //@ts-ignore
                cesiumContainer.webkitRequestFullscreen();
            }
            //@ts-ignore
            // cesiumContainer.fullScreenIcon = 'fullscreen-exit';
            this.fullScreenButtonElementClone.innerHTML = 'Exit full screen';
        }
        else {
            //@ts-ignore
            if (document.exitFullscreen) {
                //@ts-ignore
                document.exitFullscreen();
                //@ts-ignore
            }
            else if (document.exitFullscreen) {
                //@ts-ignore
                document.webkitExitFullscreen();
            }
            this.fullScreenButtonElementClone.innerHTML = "Full screen";
        }
    }
}
