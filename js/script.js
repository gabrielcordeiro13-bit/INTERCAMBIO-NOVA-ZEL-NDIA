const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const revealElements = document.querySelectorAll('.reveal');
const galleryItems = document.querySelectorAll('.gallery-item');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('gallery-modal');
const modalImage = document.getElementById('modal-image');
const modalCaption = document.getElementById('modal-caption');
const modalClose = document.getElementById('modal-close');
const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');

const quizData = [
  {
    question: 'Qual é a capital da Nova Zelândia?',
    options: ['Auckland', 'Wellington', 'Christchurch', 'Dunedin'],
    answer: 1,
    explanation: 'Wellington é a capital da Nova Zelândia, localizada no extremo sul da Ilha Norte.'
  },
  {
    question: 'A Nova Zelândia fica localizada em qual região do mundo?',
    options: ['Europa', 'Oceania', 'Ásia', 'América do Sul'],
    answer: 1,
    explanation: 'A Nova Zelândia faz parte da Oceania, no Pacífico Sul.'
  },
  {
    question: 'Quantas ilhas principais formam o país?',
    options: ['2', '3', '4', '5'],
    answer: 0,
    explanation: 'A Nova Zelândia é formada principalmente pela Ilha Norte e pela Ilha Sul.'
  },
  {
    question: 'Geraldine está localizada em qual região?',
    options: ['Auckland', 'Canterbury', 'Otago', 'Waikato'],
    answer: 1,
    explanation: 'Geraldine fica na região de Canterbury, na Ilha Sul.'
  },
  {
    question: 'Qual esporte é muito popular na Nova Zelândia?',
    options: ['Ténis', 'Rugby', 'Vôlei', 'Boxe'],
    answer: 1,
    explanation: 'O rugby é um dos esportes mais importantes e populares na Nova Zelândia.'
  },
  {
    question: 'Qual característica é comum nas paisagens da região de Canterbury?',
    options: ['Deserto muito seco e montanhas', 'Florestas tropicais densas', 'Paisagens de montanhas, vales e rios', 'Ilhas vulcânicas em ambiente tropical'],
    answer: 2,
    explanation: 'Canterbury é conhecida por montanhas, vales, rios e paisagens naturais muito diversas.'
  },
  {
    question: 'O que é um aspecto importante da sustentabilidade na Nova Zelândia?',
    options: ['Ignorar a natureza', 'Valorizar a preservação ambiental', 'Aumentar o consumo sem controle', 'Proteger apenas áreas urbanas'],
    answer: 1,
    explanation: 'A preservação ambiental e o uso consciente dos recursos são temas muito importantes no país.'
  },
  {
    question: 'Qual destas palavras melhor descreve a relação entre a natureza e a vida local?',
    options: ['Distante e irrelevante', 'Presença constante e muito valorizada', 'Exclusiva da cidade', 'Somente para turismo'],
    answer: 1,
    explanation: 'A natureza tem um papel muito forte na cultura, rotina e qualidade de vida na Nova Zelândia.'
  },
  {
    question: 'Por que o intercâmbio pode ser importante para o desenvolvimento pessoal?',
    options: ['Porque impede o aprendizado', 'Porque cria uma experiência de adaptação e crescimento', 'Porque substitui a escola', 'Porque elimina a necessidade de estudar'],
    answer: 1,
    explanation: 'O intercâmbio pode proporcionar adaptação, convivência com outra cultura e crescimento pessoal.'
  },
  {
    question: 'Qual é a melhor forma de usar este site para personalizar sua própria história?',
    options: ['Não editar nada', 'Substituir os textos de exemplo pelos seus dados reais', 'Copiar textos aleatórios', 'Remover todas as seções'],
    answer: 1,
    explanation: 'A melhor forma é adaptar os textos, imagens e detalhes para refletir sua experiência de forma real e pessoal.'
  }
];

const quizState = {
  currentQuestion: 0,
  score: 0,
  selectedAnswer: null
};

const questionEl = document.getElementById('quiz-question');
const optionsEl = document.getElementById('quiz-options');
const feedbackEl = document.getElementById('quiz-feedback');
const progressEl = document.getElementById('quiz-progress');
const nextButton = document.getElementById('quiz-next');

function onScrollHeader() {
  if (window.scrollY > 20) {
    header.classList.add('is-scrolled');
  } else {
    header.classList.remove('is-scrolled');
  }
}

