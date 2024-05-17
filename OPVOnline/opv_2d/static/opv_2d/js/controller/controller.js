"use strict";
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
    constructor(view, model, gotoPreviousFileButton, gotoNextFileButton, gotoFileButton, gotoCertainFileInput, datetimeInput, defaultOffsetAndSizesButton, changeColorIndicatorCanvasVisibilityButton, northRadio, southRadio, forecastRadio, nowcastRadio, secondForecastRadio, diffuseRadio, ionsRadio, monoRadio, waveRadio, totalRadio, colorIndicatorLimitInput, showHeatmapCheckBox, showMarginCheckBox, smoothMarginCheckBox, fileNumberRangeInput, marginLevelInput, showDayNightCheckBox, cloudinessCheckBox, denoiseCheckbox, continentsCheckbox, additionalFileInfoButton, citiesCheckbox) {
        /**
         * Вспомогательная переменная с координатой x.
         */
        this.x = 0;
        /**
         * Вспомогательная переменная с координатой y.
         */
        this.y = 0;
        /**
         * Флажок, который поднят, если нужно двигать изображение.
         */
        this.moveFlag = false;
        this.options = null;
        /**
         * Флажок, который поднят, если нужно отображать информацию
         * о фрагментах изображения.
         */
        this.showGeoinformationDataUnitInfoFlag = false;
        /**
         * Обработчик события, которое происходит при нажатии мыши на
         * холст для визаулизации.
         * @param event упомянутое событие.
         * @returns
         */
        this.viewVisualizationDisplayCanvasMousedownEventListener = (event) => {
            let mouseEvent = (event);
            // if (mouseEvent.button == 1) {
            // 	alert(this.view.visualizationDisplay.getOffsetX() + ' ' + this.view.visualizationDisplay.getOffsetY())
            // }
            if (mouseEvent.button == 0) {
                this.moveFlag = true;
            }
            else if (mouseEvent.button == 2) {
                this.showGeoinformationDataUnitInfoFlag = true;
                if (this.view.visualizationDisplay.canvas == null) {
                    return;
                }
                // this.model.prepareToDrawSmoothMargin()
                // this.model.getTerminatorVerticesCoordinates()
                // this.view.show(
                // 	this.model.geoinformationDataUnits,
                // 	this.model.marginLevel,
                // 	this.model.middleMarginSegments,
                // 	this.model.terminatorVertices)
                this.visualize(true, mouseEvent);
                // let rect = this.view.visualizationDisplay.canvas.getBoundingClientRect()
                // this.view.paintLabel((mouseEvent.clientX - rect.left) * 4, (mouseEvent.clientY - rect.top) * 4,
                // 	this.model.geoinformationDataUnits)
            }
            this.x = mouseEvent.pageX;
            this.y = mouseEvent.pageY;
        };
        /**
         * Обработчик события, которое происходит при отжатии мыши
         * на холсте для визуализации.
         * @param event упомянутое событие.
         */
        this.viewVisualizationDisplayCanvasMouseupEventListener = (event) => {
            this.moveFlag = false;
            this.showGeoinformationDataUnitInfoFlag = false;
        };
        /**
         * Обработчик события, которое происходит при движении мыши
         * на холсте для визуализации.
         * @param event упомянутое событие.
         * @returns
         */
        this.viewVisualizationDisplayCanvasMousemoveEventListener = (event) => {
            if (this.moveFlag) {
                let mouseEvent = (event);
                let newX = mouseEvent.pageX;
                let newY = mouseEvent.pageY;
                let deltaX = (newX - this.x) * 4;
                let deltaY = (newY - this.y) * 4;
                this.x = newX;
                this.y = newY;
                this.view.visualizationDisplay.changeOffset(deltaX, deltaY);
                // this.model.prepareToDrawSmoothMargin()
                this.visualize(true, null);
            }
            else if (this.showGeoinformationDataUnitInfoFlag) {
                if (this.view.visualizationDisplay.canvas == null) {
                    return;
                }
                // this.model.prepareToDrawSmoothMargin()
                // // this.model.getTerminatorVerticesCoordinates()
                // this.view.show(
                // 	this.model.geoinformationDataUnits,
                // 	this.model.marginLevel,
                // 	this.model.middleMarginSegments,
                // 	this.model.terminatorVertices)
                // console.log("here")
                this.visualize(true, (event));
                // let mouseEvent = <MouseEvent>(event)
                // let rect = this.view.visualizationDisplay.canvas.getBoundingClientRect()
                // this.view.paintLabel((mouseEvent.clientX - rect.left) * 4, (mouseEvent.clientY - rect.top) * 4,
                // 	this.model.geoinformationDataUnits)
            }
        };
        /**
         * Обработчик события, которое происходит при вращении колесика
         * мыши, когда мышь наведена на холст для визуализации.
         * @param event упомянутое событие.
         * @returns
         */
        this.viewVisualizationDisplayCanvasWheelEventListener = (event) => {
            if (this.view.visualizationDisplay.canvas == null) {
                return;
            }
            let wheelEvent = (event);
            const rect = this.view.visualizationDisplay.canvas.getBoundingClientRect();
            const xInCanvasInitial = wheelEvent.clientX - rect.left;
            const yInCanvasInitial = wheelEvent.clientY - rect.top;
            CoordinateAdapter.firstCoordinateAdapter.setDisplay(this.view.visualizationDisplay);
            CoordinateAdapter.firstCoordinateAdapter.set(xInCanvasInitial * 4, yInCanvasInitial * 4, CoordinateSystem.CANVAS);
            let xInDisplay0 = CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.DISPLAY_ROTATED);
            let yInDisplay0 = CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.DISPLAY_ROTATED);
            CoordinateAdapter.firstCoordinateAdapter.set(xInDisplay0, yInDisplay0, CoordinateSystem.DISPLAY_ROTATED);
            let xInCanvas0 = CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS);
            let yInCanvas0 = CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS);
            let lambda = 0;
            let flag = false;
            if (wheelEvent.deltaY < 0) {
                flag = this.view.visualizationDisplay.increaseSizes();
                lambda = Display.INCREASE_SIZE_RATIO;
            }
            else {
                flag = this.view.visualizationDisplay.decreaseSizes();
                lambda = 1 / Display.INCREASE_SIZE_RATIO;
            }
            let xInDisplay1 = xInDisplay0 * lambda;
            let yInDisplay1 = yInDisplay0 * lambda;
            CoordinateAdapter.firstCoordinateAdapter.set(xInDisplay1, yInDisplay1, CoordinateSystem.DISPLAY_ROTATED);
            let xInCanvas1 = CoordinateAdapter.firstCoordinateAdapter.getX(CoordinateSystem.CANVAS);
            let yInCanvas1 = CoordinateAdapter.firstCoordinateAdapter.getY(CoordinateSystem.CANVAS);
            let deltaX = xInCanvas1 - xInCanvas0;
            let deltaY = yInCanvas1 - yInCanvas0;
            if (flag) {
                this.view.visualizationDisplay.changeOffset(-deltaX, -deltaY);
            }
            this.visualize(true, null);
        };
        /**
         * Обработчик события, которое происходит при клике мыши
         * на кнопку для перехода к указанному файлу.
         * @returns
         */
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
        /**
         * Обработчик события, которое происходит при изменении
         * текста в поле для ввода предельного значения цветовой шкалы.
         */
        this.colorIndicatorLimitInputInputEventListener = () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                let newColorIndicatorLimit = parseFloat(this.colorIndicatorLimitInput.value);
                if (!Number.isNaN(newColorIndicatorLimit) && (newColorIndicatorLimit > 0)) {
                    GeoinformationDataUnit.maxValue = newColorIndicatorLimit;
                    this.model.prepareToDrawSmoothMargin();
                    this.visualize(true, null);
                    this.saveOptions();
                }
            }
        };
        /**
         * Обработчик события, которое происходит при изменении
         * текста в поле для ввода уровня границы.
         */
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
                this.visualize(true, null);
            }
        };
        this.view = view;
        this.model = model;
        this.gotoPreviousFileButton = gotoPreviousFileButton;
        this.gotoNextFileButton = gotoNextFileButton;
        this.gotoFileButton = gotoFileButton;
        this.gotoCertainFileInput = gotoCertainFileInput;
        // this.selectDateAndTimeButton = selectDateAndTimeButton
        this.datetimeInput = datetimeInput;
        this.defaultOffsetAndSizesButton = defaultOffsetAndSizesButton;
        this.changeColorIndicatorCanvasVisibilityButton
            = changeColorIndicatorCanvasVisibilityButton;
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
        this.colorIndicatorLimitInput = colorIndicatorLimitInput;
        this.showMarginCheckBox = showMarginCheckBox;
        this.showHeatmapCheckBox = showHeatmapCheckBox;
        this.smoothMarginCheckBox = smoothMarginCheckBox;
        this.fileNumberRangeInput = fileNumberRangeInput;
        this.marginLevelInput = marginLevelInput;
        this.showDayNightCheckBox = showDayNightCheckBox;
        this.cloudinessCheckBox = cloudinessCheckBox;
        this.denoiseCheckbox = denoiseCheckbox;
        this.continentsCheckbox = continentsCheckbox;
        this.additionalFileInfoButton = additionalFileInfoButton;
        this.citiesCheckbox = citiesCheckbox;
        // this.extendedFunctionality1Checkbox = extendedFunctionality1Checkbox
        this.fileSelectionManager = new FileSelectionManager(model);
    }
    /**
     * Добавляем элементам GUI обработчики событий.
     * @returns
     */
    addEventListeners() {
        var _a, _b, _c;
        if (this.view.visualizationDisplay.canvas == null) {
            return;
        }
        (_a = this.view.visualizationDisplay.canvas) === null || _a === void 0 ? void 0 : _a.addEventListener('mousedown', this.viewVisualizationDisplayCanvasMousedownEventListener);
        (_b = this.view.visualizationDisplay.canvas) === null || _b === void 0 ? void 0 : _b.addEventListener('mouseup', this.viewVisualizationDisplayCanvasMouseupEventListener);
        (_c = this.view.visualizationDisplay.canvas) === null || _c === void 0 ? void 0 : _c.addEventListener('mousemove', this.viewVisualizationDisplayCanvasMousemoveEventListener);
        this.view.visualizationDisplay.canvas.addEventListener('mouseleave', () => {
            this.moveFlag = false;
            this.showGeoinformationDataUnitInfoFlag = false;
        });
        this.view.visualizationDisplay.canvas.onwheel = (event) => {
            this.viewVisualizationDisplayCanvasWheelEventListener(event);
        };
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
            if (this.fileSelectionManager.isBusy()) { //  this.fileSelectionManager.isBusy()
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
        this.colorIndicatorLimitInput.addEventListener('input', this.colorIndicatorLimitInputInputEventListener);
        this.defaultOffsetAndSizesButton.addEventListener('click', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                return;
            }
            this.view.visualizationDisplay.makeDefaulOffsetAndtSizes(true, 0.85);
            this.visualize(true, null);
        });
        this.changeColorIndicatorCanvasVisibilityButton.addEventListener('click', () => {
            this.view.changeColorIndicatorCanvasVisibility();
            if (this.view.colorIndicatorDisplay.canvasIsVisible()) {
                this.changeColorIndicatorCanvasVisibilityButton.textContent = "Скрыть цветовую шкалу";
            }
            else {
                this.changeColorIndicatorCanvasVisibilityButton.textContent = "Показать цветовую шкалу";
            }
        });
        this.fileNumberRangeInput.addEventListener('input', () => {
            // this.model
            // .gotoCertainFile(parseInt(this.fileNumberRangeInput.value)) 
            this.fileSelectionManager.addCommand(parseInt(this.fileNumberRangeInput.value));
        });
        this.marginLevelInput.addEventListener('input', this.marginLevelInputInputEventListener);
        this.showHeatmapCheckBox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.visualize(true, null);
                this.saveOptions();
            }
        });
        this.showMarginCheckBox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.visualize(true, null);
                this.saveOptions();
            }
        });
        this.smoothMarginCheckBox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.visualize(true, null);
                this.saveOptions();
            }
        });
        this.showDayNightCheckBox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.visualize(true, null);
                this.saveOptions();
            }
        });
        this.cloudinessCheckBox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.visualize(true, null);
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
        this.continentsCheckbox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.visualize(true, null);
                this.saveOptions();
            }
        });
        this.citiesCheckbox.addEventListener('change', () => {
            if (this.fileSelectionManager.isBusy()) { // this.fileSelectionManager.isBusy()
                this.restoreOptions();
            }
            else {
                this.visualize(true, null);
                this.saveOptions();
            }
        });
        // this.extendedFunctionality1Checkbox.addEventListener('change', () => {
        // 	this.visualize(true, null)
        // })
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
    }
    visualize(rebuildFlag, mouseEvent) {
        if (rebuildFlag) {
            var startTime = performance.now();
            let time1 = performance.now();
            this.model.prepareToDrawSmoothMargin();
            let time2 = performance.now();
            // console.log(`prepareToDrawSmoothMargin() took ${(time2 - time1) / 1} milliseconds`)
            this.model.processCloudiness2();
            let time3 = performance.now();
            // console.log(`processCloudiness() took ${(time3 - time2) / 1} milliseconds`)
            this.model.getContinentsVerticesCoordinates();
            let time4 = performance.now();
            // console.log(`getContinentsVerticesCoordinates() took ${(time4 - time3) / 1} milliseconds`)
            // alert('here')
            this.view.showRebuild(this.model.geoinformationDataUnits, this.model.marginLevel, this.model.middleMarginSegments, this.model.terminatorVertices, this.model.cloudinessImageSrc, this.model.cloudinessMltRotationAngle, this.model.continentsVertices, this.model.getCities(), this.model.getTotalMltRotationAngle(), mouseEvent);
            var endTime = performance.now();
            // console.log(`visualize method took ${(endTime - startTime) / 1} milliseconds`)
        }
        else {
            this.view.showWithoutRebuild();
        }
    }
    enableAndDisableSomeGUIElements() {
        let fileType = this.model.getFileTypeFromGUI();
        this.secondForecastRadio.disabled
            = !(((fileType === null || fileType === void 0 ? void 0 : fileType.horizonSideType) == HorizonSideType.NORTH)
                && (fileType.radiationType == RadiationType.DIFFUSE));
        // this.selectDateAndTimeButton.disabled
        // 	= fileType?.castType == CastType.SECOND_FORECAST
        this.datetimeInput.disabled
            = (fileType === null || fileType === void 0 ? void 0 : fileType.castType) == CastType.SECOND_FORECAST;
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
        this.options = new Options(this.datetimeInput.value, this.model.getFileTypeFromGUI(), parseFloat(this.colorIndicatorLimitInput.value), this.showHeatmapCheckBox.checked, this.showMarginCheckBox.checked, this.smoothMarginCheckBox.checked, parseFloat(this.marginLevelInput.value), this.showDayNightCheckBox.checked, this.cloudinessCheckBox.checked, this.denoiseCheckbox.checked, this.continentsCheckbox.checked, this.citiesCheckbox.checked);
    }
    restoreOptions() {
        this.datetimeInput.value
            = this.options.datetime;
        this.restoreFileTypeOptions();
        this.colorIndicatorLimitInput.value
            = this.options.colorIndicatorLimit.toString();
        this.showHeatmapCheckBox.checked
            = this.options.showHeatmapFlag;
        this.showMarginCheckBox.checked
            = this.options.showMarginFlag;
        this.smoothMarginCheckBox.checked
            = this.options.smoothMarginFlag;
        this.marginLevelInput.value
            = this.options.marginLevel.toString();
        this.showDayNightCheckBox.checked
            = this.options.showDayNightFlag;
        this.cloudinessCheckBox.checked
            = this.options.showCloudinessFlag;
        this.denoiseCheckbox.checked
            = this.options.denoiseFlag;
        this.continentsCheckbox.checked
            = this.options.showContinentsFlag;
        this.citiesCheckbox.checked
            = this.options.showCitiesFlag;
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
}
