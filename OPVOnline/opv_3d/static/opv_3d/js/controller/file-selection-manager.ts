/*
 * В данном файле содержится реализация класса для управления выбором файлов.
 */

class FileSelectionManager {
    private readonly model: Model

    private commands: number[] = []

    public constructor(model: Model) {
        this.model = model
    }

    public addCommand(fileNumber: number): void {
        this.commands.push(fileNumber)
    }

    private executeCommand(): void {
        // console.log("executeCommand")

        if (this.commands.length > 0) {
            // console.log("execute")

            let lastFileNumber = this.commands[this.commands.length - 1]
            this.commands = []

            this.model.gotoCertainFile(lastFileNumber)
        }

        this.run()
    }

    public run(): void {
        setTimeout(() => {
            this.executeCommand()
        },
            500);
    }

    public isBusy(): boolean {
        return this.commands.length > 0
    }
}