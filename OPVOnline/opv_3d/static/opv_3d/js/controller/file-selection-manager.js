"use strict";
/*
 * В данном файле содержится реализация класса для управления выбором файлов.
 */
class FileSelectionManager {
    constructor(model) {
        this.commands = [];
        this.model = model;
    }
    addCommand(fileNumber) {
        this.commands.push(fileNumber);
    }
    executeCommand() {
        // console.log("executeCommand")
        if (this.commands.length > 0) {
            // console.log("execute")
            let lastFileNumber = this.commands[this.commands.length - 1];
            this.commands = [];
            this.model.gotoCertainFile(lastFileNumber);
        }
        this.run();
    }
    run() {
        setTimeout(() => {
            this.executeCommand();
        }, 500);
    }
    isBusy() {
        return this.commands.length > 0;
    }
}
