import * as fileUtils from '../utils/fileUtils';
import {Reporter, MutantResult, MutantStatus, SourceFile} from 'stryker-api/report';
import {StrykerOptions} from 'stryker-api/core';
import * as log4js from 'log4js';
import * as path from 'path';

const DEFAULT_BASE_FOLDER = 'reports/mutation/json';
const log = log4js.getLogger('JsonReporter');

class Export {
  constructor(public stryker_mutation_score: string) { }
}

export default class JsonReporter implements Reporter {

  private createBaseFolderTask: Promise<any>;
  private fileIOPromise: Promise<any>;

  constructor(private options: StrykerOptions) {
    this.createBaseFolderTask = fileUtils.cleanFolder(DEFAULT_BASE_FOLDER);
  }

  private writeToFile(data: any) {
    let filename = path.join(DEFAULT_BASE_FOLDER, 'report.json');
    log.info(`Writing report to file ${filename}`);
    return fileUtils.writeFile(filename, JSON.stringify(data));
  }

  onAllMutantsTested(mutantResults: MutantResult[]): void {
    let totalTests = 0;
    let mutantsKilled = 0;
    let mutantsTimedOut = 0;
    let mutantsNoCoverage = 0;
    let mutantsSurvived = 0;
    let mutantsErrored = 0;

    mutantResults.forEach(result => {
      if (result.testsRan) {
        totalTests += result.testsRan.length;
      }
      switch (result.status) {
        case MutantStatus.Killed:
          mutantsKilled++;
          break;
        case MutantStatus.TimedOut:
          mutantsTimedOut++;
          break;
        case MutantStatus.Error:
          mutantsErrored++;
          break;
        case MutantStatus.Survived:
          mutantsSurvived++;
          break;
        case MutantStatus.NoCoverage:
          mutantsNoCoverage++;
          break;
      }
    });

    let mutantsWithoutErrors = mutantResults.length - mutantsErrored;
    const mutationScoreCodebase = (((mutantsKilled + mutantsTimedOut) / mutantsWithoutErrors) * 100).toFixed(2);

    let jsonExport = new Export(mutationScoreCodebase);

    this.fileIOPromise = this.writeToFile(jsonExport);
  }

  wrapUp(): Promise<any> {
    return this.fileIOPromise;
  }
}