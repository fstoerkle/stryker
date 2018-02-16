import { TestRunnerFactory } from 'stryker-api/test_runner';

import AvaTestRunner from './AvaTestRunner';

TestRunnerFactory.instance().register('ava', AvaTestRunner);
