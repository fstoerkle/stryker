import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as path from 'path';

import { RunResult, RunStatus, TestResult, TestStatus } from 'stryker-api/test_runner';
import { FileKind } from 'stryker-api/core';

import AvaTestRunner from '../../src/AvaTestRunner';

chai.use(chaiAsPromised);
const expect = chai.expect;

function buildFile(relativePath: string, mutated = true) {
    return {
        name: path.resolve(__dirname, '..', '..', relativePath),
        included: true, mutated: true, transpiled: true, kind: FileKind.Text
    }
}

const countTests = (runResult: RunResult, predicate: (result: TestResult) => boolean) =>
  runResult.tests.filter(predicate).length;

const countSucceeded = (runResult: RunResult) =>
  countTests(runResult, t => t.status === TestStatus.Success);
const countFailed = (runResult: RunResult) =>
  countTests(runResult, t => t.status === TestStatus.Failed);


describe('Running a sample project', function () {

    let sut: AvaTestRunner;
    this.timeout(10000);

    describe('when tests pass', () => {

        beforeEach(() => {
            sut = new AvaTestRunner({
                files: [
                    buildFile('./testResources/sampleProject/MyMath.js'),
                    buildFile('./testResources/sampleProject/MyMathSpec.js', false)
                ],
                port: 1234,
                strykerOptions: {}
            });
        });

        it('should report completed tests', async () => {
            return expect(sut.run()).to.eventually.satisfy((runResult: RunResult) => {
                expect(countSucceeded(runResult)).to.be.eq(5, 'Succeeded tests did not match');
                expect(countFailed(runResult)).to.be.eq(0, 'Failed tests did not match');
                expect(runResult.status).to.be.eq(RunStatus.Complete, 'Test result did not match');

                return true;
            });
        });
    });
});
