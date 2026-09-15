/**
 * Accessible FAQ Accordion & Live Real-Time Search Filter
 */

document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faq-search-input');
  const noResultsEl = document.getElementById('faq-no-results');

  // Accordion click & keyboard interaction
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer-body');

    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items for a clean single-open accordion feel
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          const otherAnswer = otherItem.querySelector('.faq-answer-body');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      }
    });
  });

  // Real-Time Live Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let matchCount = 0;

      faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-question-text')?.textContent.toLowerCase() || '';
        const answerText = item.querySelector('.faq-answer-inner')?.textContent.toLowerCase() || '';

        if (questionText.includes(query) || answerText.includes(query)) {
          item.style.display = 'block';
          matchCount++;
        } else {
          item.style.display = 'none';
        }
      });

      if (noResultsEl) {
        noResultsEl.style.display = matchCount === 0 ? 'block' : 'none';
      }
    });
  }
});
