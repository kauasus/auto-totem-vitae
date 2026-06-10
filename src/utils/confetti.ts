import confetti from "canvas-confetti";

/**
 * Fire tasteful confetti bursts using clinic colors.
 * Call e.g. fireConfetti() when payment is confirmed.
 */
export function fireConfetti() {
  const colors = ["#b91c1c", "#8b1212", "#f6c3c3", "#ffd700"]; // vermelho + variações + dourado

  // quick multi-burst
  confetti({
    particleCount: 40,
    spread: 70,
    origin: { y: 0.6 },
    colors,
  });

  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 100,
      origin: { y: 0.6 },
      scalar: 0.9,
      colors,
    });
  }, 250);

  setTimeout(() => {
    confetti({
      particleCount: 20,
      spread: 160,
      origin: { y: 0.6 },
      drift: 0,
      colors,
    });
  }, 500);
}
