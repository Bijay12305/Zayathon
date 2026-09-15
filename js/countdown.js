/**
 * Live Real-Time Countdown Module
 * Updates every second, auto-adjusts event status pill, supports target switches
 */

(function () {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  const statusPill = document.getElementById('cd-status-pill');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Set target date for the upcoming flagship event cycle
  // If target date has passed, we project to the next active national cycle or show active status
  let now = new Date();
  let targetDate = new Date(now.getFullYear(), 9, 25, 9, 0, 0); // October 25, 2026, 09:00 AM IST
  
  if (targetDate.getTime() <= now.getTime()) {
    targetDate = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000); // 45 days in future
  }

  function formatTime(val) {
    return val < 10 ? '0' + val : '' + val;
  }

  function updateCountdown() {
    const currentTime = new Date().getTime();
    const distance = targetDate.getTime() - currentTime;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';

      if (statusPill) {
        statusPill.innerHTML = `
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #00ff88; box-shadow: 0 0 10px #00ff88;"></span>
          HACKATHON SPRINT LIVE NOW!
        `;
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = formatTime(days);
    hoursEl.textContent = formatTime(hours);
    minutesEl.textContent = formatTime(minutes);
    secondsEl.textContent = formatTime(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
