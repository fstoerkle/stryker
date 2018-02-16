import { EventEmitter } from 'events';
import { TestRunner, RunResult, RunStatus, RunnerOptions, TestResult, TestStatus } from 'stryker-api/test_runner';
import { FileDescriptor } from 'stryker-api/core';
import * as stream from "stream";
import { readFileSync } from 'fs';

import * as execa from 'execa';
import * as TapParser from 'tap-parser';

const avaSearchPatterns = [
    'require(\'ava\')',
    'require("ava")',
    'require (\'ava\')',
    'require ("ava")'
];

function containsAvaRequire(fileContent: Buffer): boolean {
    return avaSearchPatterns.reduce((prev, current) => {
        return prev || fileContent.indexOf(current) >= 0;
    }, false);
}

export default class AvaTestRunner extends EventEmitter implements TestRunner {
    private files: FileDescriptor[];

    constructor(runnerOptions: RunnerOptions) {
        super();

        this.files = this.filterForAvaTestFiles(runnerOptions.files);
    }

    filterForAvaTestFiles(files: FileDescriptor[]): FileDescriptor[] {
        return files.filter((file) => {
            return containsAvaRequire(readFileSync(file.name));
        });
    }

    getAvaOutput(): stream.Readable {
        const testFiles = this.files.map(({ name }) => name).join(' ');

        return execa
            .shell(`ava --tap ${testFiles}`)
            .stdout;
    }

    parseTapOutput(tapReadStream: stream.Readable): Promise<any> {
        return new Promise<RunResult>((resolve) => {
            return tapReadStream.pipe(new TapParser(resolve));
        });
    }

    mapToTestResult(tapTestResult: any, mapping: { tapKey: string, status: TestStatus }): TestResult[] {
        const { tapKey, status } = mapping;
        let testResults = [];

        for (let i = 0; i < tapTestResult[tapKey]; ++i) {
            testResults.push({
                status,
                name: '?',
                timeSpentMs: 0
            });
        }

        return testResults;
    }

    async run(): Promise<RunResult> {
        const avaResultStream = this.getAvaOutput();
        const tapTestResults = await this.parseTapOutput(avaResultStream);

        const successfulTests = this.mapToTestResult(tapTestResults, { tapKey: 'pass', status: TestStatus.Success });
        const failedTests = this.mapToTestResult(tapTestResults, { tapKey: 'fail', status: TestStatus.Failed });

        return {
            status: tapTestResults.ok ? RunStatus.Complete : RunStatus.Error,
            tests: successfulTests.concat(failedTests),
            errorMessages: []
        };
    }
}
