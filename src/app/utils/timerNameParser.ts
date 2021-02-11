const isValidMobtimeUrl = (url: string) => 
url.match(/\:\/\/(mobti.me|mobtime.vehikl.com)\//);

export const parseMobTimeName = (value: string) => {
  if (value.length) {
    let name = value;
    if (isValidMobtimeUrl(value)) {
      const url = new URL(value);
      name = url.pathname;
    }
    return name.match(/[\w\d._ -]/g)?.join('') || '';
  }
  return '';
};