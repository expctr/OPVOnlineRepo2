/*
 * В данном файле содержится реализация класса для управления рисованием.
 */

class DrawingManager {
    view: View

    commands: DrawingCommand[] = []

    public constructor(view: View) {
        this.view = view
    }

    public addCommand(drawingCommand: DrawingCommand): void {
        // console.log("DrawingManager. addCommand()")
        this.commands.push(drawingCommand)
    }

    private executeCommand(): void {
        // console.log("executeCommand")

        if (this.commands.length == 0) {
            // console.log("executeCommand. instant return")
            this.run()
            return
        }

        let command = this.commands[this.commands.length - 1]

        if (command.rebuildFlag
            && this.view.cloudinessCheckBox.checked
            && !command.imageLoadedFlag) {
            this.run()
            return
        }

        this.commands = []

        if (command.rebuildFlag) {
            this.view.drawRebuild(
                command.geoinformationDataUnits,
                command.marginLevel,
                command.middleMarginSegments,
                command.terminatorVertices,
                command.cloudinessImage,
                command.cloudinessMltRotationAngle,
                command.continentsVertices,
                command.cities,
                command.totalMltRotationAngle,
                command.mouseEvent,
                command
            )
        } else {
            this.view.drawWithoutRebuild()
        }

        this.run()
    }

    public run(): void {
        setTimeout(() => {
            this.executeCommand()
        },
            100);
    }
}