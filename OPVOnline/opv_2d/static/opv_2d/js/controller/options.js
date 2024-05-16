"use strict";
class Options {
    constructor(datetime, fileType, colorIndicatorLimit, showHeatmapFlag, showMargingFlag, smoothMarginFlag, marginLevel, showDayNightFlag, showCloudinessFlag, denoiseFlag, showContinentsFlag, showCitiesFlag) {
        this.datetime = datetime;
        this.fileType = fileType;
        this.colorIndicatorLimit = colorIndicatorLimit;
        this.showHeatmapFlag = showHeatmapFlag;
        this.showMarginFlag = showMargingFlag;
        this.smoothMarginFlag = smoothMarginFlag;
        this.marginLevel = marginLevel;
        this.showDayNightFlag = showDayNightFlag;
        this.showCloudinessFlag = showCloudinessFlag;
        this.denoiseFlag = denoiseFlag;
        this.showContinentsFlag = showContinentsFlag;
        this.showCitiesFlag = showCitiesFlag;
    }
}
