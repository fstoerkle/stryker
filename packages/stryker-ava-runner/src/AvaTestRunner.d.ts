/// <reference types="node" />
import { EventEmitter } from 'events';
import { TestRunner, RunResult, RunnerOptions, TestResult, TestStatus } from 'stryker-api/test_runner';
import { FileDescriptor } from 'stryker-api/core';
import * as stream from "stream";
export default class AvaTestRunner extends EventEmitter implements TestRunner {
    private files;
    constructor(runnerOptions: RunnerOptions);
    filterForAvaTestFiles(files: FileDescriptor[]): FileDescriptor[];
    getAvaOutput(): stream.Readable;
    parseTapOutput(tapReadStream: stream.Readable): Promise<any>;
    mapToTestResult(tapTestResult: any, mapping: {
        tapKey: string;
        status: TestStatus;
    }): TestResult[];
    run(): Promise<RunResult>;
}
