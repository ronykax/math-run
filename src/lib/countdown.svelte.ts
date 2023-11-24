export function createCountdown(interval: number, startAt: number) {
  let running = $state(false);
  let time = $state(startAt);

  let intervalId = 0;

  $effect(() => {
    if (running) {
      intervalId = setInterval(() => time--, interval);
    }
  });

  const start = () => {
    running = true;
  }

  const stop = () => {
    running = false;
    clearInterval(intervalId);
  }

  const edit = (value: Countdown) => {
    time = value;
  }

  const clear = () => {
    running = false;
    clearInterval(intervalId);
  }

  return { start, stop, edit, clear, get time() { return time }, get running() { return running } }
}
