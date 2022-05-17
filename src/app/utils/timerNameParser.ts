export const parseMobTimeName = (value: string) => {
  if (value.length) {
    let name = value;
    let server;
    try {
      const url = new URL(value); 
      name = url.pathname;
      server = url.host;
    } catch (e) {
      
    }
    return { name: name.match(/[\w\d._ -]/g)?.join('') || '', server };
  }
  return { name: '' };
};