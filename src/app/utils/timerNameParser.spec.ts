import { parseMobTimeName } from "./timerNameParser";

describe('timerNameParser', () => {
  it.each([
    ['test', 'test'],
    ['test#&', 'test'],
    ['123-test', '123-test'],
    ['te-st.te_st', 'te-st.te_st'],
    ['https://mobtime.vehikl.com/test', 'test'],
    ['https://mobtime.vehikl.com/////134324', '134324'],
    ['https://mobti.me/test-test', 'test-test'],
    ['https://www.npmjs.com/package', 'httpswww.npmjs.compackage']
  ])('shoud parse timer name from %s to %s', (value, expected) => {
    expect(parseMobTimeName(value)).toBe(expected);
  });
});