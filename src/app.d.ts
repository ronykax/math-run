type Mode = "Clock" | "Timer";
type TotalIndex = 10 | 20 | 30;
type Countdown = 5 | 15 | 30;

// interface Problem {
//   num1: number;
//   op: string;
//   num2: number;
// }

interface Problem {
  num1: number;
  op: "+" | "-" | "*" | "/";
  num2: number;
}

// // See https://kit.svelte.dev/docs/types#app
// // for information about these interfaces
// declare global {
// 	namespace App {
// 		// interface Error {}
// 		// interface Locals {}
// 		// interface PageData {}
// 		// interface Platform {}
// 	}
// }

// export {};
