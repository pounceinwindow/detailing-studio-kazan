const form = document.querySelector('#estimate-form');
const model = form.elements.namedItem('model');

for (const link of document.querySelectorAll('[data-select]')) {
  link.addEventListener('click', () => {
    form.elements.namedItem('service').value = link.dataset.select;
  });
}

model.addEventListener('input', () => model.setCustomValidity(''));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = new FormData(form);
  const car = fields.get('model').trim();
  if (!car) {
    model.setCustomValidity('Укажите марку и модель автомобиля.');
    model.reportValidity();
    return;
  }

  const details = fields.get('details').trim();
  const lines = [
    'Здравствуйте! Хотелось бы узнать стоимость детейлинга.',
    'Услуга: ' + fields.get('service'),
    'Автомобиль: ' + car
  ];
  if (details) {
    lines.push('Задача: ' + details);
  }

  const telegram = new URL(form.action);
  telegram.searchParams.set('text', lines.join('\n'));
  window.location.assign(telegram.toString());
});
