"use strict";
window.onload = () => {
    /*
 * В данном файле содержится скрипт, запускающий программу.
 */
    /**
     * Текстовое поле с номером текущего файла.
     */
    let currentFileNumberInput = document.getElementById('current-file-number-input');
    /**
     * Текствое поле с общим числом файлов выбранного типа.
     */
    let filesNumberInput = document.getElementById('files-number-input');
    /**
     * Текстовое поле с именем текущего файла.
     */
    let fileNameInput = document.getElementById('file-name-input');
    /**
     * Кнопка "Предыдущий файл".
     */
    let gotoPreviousFileButton = document.getElementById('go-to-previous-file-button');
    /**
     * Кнопка "Следующий файл".
     */
    let gotoNextFileButton = document.getElementById('go-to-next-file-button');
    /**
     * Кнопка "Перейти к файлу".
     */
    let gotoFileButton = document.getElementById('go-to-certain-file-button');
    /**
     * Текстовое поле для отоборажения номера файла,
     * к которому нужно перейти.
     */
    let gotoCertainFileInput = document.getElementById('go-to-certain-file-input');
    /**
     *  Календарь с датой и времененем текущего файла.
     */
    let datetimeInput = document.getElementById('datetime-input');
    /**
     * Кнопка "Выбрать дату и время".
     */
    // let selectDateAndTimeButton = <HTMLButtonElement>document.getElementById('go-to-file-by-datetime')
    /**
     * Холст для визуализации.
     */
    let visualizationCanvas = document.getElementById('visualization-canvas');
    /**
     * Холст для отображения цветовой шкалы.
     */
    let colorIndicatorCanvas = document.getElementById('color-indicator-canvas');
    /**
     * Кнопка "Сдвиг и размер по умолчанию".
     */
    let defaultOffsetAndSizesButton = document.getElementById('default-offset-and-sizes-button');
    let changeColorIndicatorCanvasVisibilityButton = document.getElementById('change-color-indicator-visibility-button');
    /**
     * Флажок для выбора северной полусферы.
     */
    let northRadio = document.getElementById('north-radio');
    /**
     * Флажок для выбора южной полусферы.
     */
    let southRadio = document.getElementById('south-radio');
    /**
     * Флажок для выбора прогноза.
     */
    let forecastRadio = document.getElementById('forecast-radio');
    /**
     * Флажок для выбора наблюдаемых данных.
     */
    let nowcastRadio = document.getElementById('nowcast-radio');
    let secondForecastRadio = document.getElementById('second-forecast-radio');
    /**
     * Флажок для выбора вклада рассеянного сияния.
     */
    let diffuseRadio = document.getElementById('diffuse-radio');
    /**
     * Флажок для выбора вклада ионов.
     */
    let ionsRadio = document.getElementById('ions-radio');
    /**
     * Флажок для выбора вклада моноэнергетических пиков.
     */
    let monoRadio = document.getElementById('mono-radio');
    /**
     * Флажок для выбора вклада "broadband" ускорения.
     */
    let waveRadio = document.getElementById('wave-radio');
    /**
     * Флажок для выбора данных об общем вкладе авроральных компонент.
     */
    let totalRadio = document.getElementById('total-radio');
    /**
     * Текстовое поле для отображения предельного значения цветовой шкалы.
     */
    let colorIndicatorLimitInput = document.getElementById('color-indicator-limit-input');
    /**
     * Ползунок для выбора номера файла.
     */
    let fileNumberRangeInput = document.getElementById('file-number-range-input');
    /**
     * Текстовое поле для отображения уровня границы.
     */
    let marginLevelInput = document.getElementById('margin-level-input');
    /**
     * Флажок "Отображать тепловую карту".
     */
    let showHeatmapCheckbox = document.getElementById('show-heatmap-checkbox');
    /**
     * Флажок "Отображать границу".
     */
    let showMarginCheckbox = document.getElementById('show-margin-checkbox');
    /**
     * Флажок "Гладкая граница".
     */
    let smoothMarginCheckbox = document.getElementById('smooth-margin-checkbox');
    let showDayNightCheckbox = document.getElementById('show-day-night-checkbox');
    let cloudinessCheckBox = document.getElementById('cloudiness-checkbox');
    let denoiseCheckbox = document.getElementById('denoise-checkbox');
    let continentsCheckbox = document.getElementById('continents-checkbox');
    let additionalFileInfoButton = document.getElementById('additional-file-info-button');
    let citiesCheckbox = document.getElementById('cities-checkbox');
    let extendedFunctionality1Checkbox = document.getElementById('extended-functionality-1-checkbox');
    northRadio.checked = true;
    nowcastRadio.checked = true;
    totalRadio.checked = true;
    showHeatmapCheckbox.checked = true;
    showMarginCheckbox.checked = true;
    smoothMarginCheckbox.checked = true;
    showDayNightCheckbox.checked = true;
    // cloudinessCheckBox.checked = true
    denoiseCheckbox.checked = true;
    continentsCheckbox.checked = true;
    citiesCheckbox.checked = true;
    /**
     * Представление для паттерна MVC.
     */
    let view = new View(visualizationCanvas, 578 * 4, 461 * 4, colorIndicatorCanvas, 120 * 4, 461 * 4, showHeatmapCheckbox, showMarginCheckbox, smoothMarginCheckbox, showDayNightCheckbox, cloudinessCheckBox, continentsCheckbox);
    view.setDrawingManager();
    view.hideColorIndicatorCanvas();
    view.runDrawingManager();
    /**
     * Модель для паттерна MVC.
     */
    let model = new Model(view, currentFileNumberInput, filesNumberInput, fileNameInput, datetimeInput, northRadio, southRadio, forecastRadio, nowcastRadio, secondForecastRadio, diffuseRadio, ionsRadio, monoRadio, waveRadio, totalRadio, showDayNightCheckbox, cloudinessCheckBox, denoiseCheckbox, continentsCheckbox, fileNumberRangeInput, citiesCheckbox, extendedFunctionality1Checkbox);
    model.getFilesNumberAndLastFileData();
    /**
     * Контроллер для паттерна MVC.
     */
    let controller = new Controller(view, model, gotoPreviousFileButton, gotoNextFileButton, gotoFileButton, gotoCertainFileInput, datetimeInput, defaultOffsetAndSizesButton, changeColorIndicatorCanvasVisibilityButton, northRadio, southRadio, forecastRadio, nowcastRadio, secondForecastRadio, diffuseRadio, ionsRadio, monoRadio, waveRadio, totalRadio, colorIndicatorLimitInput, showHeatmapCheckbox, showMarginCheckbox, smoothMarginCheckbox, fileNumberRangeInput, marginLevelInput, showDayNightCheckbox, cloudinessCheckBox, denoiseCheckbox, continentsCheckbox, additionalFileInfoButton, citiesCheckbox, extendedFunctionality1Checkbox);
    controller.addEventListeners();
    colorIndicatorLimitInput.value = GeoinformationDataUnit.maxValue.toString();
    marginLevelInput.value = model.marginLevel.toString();
    let fileNumberLabel = document.getElementById("file-number-label");
    let fromLabel = document.getElementById("from-label");
    let fileNameLabel = document.getElementById("file-name-label");
    fileNumberLabel.style.display = "none";
    currentFileNumberInput.style.display = "none";
    fromLabel.style.display = "none";
    filesNumberInput.style.display = "none";
    fileNameLabel.style.display = "none";
    fileNameInput.style.display = "none";
    gotoFileButton.style.display = "none";
    gotoCertainFileInput.style.display = "none";
    controller.enableAndDisableSomeGUIElements();
};