function setActiveNavLink() {
  const sections = document.querySelectorAll('main section[id]');

  let currentId = 'inicio';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 180 && rect.bottom >= 180) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${currentId}`;
    link.classList.toggle('active', isActive);
  });
}

function toggleMenu() {
  const isOpen = navMenu.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
}

function closeMenu() {
  navMenu.classList.remove('is-open');
  navToggle.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

function revealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function setGalleryItems() {
  const items = Array.from(galleryItems);
  items.forEach((item) => {
    const source = item.querySelector('img').src;
    item.dataset.src = source;
    item.dataset.caption = item.querySelector('figcaption').textContent.trim();
  });
}

function openModal(index) {
  const items = Array.from(galleryItems).filter((item) => !item.classList.contains('hidden'));
  if (!items.length) {
    return;
  }

  let activeIndex = index;
  if (activeIndex < 0) {
    activeIndex = items.length - 1;
  }
  if (activeIndex >= items.length) {
    activeIndex = 0;
  }

  const item = items[activeIndex];
  modalImage.src = item.dataset.src;
  modalImage.alt = item.querySelector('img').alt;
  modalCaption.textContent = item.dataset.caption;
  modal.dataset.currentIndex = String(activeIndex);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

function changeModal(direction) {
  const visibleItems = Array.from(galleryItems).filter((item) => !item.classList.contains('hidden'));
  const currentIndex = Number(modal.dataset.currentIndex || 0);
  const nextIndex = currentIndex + direction;
  openModal(nextIndex >= 0 ? nextIndex : visibleItems.length - 1);
}

function filterGallery(filter) {
  galleryItems.forEach((item) => {
    const matches = filter === 'all' || item.dataset.category === filter;
    item.classList.toggle('hidden', !matches);
  });

  const visibleItems = Array.from(galleryItems).filter((item) => !item.classList.contains('hidden'));
  if (visibleItems.length) {
    openModal(0);
    closeModal();
  }
}

function renderQuiz() {
  const current = quizData[quizState.currentQuestion];
  const questionNumber = quizState.currentQuestion + 1;

  progressEl.textContent = `Pergunta ${questionNumber} de ${quizData.length}`;
  questionEl.textContent = current.question;
  feedbackEl.textContent = '';
  feedbackEl.style.background = 'rgba(77, 142, 199, 0.08)';
  optionsEl.innerHTML = '';

  current.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-option';
    button.textContent = option;
    button.setAttribute('aria-pressed', 'false');

    if (quizState.selectedAnswer === index) {
      button.classList.add('selected');
    }

    button.addEventListener('click', () => {
      if (quizState.selectedAnswer !== null) {
        return;
      }

      quizState.selectedAnswer = index;
      const isCorrect = index === current.answer;

      Array.from(optionsEl.children).forEach((item, idx) => {
        item.classList.remove('selected');
        item.setAttribute('aria-pressed', 'false');
        if (idx === current.answer) {
          item.classList.add('correct');
        }
        if (idx === index && !isCorrect) {
          item.classList.add('incorrect');
        }
      });

      button.classList.add(isCorrect ? 'correct' : 'incorrect');
      button.setAttribute('aria-pressed', 'true');

      if (isCorrect) {
        quizState.score += 1;
      }

      feedbackEl.textContent = isCorrect
        ? `Correto! ${current.explanation}`
        : `Incorreto! ${current.explanation}`;
      feedbackEl.style.background = isCorrect ? 'rgba(46, 159, 105, 0.08)' : 'rgba(209, 89, 89, 0.08)';
      nextButton.textContent = quizState.currentQuestion === quizData.length - 1 ? 'Ver resultado' : 'Próxima';
    });

    optionsEl.appendChild(button);
  });
}

function showFinalResult() {
  const percentage = Math.round((quizState.score / quizData.length) * 100);

  questionEl.textContent = `Você acertou ${quizState.score} de ${quizData.length}!`;
  optionsEl.innerHTML = '';
  progressEl.textContent = 'Resultado final';
  nextButton.textContent = 'Jogar novamente';

  let message = 'Boa tentativa! Que tal explorar novamente o site?';
  if (percentage >= 90) {
    message = 'Excelente! Você conhece muito bem a Nova Zelândia!';
  } else if (percentage >= 60) {
    message = 'Muito bem! Você já conhece bastante sobre o país.';
  }

  feedbackEl.textContent = `${message} Sua pontuação foi ${percentage}%.`;
  feedbackEl.style.background = 'rgba(27, 111, 95, 0.08)';
}

function nextQuizStep() {
  if (quizState.currentQuestion >= quizData.length) {
    resetQuiz();
    return;
  }

  if (quizState.selectedAnswer === null) {
    feedbackEl.textContent = 'Selecione uma alternativa antes de continuar.';
    feedbackEl.style.background = 'rgba(209, 89, 89, 0.08)';
    return;
  }

  if (quizState.currentQuestion < quizData.length - 1) {
    quizState.currentQuestion += 1;
    quizState.selectedAnswer = null;
    renderQuiz();
    return;
  }

  showFinalResult();
  quizState.currentQuestion = quizData.length;
}

function resetQuiz() {
  quizState.currentQuestion = 0;
  quizState.score = 0;
  quizState.selectedAnswer = null;
  nextButton.textContent = 'Próxima';
  feedbackEl.textContent = '';
  renderQuiz();
}

navToggle.addEventListener('click', toggleMenu);
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 760) {
      closeMenu();
    }
  });
});

window.addEventListener('scroll', () => {
  onScrollHeader();
  setActiveNavLink();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

revealOnScroll();
setGalleryItems();

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    filterGallery(button.dataset.filter);
  });
});

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openModal(index));
  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(index);
    }
  });
});

modalClose.addEventListener('click', closeModal);
modalPrev.addEventListener('click', () => changeModal(-1));
modalNext.addEventListener('click', () => changeModal(1));

window.addEventListener('keydown', (event) => {
  if (!modal.classList.contains('is-open')) {
    return;
  }

  if (event.key === 'Escape') {
    closeModal();
  }

  if (event.key === 'ArrowRight') {
    changeModal(1);
  }

  if (event.key === 'ArrowLeft') {
    changeModal(-1);
  }
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

nextButton.addEventListener('click', () => {
  if (quizState.currentQuestion >= quizData.length) {
    resetQuiz();
    return;
  }

  nextQuizStep();
});

nextButton.addEventListener('dblclick', (event) => {
  event.preventDefault();
});

renderQuiz();
setActiveNavLink();
