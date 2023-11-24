export function createTimer(interval: number) {
  let running = $state(false);
  let time = $state(0);

  let intervalId = 0;

  $effect(() => {
    if (running) {
      intervalId = setInterval(() => time++, interval);
    }
  });

  const start = () => {
    running = true;
  }

  const stop = () => {
    running = false;
    clearInterval(intervalId);
  }

  const clear = () => {
    time = 0;
    running = false;
    clearInterval(intervalId);
  }
  
  return { start, stop, clear, get time() { return time }, get running() { return running } }
}
