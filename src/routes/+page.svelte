<script lang="ts">
  import { onMount } from "svelte";
  import { createTimer } from "$lib/timer.svelte";
  import { createCountdown } from "$lib/countdown.svelte";
  import problemsJSON from "../problemsJSON.json";

  let loading = $state(true);
  let modeTimer = $state(false);
  
  let problems = $state<Problem[]>([]);
  let totalIndex = $state<TotalIndex>(30);
  let countdown = $state<Countdown>(30);

  let answer = $state("");
  let index = $state(0);
  let solved = $state(0);
  let finished = $state(false);

  onMount(() => {
    function pickProblems() {
      return problemsJSON as Problem[];
    }

    problems = pickProblems();
  });

  onMount(() => {
    if (window.localStorage) {      
      const defaultModeTimer = localStorage.getItem("mode");
      const defaultIndex = localStorage.getItem("index");
      const defaultCountdown = localStorage.getItem("countdown");
  
      if (defaultModeTimer) {
        modeTimer = JSON.parse(defaultModeTimer);
      }
      
      if (defaultIndex) {
        totalIndex = JSON.parse(defaultIndex) as TotalIndex;
      }
      
      if (defaultCountdown) {
        countdown = JSON.parse(defaultCountdown) as Countdown;
      }
    }

    loading = false;
  });

  $effect(() => {
    if (window.localStorage) {
      localStorage.setItem("mode", JSON.stringify(modeTimer));
      localStorage.setItem("index", JSON.stringify(totalIndex));
      localStorage.setItem("countdown", JSON.stringify(countdown));
    }
  });

  $effect(() => {
    if (countdownObj.time <= 0) {
      finished = true;
    }
  });

  function getCountdown() {
    return { get countdown() { return countdown } }
  }

  const timerObj = createTimer(1000);
  const countdownObj = createCountdown(1000, getCountdown().countdown);

  function changeMode() {
    modeTimer = !modeTimer;
    answer = "";

    timerObj.clear();
    countdownObj.clear();
  }

  function changeIndex(newValue: TotalIndex) {
    if (timerObj.running) return;
    
    totalIndex = newValue;
  }

  function changeCountdown(newValue: Countdown) {
    if (countdownObj.running) return;

    countdown = newValue;
    countdownObj.edit(newValue);
  }

  function checkAnswer(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if (modeTimer && !countdownObj.running) {
      countdownObj.start();
    } else if (!modeTimer && !timerObj.running) {
      timerObj.start();
    }

    const { num1, op, num2 } = problems[index];
    const result = eval(`${num1}${op}${num2}`);

    if (parseInt(value) === result) {
      answer = "";

      let total = modeTimer ? 9999 : totalIndex;
      
      if (index + 1 >= total) {
        finished = true;
        modeTimer ? countdownObj.stop() : timerObj.stop();
      } else {
        index++;

        if (modeTimer) {
          solved++;
        }
      }
    }
  }
</script>

{#if loading || problems.length === 0}
  <main class="flex justify-center items-center h-[100svh]">
    <h1 class="text-white text-opacity-80">Loading...</h1>
  </main>
{:else}
  <main class="flex justify-center items-center h-[100svh]">
    <div class="fixed flex flex-col items-center px-3 py-2 bg-white rounded-md top-7 bg-opacity-7">
      <div class="flex">
        {#if modeTimer}
          <button class="pb-1 pr-3 text-white text-opacity-60 hover:text-opacity-90" on:click={changeMode}>Clock</button>
          <button class="pb-1 pl-3">Timer</button>
        {:else}
          <button class="pb-1 pr-3">Clock</button>
          <button class="pb-1 pl-3 text-white text-opacity-60 hover:text-opacity-90" on:click={changeMode}>Timer</button>
        {/if}
      </div>
      <div class="flex">
        {#if modeTimer}
          {#if countdown === 30}
            <button on:click={() => changeCountdown(5)} class="pt-1 pr-3 text-white text-opacity-60 hover:text-opacity-90">5</button>
            <button on:click={() => changeCountdown(15)} class="px-3 pt-1 text-white text-opacity-60 hover:text-opacity-90">15</button>
            <button class="pt-1 pl-3">30</button>
          {:else if countdown === 15}
            <button on:click={() => changeCountdown(5)} class="pt-1 pr-3 text-white text-opacity-60 hover:text-opacity-90">5</button>
            <button class="px-3 pt-1">15</button>
            <button on:click={() => changeCountdown(30)} class="pt-1 pl-3 text-white text-opacity-60 hover:text-opacity-90">30</button>
          {:else if countdown === 5}
            <button class="pt-1 pr-3">5</button>
            <button on:click={() => changeCountdown(15)} class="px-3 pt-1 text-white text-opacity-60 hover:text-opacity-90">15</button>
            <button on:click={() => changeCountdown(30)} class="pt-1 pl-3 text-white text-opacity-60 hover:text-opacity-90">30</button>
          {/if}
        {:else}
          {#if totalIndex === 30}
            <button on:click={() => changeIndex(10)} class="pt-1 pr-3 text-white text-opacity-60 hover:text-opacity-90">10</button>
            <button on:click={() => changeIndex(20)} class="px-3 pt-1 text-white text-opacity-60 hover:text-opacity-90">20</button>
            <button class="pt-1 pl-3">30</button>
          {:else if totalIndex === 20}
            <button on:click={() => changeIndex(10)} class="pt-1 pr-3 text-white text-opacity-60 hover:text-opacity-90">10</button>
            <button class="px-3 pt-1">20</button>
            <button on:click={() => changeIndex(30)} class="pt-1 pl-3 text-white text-opacity-60 hover:text-opacity-90">30</button>
          {:else if totalIndex === 10}
            <button class="pt-1 pr-3">10</button>
            <button on:click={() => changeIndex(20)} class="px-3 pt-1 text-white text-opacity-60 hover:text-opacity-90">20</button>
            <button on:click={() => changeIndex(30)} class="pt-1 pl-3 text-white text-opacity-60 hover:text-opacity-90">30</button>
          {/if}
        {/if}
      </div>
    </div>
    <div class="flex flex-col items-center gap-3 text-7xl">
      <h1 class="tracking-widest text-right">{problems[index].num1} <br>{problems[index].op.replace("*", "×").replace("/", "÷")} {problems[index].num2}</h1>
      <input class="w-40 px-1 tracking-widest text-right bg-white border-b-2 border-white border-opacity-75 rounded-md cursor-pointer unsmooth bg-opacity-7 caret-transparent focus:outline-none focus:border-opacity-100 placeholder:text-white placeholder:text-opacity-50" type="text" maxlength="3" autocomplete="off" placeholder="{(index + 1).toString().padStart(2, "0")}" bind:value={answer} on:input={checkAnswer}>
      <h1 class="text-lg text-white text-opacity-60">
        {#if modeTimer}
          {countdownObj.running ? countdownObj.time : countdown} second{countdownObj.time === 1 ? "" : "s"}
        {:else}
          {timerObj.time} second{timerObj.time === 1 ? "" : "s"}
        {/if}
      </h1>
    </div>
  </main>
{/if}
