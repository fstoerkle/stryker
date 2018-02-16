import { EventEmitter } from 'events';
import { TestRunner, RunResult, RunStatus } from 'stryker-api/test_runner';

export default class AvaTestRunner extends EventEmitter implements TestRunner {
    run(): Promise<RunResult> {
        return new Promise<RunResult>((resolve, reject) => {
            const runResult = {
                status: RunStatus.Error,
                tests: [],
                errorMessages: []
            };

            resolve(runResult);
        });
    }
}
