/*
 * Это главный файл, который отвечает за работу страницы 3D визуализации.
 */

window.onload = () => {
    let marksCheckbox = <HTMLInputElement>document.getElementById('marks-checkbox')

    let northRadio = <HTMLInputElement>document.getElementById('north-radio')

    let southRadio = <HTMLInputElement>document.getElementById('south-radio')

    let forecastRadio = <HTMLInputElement>document.getElementById('forecast-radio')

    let nowcastRadio = <HTMLInputElement>document.getElementById('nowcast-radio')

    let diffuseRadio = <HTMLInputElement>document.getElementById('diffuse-radio')

    let ionsRadio = <HTMLInputElement>document.getElementById('ions-radio')

    let monoRadio = <HTMLInputElement>document.getElementById('mono-radio')

    let waveRadio = <HTMLInputElement>document.getElementById('wave-radio')

    let totalRadio = <HTMLInputElement>document.getElementById('total-radio')

    let showMarksCheckbox = <HTMLInputElement>document.getElementById('marks-checkbox')

    let showMarginCheckbox
        = <HTMLInputElement>document.getElementById('show-margin-checkbox')

    let showDayNightCheckbox
        = <HTMLInputElement>document.getElementById('show-day-night-checkbox')

    let denoiseCheckbox = <HTMLInputElement>document.getElementById('denoise-checkbox')

    let colorIndicatorLimitInput = <HTMLInputElement>document.getElementById('color-indicator-limit-input')

    let marginLevelInput = <HTMLInputElement>document.getElementById('margin-level-input')

    let showHeatmapCheckbox = <HTMLInputElement>document.getElementById('show-heatmap-checkbox')

    let smoothMarginCheckbox = <HTMLInputElement>document.getElementById('smooth-margin-checkbox')

    northRadio.checked = true
    nowcastRadio.checked = true
    totalRadio.checked = true
    showMarginCheckbox.checked = true
    showDayNightCheckbox.checked = true
    denoiseCheckbox.checked = true
    showHeatmapCheckbox.checked = true
    smoothMarginCheckbox.checked = true

    showMarksCheckbox.style.display = 'none'

    let view = new View()
    let model = new Model(view)
    let controller = new Controller(model, view)

    colorIndicatorLimitInput.value = OvationPrimeData3DUnit.maxValue.toString()
    marginLevelInput.value = model.marginLevel.toString()

    // model.getCertainFileData()
    view.changeColorIndicatorCanvasVisibility()
    view.adjustCamera()
    model.getFilesNumberAndLastFileData()
    controller.addEventListeners()

    let fileNumberLabel = <HTMLLabelElement>document.getElementById("file-number-label")
    let fromLabel = <HTMLLabelElement>document.getElementById("from-label")
    let fileNameLabel = <HTMLLabelElement>document.getElementById("file-name-label")
    let currentFileNumberInput = <HTMLInputElement>document.getElementById('current-file-number-input')
    let filesNumberInput = <HTMLInputElement>document.getElementById('files-number-input')
    let fileNameInput = <HTMLInputElement>document.getElementById('file-name-input')
    let gotoFileButton = <HTMLButtonElement>document.getElementById('go-to-certain-file-button')
    let gotoCertainFileInput = <HTMLInputElement>document.getElementById('go-to-certain-file-input')

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