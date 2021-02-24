export const millisToMinutes = (time: number) => {
  const millis = time > 0 ? time - 1000 : 0;
  const minutes = Math.floor((millis) / 60000);
  const seconds = (((millis) % 60000) / 1000).toFixed(0);
  return minutes + ":" + (parseInt(seconds) < 10 ? '0' : '') + seconds;
};

