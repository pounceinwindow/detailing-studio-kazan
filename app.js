const form = document.querySelector('#estimate-form');
const model = form.elements.namedItem('model');
const service = form.elements.namedItem('service');
const zoneMap = document.querySelector('#zone-map');
const zoneOptions = document.querySelector('#zone-options');
const zoneStatus = document.querySelector('#zone-status');

const layouts = {
  body: [
    ['front', 'Бампер'], ['hood', 'Капот'], ['roof', 'Крыша'],
    ['left', 'Левый борт'], ['right', 'Правый борт'], ['rear', 'Багажник'],
  ],
  interior: [
    ['front', 'Передние сиденья'], ['hood', 'Передняя панель'], ['roof', 'Потолок'],
    ['left', 'Пол и коврики'], ['right', 'Задний ряд'], ['rear', 'Багажник'],
  ],
};
const selections = { body: new Set(), interior: new Set() };
const currentView = () => service.value === 'Химчистка салона' ? 'interior' : 'body';

function updateZoneStatus() {
  const count = selections[currentView()].size;
  zoneStatus.textContent = count ? `Отмечено зон: ${count}.` : 'Можно выбрать несколько зон.';
}

function renderZones() {
  const view = currentView();
  const options = layouts[view].map(([placement, title]) => {
    const label = document.createElement('label');
    label.className = 'zone-option';
    label.dataset.placement = placement;
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'zone';
    input.value = title;
    input.setAttribute('form', form.id);
    input.checked = selections[view].has(title);
    const text = document.createElement('span');
    text.textContent = title;
    label.append(input, text);
    return label;
  });
  zoneMap.dataset.view = view;
  zoneOptions.replaceChildren(...options);
  updateZoneStatus();
}

zoneOptions.addEventListener('change', ({ target }) => {
  if (target.name !== 'zone') return;
  const selected = selections[currentView()];
  if (target.checked) selected.add(target.value);
  else selected.delete(target.value);
  updateZoneStatus();
});

form.addEventListener('change', ({ target }) => {
  if (target.name === 'service') renderZones();
});

renderZones();

for (const link of document.querySelectorAll('[data-select]')) {
  link.addEventListener('click', () => {
    service.value = link.dataset.select;
    renderZones();
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
  const zones = fields.getAll('zone');
  if (zones.length) lines.push('Зоны: ' + zones.join(', '));
  if (details) {
    lines.push('Задача: ' + details);
  }

  const telegram = new URL(form.action);
  telegram.searchParams.set('text', lines.join('\n'));
  window.location.assign(telegram.toString());
});
