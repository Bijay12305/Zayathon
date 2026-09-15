/**
 * Hackathon Timeline & Hour-by-Hour Schedule Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = document.querySelectorAll('.timeline-tab-btn');
  const roadmapView = document.getElementById('view-roadmap');
  const day1View = document.getElementById('view-day1');
  const day2View = document.getElementById('view-day2');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-tab');

      if (target === 'roadmap') {
        if (roadmapView) roadmapView.style.display = 'grid';
        if (day1View) day1View.classList.remove('active');
        if (day2View) day2View.classList.remove('active');
      } else if (target === 'day1') {
        if (roadmapView) roadmapView.style.display = 'none';
        if (day1View) day1View.classList.add('active');
        if (day2View) day2View.classList.remove('active');
      } else if (target === 'day2') {
        if (roadmapView) roadmapView.style.display = 'none';
        if (day1View) day1View.classList.remove('active');
        if (day2View) day2View.classList.add('active');
      }
    });
  });
});
