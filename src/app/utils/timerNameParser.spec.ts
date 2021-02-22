import { parseMobTimeName } from "./timerNameParser";

describe('timerNameParser', () => {
  it.each([
    ['test', {name: 'test', server: undefined} ],
    ['test#&', {name: 'test', server: undefined} ],
    ['123-test', {name: '123-test', server: undefined} ],
    ['te-st.te_st', {name: 'te-st.te_st', server: undefined} ],
    ['https://mobtime.vehikl.com/test', {name: 'test', server: 'https://mobtime.vehikl.com'} ],
    ['https://mobtime.vehikl.com/////134324', {name: '134324', server: 'https://mobtime.vehikl.com'} ],
    ['https://mobti.me/test-test', {name: 'test-test', server: 'https://mobti.me'} ],
    ['https://www.npmjs.com/package', {name: 'package', server: 'https://www.npmjs.com' }]
  ])('shoud parse timer name from %s to %s', (value, expected) => {
    expect(parseMobTimeName(value)).toStrictEqual(expected);
  });
});