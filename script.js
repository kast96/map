document.addEventListener('DOMContentLoaded', function () {
	window.scrollTo(0, 0);

	// Элементы DOM
	const map = document.getElementById('map');
	const systemInfo = document.getElementById('systemInfo');
	const celestialBodies = document.getElementById('celestialBodies');
	const bodyInfo = document.getElementById('bodyInfo');
	const closeSystemInfo = document.getElementById('closeSystemInfo');
	const closeBodyInfo = document.getElementById('closeBodyInfo');
	const bodyDetails = document.getElementById('bodyDetails');
	const closeQuestInfo = document.getElementById('closeQuestInfo');
	const zoomInBtn = document.getElementById('zoomIn');
	const zoomOutBtn = document.getElementById('zoomOut');
	const zoomSlider = document.getElementById('zoomSlider');
	const zoomSliderHandle = document.getElementById('zoomSliderHandle');
	const coordinates = document.getElementById('coordinates');
	const questInfo = document.getElementById('questInfo');
	const questOpen = document.getElementById('questOpen');
	const questList = document.getElementById('questList');
	const exportStore = document.getElementById('exportStore');
	const importStore = document.getElementById('importStore');
	const storeFile = document.getElementById('storeFile');
	const editInfo = document.getElementById('editInfo');
	const closeEditInfo = document.getElementById('closeEditInfo');
	const editBody = document.getElementById('editBody');

	// Состояние карты
	let scale = 1;
	let minScale = 0.1;
	let maxScale = 5;
	let offsetX = 0;
	let offsetY = 0;
	let isDragging = false;
	let isZoomDragging = false;
	let startX, startY;
	let touchDistance = null;
	let questStatuses = ['active', 'completed'];
	let store = {
		quests: {
			active: [],
			completed: [],
		}
	};

	map.style.width =
		(window.innerWidth > options.width ? window.innerWidth : options.width) +
		'px';
	map.style.height =
		(window.innerHeight > options.height
			? window.innerHeight
			: options.height) + 'px';

	// Инициализация карты
	renderStars();
	renderSectors();
	renderPaths();
	renderSystems();
	updateMapTransform();
	updateZoomSlider();
	renderQuests();

	// Обработчики событий
	map.addEventListener('mousedown', startDrag);
	document.addEventListener('mousemove', drag);
	document.addEventListener('mouseup', endDrag);

	map.addEventListener('wheel', zoom, { passive: false });

	// Сенсорные события
	map.addEventListener('touchstart', handleTouchStart, { passive: false });
	map.addEventListener('touchmove', handleTouchMove, { passive: false });
	map.addEventListener('touchend', handleTouchEnd);

	// Кнопки масштабирования
	zoomInBtn.addEventListener('click', () =>
		zoomToPoint(scale * 1.2, window.innerWidth / 2, window.innerHeight / 2)
	);
	zoomOutBtn.addEventListener('click', () =>
		zoomToPoint(scale / 1.2, window.innerWidth / 2, window.innerHeight / 2)
	);

	// Слайдер масштабирования
	zoomSliderHandle.addEventListener('mousedown', startZoomDrag);
	document.addEventListener('mousemove', handleZoomDrag);
	document.addEventListener('mouseup', endZoomDrag);

	zoomSlider.addEventListener('click', handleSliderClick);

	closeSystemInfo.addEventListener('click', () => {
		systemInfo.classList.remove('is-open')
		celestialBodies.innerHTML = '';
	});
	closeBodyInfo.addEventListener('click', () => {
		bodyInfo.classList.remove('is-open');
		bodyDetails.innerHTML = '';
	});
	closeQuestInfo.addEventListener('click', () => {
		questInfo.classList.remove('is-open');
	});
	closeEditInfo.addEventListener('click', () => {
		editInfo.classList.remove('is-open');
		editBody.innerHTML = '';
	});
	map.addEventListener('click', () => {
		resetHighlights();
	});

	importStore.addEventListener('click', () => {
		storeFile.click();
	});

	exportStore.addEventListener('click', () => {
		const data = JSON.stringify(store, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'store.json';
    a.click();
	});

	storeFile.addEventListener('change', (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = (e) => {
			store = JSON.parse(e.target.result);
			renderQuests();
		};

		reader.onerror = (e) => {
			console.error('Ошибка FileReader:', e);
		};

		reader.readAsText(file);
	});

	// Рассчитываем минимальный масштаб при загрузке
	function calculateMinScale() {
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const minFillScaleX = (viewportWidth / map.offsetWidth) * 1.005;
		const minFillScaleY = (viewportHeight / map.offsetHeight) * 1.005;
		minScale = Math.max(minFillScaleX, minFillScaleY);
	}

	// Вызываем при загрузке и при изменении размера окна
	calculateMinScale();
	window.addEventListener('resize', calculateMinScale);

	//Координаты
	map.addEventListener('mousemove', setCoordinates);

	function generateStars(count, width, height) {
		const stars = [];
		for (let i = 0; i < count; i++) {
			stars.push({
				x: Math.random() * width,
				y: Math.random() * height,
				size: Math.random() * 2 + 1,
				opacity: Math.random() * 0.8 + 0.2,
			});
		}
		return stars;
	}

	// Функции рендеринга
	function renderStars() {
		const starsCount = (map.offsetWidth * map.offsetHeight) / 2000;
		const stars = generateStars(starsCount, map.offsetWidth, map.offsetHeight);

		const container = document.createElement('div');
		container.className = 'stars';

		stars.forEach((star) => {
			const el = document.createElement('div');
			el.className = 'star';
			el.style.left = `${star.x}px`;
			el.style.top = `${star.y}px`;
			el.style.width = `${star.size}px`;
			el.style.height = `${star.size}px`;
			el.style.backgroundColor = `rgba(255, 255, 255, ${star.opacity})`;
			container.appendChild(el);
		});

		map.appendChild(container);
	}

	function renderSectors() {
		// Группируем системы по секторам
		const systemsBySector = {};
		options.systems.forEach((system) => {
			const sectorName = system.sector || 'Без сектора';
			if (!systemsBySector[sectorName]) {
				systemsBySector[sectorName] = [];
			}
			systemsBySector[sectorName].push(system);
		});

		const container = document.createElement('div');
		container.className = 'sectors';

		// Для каждого сектора
		Object.entries(systemsBySector).forEach(([sectorName, sectorSystems]) => {
			if (sectorSystems.length < 3) return;

			// Вычисляем выпуклую оболочку
			const points = sectorSystems.map((sys) => ({ x: sys.x, y: sys.y }));
			const hull = computeConvexHull(points);

			// Создаем контейнер для сектора
			const sectorContainer = document.createElement('div');
			sectorContainer.className = 'sector-container';
			sectorContainer.style.setProperty('--sector-color', getRandomSectorColor());

			// Создаем сам сектор
			const sectorEl = document.createElement('div');
			sectorEl.className = 'sector';

			// Создаем путь для clip-path
			const padding = 100;
			const expandedPath =
				expandPolygon(hull, padding)
					.map((point, i) => `${i === 0 ? 'M' : 'L'}${point.x},${point.y}`)
					.join(' ') + ' Z';

			sectorEl.style.setProperty('--sector-path', `path('${expandedPath}')`);
			sectorEl.style.left = '0';
			sectorEl.style.top = '0';
			sectorEl.style.width = '100%';
			sectorEl.style.height = '100%';

			// Создаем контейнер для названия
			const nameContainer = document.createElement('div');
			nameContainer.className = 'sector-name-container';

			// Вычисляем центр сектора для размещения названия
			const center = hull.reduce(
				(acc, point) => {
					return {
						x: acc.x + point.x / hull.length,
						y: acc.y + point.y / hull.length,
					};
				},
				{ x: 0, y: 0 }
			);

			// Создаем элемент названия
			const nameEl = document.createElement('div');
			nameEl.className = 'sector-name';
			nameEl.textContent = sectorName;
			nameEl.style.left = `${center.x}px`;
			nameEl.style.top = `${center.y}px`;

			// Добавляем элементы в DOM
			nameContainer.appendChild(nameEl);
			sectorContainer.appendChild(sectorEl);
			sectorContainer.appendChild(nameContainer);
			container.appendChild(sectorContainer);
		});

		map.appendChild(container);
	}

	function computeConvexHull(points) {
		if (points.length < 3) return points;

		// Алгоритм Джарвиса (заворачивание подарка)
		const hull = [];
		let leftmost = 0;

		// Находим самую левую точку
		for (let i = 1; i < points.length; i++) {
			if (points[i].x < points[leftmost].x) {
				leftmost = i;
			}
		}

		let p = leftmost,
			q;
		do {
			hull.push(points[p]);
			q = (p + 1) % points.length;

			for (let i = 0; i < points.length; i++) {
				if (orientation(points[p], points[i], points[q]) === 2) {
					q = i;
				}
			}

			p = q;
		} while (p !== leftmost);

		return hull;
	}

	function orientation(p, q, r) {
		const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
		if (val === 0) return 0; // коллинеарны
		return val > 0 ? 1 : 2; // по или против часовой стрелки
	}

	function expandPolygon(points, padding) {
		if (points.length < 3) return points;

		// Вычисляем центр полигона
		const center = points.reduce(
			(acc, point) => {
				return {
					x: acc.x + point.x / points.length,
					y: acc.y + point.y / points.length,
				};
			},
			{ x: 0, y: 0 }
		);

		// Расширяем полигон
		return points.map((point) => {
			const dx = point.x - center.x;
			const dy = point.y - center.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const scale = (distance + padding) / distance;

			return {
				x: center.x + dx * scale,
				y: center.y + dy * scale,
			};
		});
	}

	function getRandomSectorColor() {
		const colors = [
			'rgba(100, 255, 100)',
			'rgba(100, 100, 255)',
			'rgba(255, 100, 100)',
			'rgba(255, 255, 100)',
			'rgba(100, 255, 255)',
			'rgba(255, 100, 255)',
		];
		return colors[Math.floor(Math.random() * colors.length)];
	}

	function renderPaths() {
		const container = document.createElement('div');
		container.className = 'paths';

		options.paths.forEach((path) => {
			const fromSystem = options.systems.find((s) => s.id === path.from);
			const toSystem = options.systems.find((s) => s.id === path.to);

			if (!fromSystem || !toSystem) return;

			const el = document.createElement('div');
			el.className = 'path';

			const x1 = fromSystem.x;
			const y1 = fromSystem.y;
			const x2 = toSystem.x;
			const y2 = toSystem.y;

			const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
			const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

			el.style.left = `${x1}px`;
			el.style.top = `${y1}px`;
			el.style.width = `${length}px`;
			el.style.transform = `rotate(${angle}deg)`;

			container.appendChild(el);
		});

		map.appendChild(container);
	}

	function renderSystems() {
		const container = document.createElement('div');
		container.className = 'systems';

		options.systems.forEach((system) => {
			const el = document.createElement('div');
			el.className = 'system';
			el.dataset.id = system.id;
			el.style.left = `${system.x}px`;
			el.style.top = `${system.y}px`;
			el.style.setProperty('--system-color', system.color || options.default_color);
			el.style.setProperty('--background-position', `${Math.random() * 100}%`);

			const nameEl = document.createElement('div');
			nameEl.className = 'system-name';
			nameEl.textContent = system.name;
			el.appendChild(nameEl);

			el.addEventListener('click', (e) => {
				e.stopPropagation();
				showSystemInfo(system);
			});

			container.appendChild(el);
		});

		map.appendChild(container);
	}

	function showSystemInfo(system) {
		document.getElementById('systemName').textContent = system.name;
		celestialBodies.innerHTML = '';

		// Группируем тела по орбитам
		const orbits = {};
		system.celestialBodies.forEach((body) => {
			if (!orbits[body.orbit]) {
				orbits[body.orbit] = [];
			}
			orbits[body.orbit].push(body);
		});

		// Сортируем орбиты по расстоянию
		const sortedOrbits = Object.keys(orbits).sort((a, b) => a - b);

		// Рендерим орбиты
		sortedOrbits.forEach((orbitDistance) => {
			const orbitGroup = document.createElement('div');
			orbitGroup.className = 'orbit';

			const orbitLevel = document.createElement('div');
			orbitLevel.className = 'orbit-level';
			if (Object.keys(orbits[orbitDistance]).length > 1) {
				orbitLevel.className += ' orbit-level-some';
			}

			orbits[orbitDistance].forEach((body) => {
				const orbitElContainer = document.createElement('div');
				orbitElContainer.className = 'orbit-container';

				const bodyEl = document.createElement('div');
				bodyEl.className = `celestial-body celestial-body-${body.type} ${body.size}`;
				bodyEl.style.setProperty('--celestial-color', body.color || options.default_color);
				bodyEl.style.setProperty(
					'--background-position',
					`${Math.random() * 100}%`
				);
				if (body.image) {
					bodyEl.style.backgroundImage = `url('${body.image}')`;
				}

				bodyEl.addEventListener('click', (e) => {
					e.stopPropagation();
					showBodyInfo(body);
				});

				const bodyElContainer = document.createElement('div');
				bodyElContainer.className = 'celestial-container';

				bodyElContainer.appendChild(bodyEl);
				orbitElContainer.appendChild(bodyElContainer);

				const nameEl = document.createElement('div');
				nameEl.textContent = body.name;
				nameEl.className = 'celestial-name';

				orbitElContainer.appendChild(nameEl);

				// Если есть спутники, добавляем их
				if (body.moons && body.moons.length > 0) {
					const moonsContainer = document.createElement('div');
					moonsContainer.className = 'moons';

					body.moons.forEach((moon) => {
						const moonEl = document.createElement('div');
						moonEl.className = `moon celestial-body celestial-body-${body.type}`;
						moonEl.style.setProperty('--moon-color', moon.color || options.default_color);
						moonEl.style.setProperty(
							'--background-position',
							`${Math.random() * 100}%`
						);
						if (moon.image) {
							moonEl.style.backgroundImage = `url('${moon.image}')`;
						}

						moonEl.addEventListener('click', (e) => {
							e.stopPropagation();
							showBodyInfo(moon);
						});

						const moonElContainer = document.createElement('div');
						moonElContainer.className = 'moon-container';

						moonElContainer.appendChild(moonEl);

						const nameMoonEl = document.createElement('div');
						nameMoonEl.textContent = moon.name;
						nameMoonEl.className = 'moon-name';

						moonElContainer.appendChild(nameMoonEl);

						moonsContainer.appendChild(moonElContainer);
					});

					orbitElContainer.appendChild(moonsContainer);

					orbitElContainer.className += ' orbit-container-with-moons';
				}

				orbitLevel.appendChild(orbitElContainer);
			});

			orbitGroup.appendChild(orbitLevel);
			celestialBodies.appendChild(orbitGroup);
		});

		systemInfo.classList.add('is-open');
	}

	function showBodyInfo(body) {
		document.getElementById('bodyName').textContent = body.name;
		bodyDetails.innerHTML = '';

		const el = document.createElement('div');
		el.className = `celestial-detail celestial-body celestial-body-${body.type} ${body.size}`;
		el.style.setProperty('--celestial-color', body.color || options.default_color);
		el.style.setProperty('--background-position', `${Math.random() * 100}%`);
		if (body.image) {
			el.style.backgroundImage = `url('${body.image}')`;
		}
		bodyDetails.appendChild(el);

		if (body.moons && body.moons.length > 0) {
			const moonContainerEl = document.createElement('div');
			moonContainerEl.className = 'moons-detail';

			body.moons.forEach((moon) => {
				const moonEl = document.createElement('div');
				moonEl.className = `moon moon-detail celestial-body-${moon.type}`;
				moonEl.style.setProperty('--moon-color', moon.color || options.default_color);
				moonEl.style.setProperty(
					'--background-position',
					`${Math.random() * 100}%`
				);
				if (moon.image) {
					moonEl.style.backgroundImage = `url('${moon.image}')`;
				}

				moonEl.addEventListener('click', (e) => {
					e.stopPropagation();
					showBodyInfo(moon);
				});

				const moonElContainer = document.createElement('div');
				moonElContainer.className = 'moon-container';

				moonElContainer.appendChild(moonEl);

				const nameMoonEl = document.createElement('div');
				nameMoonEl.textContent = moon.name;
				nameMoonEl.className = 'moon-name';

				moonElContainer.appendChild(nameMoonEl);

				moonContainerEl.appendChild(moonElContainer);
			});

			bodyDetails.appendChild(moonContainerEl);
		}

		const propsEl = document.createElement('div');
		propsEl.className = `properties`;

		propsEl.appendChild(createPropery('Тип', consts.types[body.type].name));
		propsEl.appendChild(createPropery('Размер', consts.sizes[body.size].name));
		propsEl.appendChild(createPropery('Орбита', `${body.orbit} а.е.`));

		if (
			body.type === consts.types.planet.value ||
			body.type === consts.types.sputnik.value
		) {
			propsEl.appendChild(createPropery('Гравитация', `${body.gravity} g`));
			propsEl.appendChild(
				createPropery('Температура', `${body.temperature}°C`)
			);

			if (body.moons && body.moons.length > 0) {
				propsEl.appendChild(createPropery('Спутники', body.moons.length));
			}
		}

		bodyDetails.appendChild(propsEl);

		bodyInfo.classList.add('is-open');
	}

	function createPropery(name, value) {
		const propertyEl = document.createElement('div');
		propertyEl.className = `property`;

		const propertyNameEl = document.createElement('span');
		propertyNameEl.className = `property-name`;
		propertyNameEl.textContent = `${name}:`;
		propertyEl.appendChild(propertyNameEl);

		const propertyValueEl = document.createElement('span');
		propertyValueEl.className = `property-value`;
		propertyValueEl.textContent = value;
		propertyEl.appendChild(propertyValueEl);

		return propertyEl;
	}

	// Функции для работы с картой
	function startDrag(e) {
		if (
			e.target === map ||
			e.target.classList.contains('system') ||
			e.target.classList.contains('sector')
		) {
			isDragging = true;
			startX = e.clientX - offsetX;
			startY = e.clientY - offsetY;
			map.style.cursor = 'grabbing';
		}
	}

	function drag(e) {
		if (!isDragging) return;

		const newOffsetX = e.clientX - startX;
		const newOffsetY = e.clientY - startY;

		constrainOffsets(scale, newOffsetX, newOffsetY);
		updateMapTransform();
	}

	function endDrag() {
		isDragging = false;
		map.style.cursor = 'grab';
	}

	function zoom(e) {
		e.preventDefault();
		const delta = e.deltaY * -0.001;
		const mouseX = e.clientX - offsetX;
		const mouseY = e.clientY - offsetY;
		zoomToPoint(scale + delta, mouseX, mouseY);
	}

	function zoomToPoint(newScale, mouseX, mouseY) {
		newScale = Math.min(Math.max(minScale, newScale), maxScale);

		// Вычисляем новые offsetX и offsetY
		const newOffsetX = offsetX - mouseX * (newScale / scale - 1);
		const newOffsetY = offsetY - mouseY * (newScale / scale - 1);

		// Ограничиваем перемещение
		constrainOffsets(newScale, newOffsetX, newOffsetY);

		scale = newScale;
		updateMapTransform();
		updateZoomSlider();
	}

	function constrainOffsets(currentScale, targetOffsetX, targetOffsetY) {
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const mapWidth = map.offsetWidth * currentScale;
		const mapHeight = map.offsetHeight * currentScale;

		// Определяем, по каким осям карта больше viewport
		const isWider = mapWidth > viewportWidth;
		const isTaller = mapHeight > viewportHeight;

		const maxOffsetX = map.offsetWidth + (map.offsetWidth * (currentScale - 1)) / 2 -	viewportWidth;
		const maxOffsetY = map.offsetHeight + (map.offsetHeight * (currentScale - 1)) / 2 -	viewportHeight;
		const minOffsetX = (map.offsetWidth - mapWidth) / 2;
		const minOffsetY = (map.offsetHeight - mapHeight) / 2;

		if (isWider && isTaller) {
			// Карта больше по обеим осям - полное ограничение
			offsetX = Math.min(-minOffsetX, Math.max(-maxOffsetX, targetOffsetX));
			offsetY = Math.min(-minOffsetY, Math.max(-maxOffsetY, targetOffsetY));
		} else if (isWider) {
			// Карта шире viewport, но не выше - ограничиваем только по X
			offsetX = Math.min(-minOffsetX, Math.max(-maxOffsetX, targetOffsetX));
			// По Y центрируем
			offsetY = (viewportHeight - mapHeight) / 2;
		} else if (isTaller) {
			// Карта выше viewport, но не шире - ограничиваем только по Y
			offsetY = Math.min(-minOffsetY, Math.max(-maxOffsetY, targetOffsetY));
			// По X центрируем
			offsetX = (viewportWidth - mapWidth) / 2;
		} else {
			// Карта меньше по обеим осям - центрируем
			offsetX = (viewportWidth - mapWidth) / 2;
			offsetY = (viewportHeight - mapHeight) / 2;
		}
	}

	function updateMapTransform() {
		map.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
	}

	function updateZoomSlider() {
		const sliderHeight =
			zoomSlider.offsetHeight - zoomSliderHandle.offsetHeight;
		const position =
			((scale - minScale) / (maxScale - minScale)) * sliderHeight;
		zoomSliderHandle.style.bottom = `${position}px`;
	}

	// Обработка сенсорных событий
	function handleTouchStart(e) {
		if (e.touches.length === 1) {
			// Одно касание - перемещение
			isDragging = true;
			startX = e.touches[0].clientX - offsetX;
			startY = e.touches[0].clientY - offsetY;
		} else if (e.touches.length === 2) {
			// Два касания - масштабирование
			isDragging = false;
			touchDistance = getTouchDistance(e.touches[0], e.touches[1]);
		}
	}

	function handleTouchMove(e) {
		if (e.touches.length === 1 && isDragging) {
			// Перемещение
			const newOffsetX = e.touches[0].clientX - startX;
			const newOffsetY = e.touches[0].clientY - startY;

			constrainOffsets(scale, newOffsetX, newOffsetY);

			updateMapTransform();
		} else if (e.touches.length === 2 && touchDistance !== null) {
			// Масштабирование
			e.preventDefault();
			const newTouchDistance = getTouchDistance(e.touches[0], e.touches[1]);
			const scaleChange = newTouchDistance / touchDistance;

			// Центр между двумя пальцами
			const centerX =
				(e.touches[0].clientX + e.touches[1].clientX) / 2 - offsetX;
			const centerY =
				(e.touches[0].clientY + e.touches[1].clientY) / 2 - offsetY;

			zoomToPoint(scale * scaleChange, centerX, centerY);
			touchDistance = newTouchDistance;
		}
	}

	function handleTouchEnd() {
		isDragging = false;
		touchDistance = null;
	}

	function getTouchDistance(touch1, touch2) {
		return Math.sqrt(
			Math.pow(touch2.clientX - touch1.clientX, 2) +
				Math.pow(touch2.clientY - touch1.clientY, 2)
		);
	}

	// Управление масштабированием через слайдер
	function startZoomDrag(e) {
		isZoomDragging = true;
		e.stopPropagation();
	}

	function handleZoomDrag(e) {
		if (!isZoomDragging) return;

		const sliderRect = zoomSlider.getBoundingClientRect();
		const sliderHeight = sliderRect.height - zoomSliderHandle.offsetHeight;
		let position =
			sliderRect.bottom - e.clientY - zoomSliderHandle.offsetHeight / 2;

		position = Math.max(0, Math.min(sliderHeight, position));
		zoomSliderHandle.style.bottom = `${position}px`;

		// Обновляем масштаб
		const newScale =
			minScale + (position / sliderHeight) * (maxScale - minScale);
		zoomToPoint(newScale, window.innerWidth / 2, window.innerHeight / 2);
	}

	function endZoomDrag() {
		isZoomDragging = false;
	}

	function handleSliderClick(e) {
		if (e.target === zoomSlider) {
			const sliderRect = zoomSlider.getBoundingClientRect();
			const sliderHeight = sliderRect.height - zoomSliderHandle.offsetHeight;
			let position =
				sliderRect.bottom - e.clientY - zoomSliderHandle.offsetHeight / 2;

			position = Math.max(0, Math.min(sliderHeight, position));
			zoomSliderHandle.style.bottom = `${position}px`;

			// Обновляем масштаб
			const newScale =
				minScale + (position / sliderHeight) * (maxScale - minScale);
			zoomToPoint(newScale, window.innerWidth / 2, window.innerHeight / 2);
		}
	}

	function setCoordinates(e) {
		const rect = map.getBoundingClientRect();
		const x = (e.clientX - rect.left) / scale;
		const y = (e.clientY - rect.top) / scale;
		coordinates.textContent = `${Math.round(x)},${Math.round(y)}`;
	}

	function renderQuests() {
		questList.innerHTML = '';

		// Рендерим активные квесты
		const activeTab = document.querySelector('.quest-tab.is-active');
		const tabType = activeTab ? activeTab.dataset.tab : 'active';

		const questionActiveValues = {
			active: 'Квест активен',
			completed: 'Квест завершен',
		};
		const taskActiveValues = {
			active: 'Активна',
			completed: 'Выполнена',
			failed: 'Успешно провалена',
		};

		if (store && store.quests && store.quests[tabType]) {
			store.quests[tabType].forEach((quest, index) => {
				const questEl = document.createElement('div');
				questEl.className = 'quest-item';

				const questHeaderEl = document.createElement('div');
				questHeaderEl.className = 'quest-header';

				const questTitleEl = document.createElement('div');
				questTitleEl.className = 'quest-title';
				questTitleEl.textContent = quest.title || 'Название не указано';
				questHeaderEl.appendChild(questTitleEl);

				questTitleEl.addEventListener('dblclick', () => {
					showEditPopup(quest.title, (value) => {
						quest.title = value;
						renderQuests();
					});
				});

				const questStatusEl = document.createElement('div');
				questStatusEl.className = 'quest-status';
				questStatusEl.textContent = questionActiveValues[tabType] || 'Статус не определен';
				questHeaderEl.appendChild(questStatusEl);

				questStatusEl.addEventListener('dblclick', () => {
					showEditPopup(
						tabType,
						(value) => {
							store.quests[tabType].splice(index, 1);
							store.quests[value].push(quest);
							renderQuests();
						},
						'select',
						{
							values: questionActiveValues
						}
					);
				});

				const questDescriptionEl = document.createElement('div');
				questDescriptionEl.className = 'quest-description';
				questDescriptionEl.innerHTML = quest.description || 'Описание не указано';
				questHeaderEl.appendChild(questDescriptionEl);

				questDescriptionEl.addEventListener('dblclick', () => {
					showEditPopup(quest.description, (value) => {
						quest.description = value;
						renderQuests();
					}, 'textarea');
				});

				questEl.appendChild(questHeaderEl);

				const tasksContainer = document.createElement('div');
				tasksContainer.className = 'quest-body';
				quest.tasks.forEach(task => {
					const taskEl = document.createElement('div');
					taskEl.className = `task-item ${task.status}`;

					let locationText = '';
					if (task.location) {
						locationText = getLocationText(task.location);
					}

					const taskLeftEl = document.createElement('div');
					taskLeftEl.className = 'task-left';

					const taskHeaderEl = document.createElement('div');
					taskHeaderEl.className = 'task-header';

					const taskStatusEl = document.createElement('div');
					taskStatusEl.className = 'task-status';
					taskHeaderEl.appendChild(taskStatusEl);

					taskStatusEl.addEventListener('dblclick', () => {
						showEditPopup(
							task.status,
							(value) => {
								task.status = value
								renderQuests();
							},
							'select',
							{
								values: taskActiveValues
							}
						);
					});

					const taskTitleEl = document.createElement('div');
					taskTitleEl.className = 'task-title';
					taskTitleEl.textContent = task.title || 'Название не указано';
					taskHeaderEl.appendChild(taskTitleEl);

					taskTitleEl.addEventListener('dblclick', () => {
						showEditPopup(task.title, (value) => {
							task.title = value;
							renderQuests();
						});
					});

					taskLeftEl.appendChild(taskHeaderEl);

					const taskLocationEl = document.createElement('div');
					taskLocationEl.className = 'task-location';

					const taskLocationTextEl = document.createElement('div');
					taskLocationTextEl.className = 'task-location-text';
					taskLocationTextEl.textContent = locationText || 'Локация не указана';
					taskLocationEl.appendChild(taskLocationTextEl);

					taskLocationEl.addEventListener('dblclick', () => {
						showEditPopup(
							task.location,
							(value) => {
								task.location = null;
								['sector', 'system', 'planet', 'moon'].forEach(type => {
									if (!value[type]) return;
									if (!task.location) task.location = {};
									task.location.type = type;
									task.location[type] = value[type];
								});
								renderQuests();
							},
							'location'
						);
					});

					taskLeftEl.appendChild(taskLocationEl);

					taskEl.appendChild(taskLeftEl);

					const taskRightEl = document.createElement('div');
					taskRightEl.className = 'task-right';

					if (checkLocation(task.location)) {
						taskRightEl.innerHTML = `
							<button class='show-location' data-task-id='${task.id}' data-quest-id='${quest.id}'>
								<svg class='show-location-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
									<path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
								</svg>
							</button>
						`;
					}

					taskEl.appendChild(taskRightEl);

					tasksContainer.appendChild(taskEl);
				});

				const addTaskEl = document.createElement('button');
				addTaskEl.className = 'button add-task';
				addTaskEl.textContent = 'Добавить подзадачу';

				tasksContainer.appendChild(addTaskEl);

				addTaskEl.addEventListener('click', () => {
					let newId = 1;
					if (!(quest.tasks instanceof Array)) quest.tasks = [];
					const maxId = Math.max.apply(null, (quest.tasks.map(task => parseInt(task.id)) || []));
					if (maxId >= newId) newId = maxId + 1;

					quest.tasks.push({
						id: newId,
						title: 'Название подзадачи',
						status: 'active',
					});
					renderQuests();
				});

				questEl.appendChild(tasksContainer);

				questList.appendChild(questEl);
			});
		}

		const addQuestEl = document.createElement('button');
		addQuestEl.className = 'button add-task';
		addQuestEl.textContent = 'Добавить задачу';

		questList.appendChild(addQuestEl);

		addQuestEl.addEventListener('click', () => {
			if (!(store.quests[tabType] instanceof Array)) {
				store.quests[tabType] = [];
			}

			let newId = 1;
			for (const key in store.quests) {
				const quests = store.quests[key];
				const maxId = Math.max.apply(null, (quests.map(quest => parseInt(quest.id)) || []));
				if (maxId >= newId) newId = maxId + 1;
			}

			store.quests[tabType].push({
				id: newId,
				title: 'Название задачи',
				description: 'Описание задачи',
				tasks: [],
			});
			renderQuests();
		});

		// Добавляем обработчики для кнопок показа локации
		document.querySelectorAll('.show-location').forEach((btn) => {
			btn.addEventListener('click', () => {
				const taskId = parseInt(btn.dataset.taskId);
				const questId = parseInt(btn.dataset.questId);
				highlightTaskLocation(taskId, questId);
			});
		});
	}

	function getLocationText(location) {
		let locationArray = [];
		if (location.sector) locationArray.push(location.sector);
		if (location.system) locationArray.push(location.system);
		if (location.planet) locationArray.push(location.planet);
		if (location.moon) locationArray.push(location.moon);
		
		return locationArray.join(' - ');
	}

	function checkLocation(location) {
		if (!location || !location.type) return false;

		switch (location.type) {
			case 'sector':
				return !!(options.systems.find((s) => s.sector === location.sector));
			case 'system':
				const system = getSystemByName(location.system);
				return system && system.sector === location.sector;
			case 'planet':
				if (planetSystem = getSystemByName(location.system)) {
					if (planetSystem.sector !== location.sector) return false;
					return !!(getPlanetByName(location.planet, planetSystem));
				}
				return false;
			case 'moon':
				if (moonSystem = getSystemByName(location.system)) {
					if (moonSystem.sector !== location.sector) return false;
					const planet = getPlanetByName(location.planet, moonSystem);
					if (planet && planet.moons) {
						return (!!getMoonByName(location.moon, planet));
					}
				}
				return false;
			default:
				return false;
		}
	}

	function highlightTaskLocation(taskId, questId) {
		// Сначала сбрасываем все подсветки
		resetHighlights();
		// Находим задачу
		let task = null;
		for (const category of questStatuses) {
			for (const quest of store.quests[category]) {
				if (quest.id !== questId) continue;
				const foundTask = quest.tasks.find((t) => t.id === taskId);
				if (foundTask) {
					task = foundTask;
					break;
				}
			}
			if (task) break;
		}

		if (!task || !task.location) return;

		// Подсвечиваем локацию в зависимости от типа
		switch (task.location.type) {
			case 'sector':
				highlightTaskLocationSector(task.location.sector);
				if (center = getSectorCenter(task.location.sector)) {
					moveMap(center.x, center.y);
				}
				break;

			case 'system':
				if (system = getSystemByName(task.location.system)) {
					highlightTaskLocationSystem(task.location.system);
					if (scale < 1.5) scale = 1.5;
					moveMap(system.x, system.y);
				}
				break;

			case 'planet':
				if (system = getSystemByName(task.location.system)) {
					highlightTaskLocationSystem(task.location.system);
					showSystemInfo(system);
					if (scale < 1.5) scale = 1.5;
					moveMap(system.x, system.y);

					setTimeout(() => {
						highlightTaskLocationPlanet(task.location.planet);
					}, 300);
				}
				break;

			case 'moon':
				if (system = getSystemByName(task.location.system)) {
					if (planet = getPlanetByName(task.location.planet, system)) {
						if (planet && planet.moons) {
							if (moon = getMoonByName(task.location.moon, planet)) {
								highlightTaskLocationSystem(task.location.system);
								showSystemInfo(system);
								if (scale < 1.5) scale = 1.5;
								moveMap(system.x, system.y);

								setTimeout(() => {
									highlightTaskLocationMoon(moon.name);
								}, 300);
							}
						}
					}
					highlightTaskLocationSystem(task.location.system);
				}
				break;
		}
	}

	function getTaskLocation(name, selector, containerSelector) {
		let element = null;
		document.querySelectorAll(selector).forEach((nameEl) => {
			if (nameEl.textContent.includes(name)) {
				element = nameEl.closest(containerSelector);
				return;
			}
		});
		return element;
	}

	function highlightTaskLocationSector(sectorName) {
		if (element = getTaskLocation(sectorName, '.sector-name', '.sector-container')) {
			element.classList.add('highlight-sector');
		}
	}

	function highlightTaskLocationSystem(systemName) {
		if (element = getTaskLocation(systemName, '.system-name', '.system')) {
			element.classList.add('highlight-system');
		}
	}

	function highlightTaskLocationPlanet(planetName) {
		if (element = getTaskLocation(planetName, '.celestial-name', '.orbit-container')) {
			element.classList.add('highlight-planet');
		}
	}

	function highlightTaskLocationMoon(moonName) {
		if (element = getTaskLocation(moonName, '.moon-name', '.moon-container')) {
			element.classList.add('highlight-moon');
		}
	}

	function getSystemByName(systemName) {
		return options.systems.find((s) => s.name === systemName) || null;
	}

	function getPlanetByName(planetName, system) {
		return system.celestialBodies.find((s) => s.name === planetName) || null;
	}
	
	function getMoonByName(moonName, planet) {
		return planet.moons.find((s) => s.name === moonName) || null;
	}

	function getSectorCenter(sectorName) {
		const systems = options.systems.filter((s) => s.sector === sectorName);
		if (!systems) return;
		
		let minX, maxX, minY, maxY;

		systems.forEach((system, index) => {
			if (index) {
				if (system.x < minX) minX = system.x;
				if (system.x > maxX) maxX = system.x;
				if (system.y < minY) minY = system.y;
				if (system.y > maxY) maxY = system.y;
			} else {
				minX = maxX = system.x;
				minY = maxY = system.y;
			}
		});

		return {
			x: (minX + maxX) / 2,
			y: (minY + maxY) / 2
		}
	}

	function resetHighlights() {
		document.querySelectorAll('.highlight-sector').forEach((el) => {
			el.classList.remove('highlight-sector');
		});
		document.querySelectorAll('.highlight-system').forEach((el) => {
			el.classList.remove('highlight-system');
		});
		document.querySelectorAll('.highlight-planet').forEach((el) => {
			el.classList.remove('highlight-planet');
		});
		document.querySelectorAll('.highlight-moon').forEach((el) => {
			el.classList.remove('highlight-moon');
		});
	}

	function moveMap(x, y, newScale = scale) {
		const newOffsetX = map.offsetWidth / 2 * (newScale - 1) + window.innerWidth / 2 - x * newScale;
		const newOffsetY = map.offsetHeight / 2 * (newScale - 1) + window.innerHeight / 2 - y * newScale;

		// Ограничиваем перемещение
		constrainOffsets(newScale, newOffsetX, newOffsetY);

		updateMapTransform();
	}

	// Обработчики для панели квестов
	questOpen.addEventListener('click', () => {
		questInfo.classList.add('is-open');
	});

	document.querySelectorAll('.quest-tab').forEach((tab) => {
		tab.addEventListener('click', () => {
			document.querySelectorAll('.quest-tab').forEach((t) => t.classList.remove('is-active'));
			tab.classList.add('is-active');
			renderQuests();
		});
	});

	function showEditPopup(currentValue, callback, type = 'text', options = {}) {
		editBody.innerHTML = '';

		const form = document.createElement('form');
		form.className = 'form';

		switch (type) {
			case 'textarea':
				const textarea = document.createElement('textarea');
				textarea.className = 'textarea';
				textarea.name = 'value';
				textarea.value = currentValue.replace(/<br\s*\/?>/gi, '\n');
				form.appendChild(textarea);
				break;

			case 'select':
				const select = document.createElement('select');
				select.className = 'select';
				select.name = 'value';

				if (options.values) {
					for (const value in options.values) {
						const name = options.values[value];
						const option = document.createElement('option');
						option.value = value;
						option.textContent = name;
						select.appendChild(option);
					}
				}

				select.value = currentValue;

				form.appendChild(select);
				break;

			case 'location':
				const inputSector = document.createElement('input');
				inputSector.className = 'input';
				inputSector.type = 'text';
				inputSector.name = 'value[sector]';
				inputSector.value = currentValue && currentValue.sector || '';
				form.appendChild(inputSector);

				const inputSystem = document.createElement('input');
				inputSystem.className = 'input';
				inputSystem.type = 'text';
				inputSystem.name = 'value[system]';
				inputSystem.value = currentValue && currentValue.system || '';
				form.appendChild(inputSystem);

				const inputPlanet = document.createElement('input');
				inputPlanet.className = 'input';
				inputPlanet.type = 'text';
				inputPlanet.name = 'value[planet]';
				inputPlanet.value = currentValue && currentValue.planet || '';
				form.appendChild(inputPlanet);

				const inputMoon = document.createElement('input');
				inputMoon.className = 'input';
				inputMoon.type = 'text';
				inputMoon.name = 'value[moon]';
				inputMoon.value = currentValue && currentValue.moon || '';
				form.appendChild(inputMoon);
				break;
		
			default:
				const input = document.createElement('input');
				input.className = 'input';
				input.type = type;
				input.name = 'value';
				input.value = currentValue;
				form.appendChild(input);
				break;
		}

		const submit = document.createElement('input');
		submit.className = 'button submit';
		submit.type = 'submit';
		submit.value = 'Сохранить';
		form.appendChild(submit);

		editBody.appendChild(form);

		form.addEventListener('submit', (e) => {
			e.preventDefault();

			const formData = new FormData(form);
			let value = formData.get('value');

			if (type == 'location') {
				value = [];
				value.sector = formData.get('value[sector]');
				value.system = formData.get('value[system]');
				value.planet = formData.get('value[planet]');
				value.moon = formData.get('value[moon]');
			}

			if (typeof(callback) === 'function')
			{
				if (typeof(value) === 'string') {
					value.replace(/\n/g, '<br>');
				}
				callback(value);
			}

			editInfo.classList.remove('is-open');
		});

		editInfo.classList.add('is-open');
	}
});
