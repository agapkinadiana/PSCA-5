const writeFile = require('fs').writeFileSync; 
const COMMANDS_FILE_PATH = __dirname + '/cli-commands.json';

class CliCommand {
    getMetadata() {
        if (!this.metadata) {
            this.metadata = require('./cli-commands');
        }
        return this.metadata;
    }

    print(text) {
        process.stdout.write(text);
    }

    updateMetadata(newTask, remove = false, hardRemove = false) {
        if (!this.getMetadata().processedTasks.includes(newTask)) {
            this.getMetadata().processedTasks.push(newTask);
        } else if (remove) {
            this.getMetadata().processedTasks.splice(this.getMetadata().processedTasks.indexOf(newTask), 1);
        } else if (hardRemove) {
            this.getMetadata().processedTasks = [];
        }
        writeFile(COMMANDS_FILE_PATH, JSON.stringify(this.getMetadata(), null, '  '));
    }

    listen(db) {
        let input = process.stdin;
        let abortTimer = undefined;
        let commitTimer = undefined;
        let statsTimer = undefined;
        input.setEncoding('utf-8');
        this.print('> ');

        input.on('data', data => {
            data = data.slice(0, -1);
            let parameters = data.split(' ');
            let command = parameters[0];
            let estimate = parseInt(parameters[1]);

            if (this.getMetadata().available.includes(command)) {
                switch (command) {
                    case 'sd':
                        if (this.getMetadata().processedTasks.includes(this.getMetadata().available[0])) {
                            clearTimeout(abortTimer);
                        }
                        if (!isNaN(estimate)) {
                            this.print('Program will shut down after ' + estimate + ' seconds\n');
                            abortTimer = setTimeout(() => {
                                if (commitTimer) {
                                    commitTimer.unref();
                                }
                                if (statsTimer) {
                                    statsTimer.unref();
                                }
                                this.updateMetadata(command, undefined, true);
                                process.exit(1);
                            }, estimate * 1000);
                            this.updateMetadata(command);
                        } else {
                            this.print('Shutting down has been aborted\n');
                            this.updateMetadata(command, true);
                        }
                        break;
                    case 'sc':
                        if (this.getMetadata().processedTasks.includes(this.getMetadata().available[1])) {
                            clearInterval(commitTimer);
                        }
                        if (!isNaN(estimate)) {
                            this.print('Db will commit changes every ' + estimate + ' seconds\n');
                            commitTimer = setInterval(() => {
                                db.emit('COMMIT');
                                this.print('> ');
                            }, estimate * 1000);
                            this.updateMetadata(command);
                        } else {
                            this.print('Interval db fixation has been aborted\n');
                            this.updateMetadata(command, true);
                        }
                        break;
                    case 'ss':
                        if (this.getMetadata().processedTasks.includes(this.getMetadata().available[2])) {
                            clearTimeout(statsTimer);
                        }
                        if (!isNaN(estimate)) {
                            this.print('Retrieving statistics while ' + estimate + ' seconds...\n');
                            db.startTrackStats();
                            statsTimer = setTimeout(() => {
                                db.closeStatsTracking();
                                this.print('You can find fresh stats in the statistics.json\n> ');
                                this.updateMetadata(command, true);
                            }, estimate * 1000);
                            this.updateMetadata(command);
                        } else {
                            this.print('Statistics retrieving has been stopped\n');
                            this.updateMetadata(command, true);
                        }
                        break;
                }
            }
            this.print('> ');
        });
    }
}

module.exports = CliCommand;

