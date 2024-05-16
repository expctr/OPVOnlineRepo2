/* 
* В данном файле содержится реализация класса для хранения настроек пользовательского
* интерфейса.
*/

class Options {
    public datetime: string

    public fileType: FileType | null

    public colorIndicatorLimit: number

    public showHeatmapFlag: boolean

    public showMarginFlag: boolean

    public smoothMarginFlag: boolean

    public marginLevel: number

    public showDayNightFlag: boolean

    public showCloudinessFlag: boolean

    public denoiseFlag: boolean

    public showContinentsFlag: boolean

    public showCitiesFlag: boolean

    public constructor(
        datetime: string,
        fileType: FileType | null,
        colorIndicatorLimit: number,
        showHeatmapFlag: boolean,
        showMargingFlag: boolean,
        smoothMarginFlag: boolean,
        marginLevel: number,
        showDayNightFlag: boolean,
        showCloudinessFlag: boolean,
        denoiseFlag: boolean,
        showContinentsFlag: boolean,
        showCitiesFlag: boolean
    ) {
        this.datetime = datetime
        this.fileType = fileType
        this.colorIndicatorLimit = colorIndicatorLimit
        this.showHeatmapFlag = showHeatmapFlag
        this.showMarginFlag = showMargingFlag
        this.smoothMarginFlag = smoothMarginFlag
        this.marginLevel = marginLevel
        this.showDayNightFlag = showDayNightFlag
        this.showCloudinessFlag = showCloudinessFlag
        this.denoiseFlag = denoiseFlag
        this.showContinentsFlag = showContinentsFlag
        this.showCitiesFlag = showCitiesFlag
    }
}