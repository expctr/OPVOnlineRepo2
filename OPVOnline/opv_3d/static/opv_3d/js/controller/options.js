"use strict";
/*
 * В данном файле содержится класс для хранения настроек пользовательского интерфейса.
 */
class Options {
    // public showContinentsFlag: boolean
    // public showCitiesFlag: boolean 
    constructor(datetime, fileType, colorIndicatorLimit, showHeatmapFlag, showMargingFlag, smoothMarginFlag, marginLevel, showDayNightFlag, 
    // showCloudinessFlag: boolean,
    denoiseFlag) {
        this.datetime = datetime;
        this.fileType = fileType;
        this.colorIndicatorLimit = colorIndicatorLimit;
        this.showHeatmapFlag = showHeatmapFlag;
        this.showMarginFlag = showMargingFlag;
        this.smoothMarginFlag = smoothMarginFlag;
        this.marginLevel = marginLevel;
        this.showDayNightFlag = showDayNightFlag;
        // this.showCloudinessFlag = showCloudinessFlag
        this.denoiseFlag = denoiseFlag;
        // this.showContinentsFlag = showContinentsFlag
        // this.showCitiesFlag = showCitiesFlag
    }
}
