import * as fs from 'fs';
import { expect } from 'chai';

import StrykerTempFolder from '../../../src/utils/StrykerTempFolder';

describe('StrykerTempFolder', () => {
  describe('copyFile regression tests', () => {
    const sourceFileContent = Buffer.from([ 0xcf, 0xfa ]);
    const sourceFile = 'testResources/binary-source';
    const destinationFile = 'testResources/binary-destination';

    beforeEach(() => {
      fs.writeFileSync(sourceFile, sourceFileContent);
    });

    afterEach(() => {
      fs.unlinkSync(sourceFile);
      fs.unlinkSync(destinationFile);
    });

    it('should not corrupt binary files', () => {
      return expect(StrykerTempFolder.copyFile(sourceFile, destinationFile, null))
        .to.be.fulfilled
        .and.then(() => {
          const destinationFileContent = fs.readFileSync(destinationFile);
          expect(destinationFileContent).to.deep.equal(sourceFileContent);
        });
    });
  });
});
