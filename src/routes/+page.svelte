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

  function changeIndex(index: TotalIndex) {
    if (timerObj.running) return;
    
    totalIndex = index;
  }

  function changeCountdown(countdown_: Countdown) {
    if (countdownObj.running) return;

    countdown = countdown_;
    countdownObj.edit(countdown_);
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
      
      if (index + 1 >= totalIndex) {
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

<title>Math Run</title>

{#if loading || problems.length === 0}
  <main class="flex justify-center items-center h-[100svh]">
    <h1 class="text-white text-opacity-80">Loading...</h1>
  </main>
{:else}
  <main class="flex justify-center items-center h-[100svh]">
    <div class="fixed top-0 flex flex-col items-center justify-center w-full gap-1 py-3 text-lg bg-white md:gap-10 md:flex-row bg-opacity-7">
      <div class="flex items-center">
        {#if modeTimer}
          <button class="text-white text-opacity-60 hover:text-opacity-80" on:click={changeMode}>Clock</button>
          <span class="mx-3 text-sm text-opacity-60">•</span>
          <button>Timer</button>
        {:else}
          <button>Clock</button>
          <span class="mx-3 text-sm text-opacity-60">•</span>
          <button class="text-white text-opacity-60 hover:text-opacity-80" on:click={changeMode}>Timer</button>
        {/if}
      </div>
      <div class="flex">
        {#if modeTimer}
          {#if countdown === 5}
            <button class="px-3">5</button>
          {:else}
            <button class="px-3 text-white text-opacity-60 hover:text-opacity-80" on:click={() => changeCountdown(5)}>5</button>
          {/if}
          {#if countdown === 15}
            <button class="px-3">15</button>
          {:else}
            <button class="px-3 text-white text-opacity-60 hover:text-opacity-80" on:click={() => changeCountdown(15)}>15</button>
          {/if}
          {#if countdown === 30}
            <button class="px-3">30</button>
          {:else}
            <button class="px-3 text-white text-opacity-60 hover:text-opacity-80" on:click={() => changeCountdown(30)}>30</button>
          {/if}
        {:else}
          {#if totalIndex === 10}
            <button class="px-3">10</button>
          {:else}
            <button class="px-3 text-white text-opacity-60 hover:text-opacity-80" on:click={() => changeIndex(10)}>10</button>
          {/if}
          {#if totalIndex === 20}
            <button class="px-3">20</button>
          {:else}
            <button class="px-3 text-white text-opacity-60 hover:text-opacity-80" on:click={() => changeIndex(20)}>20</button>
          {/if}
          {#if totalIndex === 30}
            <button class="px-3">30</button>
          {:else}
            <button class="px-3 text-white text-opacity-60 hover:text-opacity-80" on:click={() => changeIndex(30)}>30</button>
          {/if}
        {/if}        
      </div>
    </div>
    <div class="flex flex-col items-center gap-3 text-7xl">
      <h1 class="tracking-widest text-right">{problems[index].num1} <br>{problems[index].op.replace("*", "×").replace("/", "÷")} {problems[index].num2}</h1>
      <input class="pb-1 tracking-widest text-right bg-white border-b-2 border-white border-opacity-75 cursor-pointer w-38 bg-opacity-7 caret-transparent focus:outline-none focus:border-opacity-100 placeholder:text-white placeholder:text-opacity-50" type="text" inputmode="numeric" maxlength="3" autocomplete="off" placeholder="{(index + 1).toString().padStart(2, "0")}" bind:value={answer} on:input={checkAnswer}>
      <h1 class="text-2xl text-white text-opacity-80">
        {#if modeTimer}
          {countdownObj.running ? countdownObj.time : countdown} second{countdownObj.time === 1 ? "" : "s"}
        {:else}
          {timerObj.time} second{timerObj.time === 1 ? "" : "s"}
        {/if}
      </h1>
    </div>
  </main>
{/if}
