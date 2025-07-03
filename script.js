// Рассчитываем минимальный масштаб при загрузке
function calculateMinScale() {
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;
	const minFillScaleX = viewportWidth / map.offsetWidth;
	const minFillScaleY = viewportHeight / map.offsetHeight;
	minScale = Math.max(minFillScaleX, minFillScaleY);
}

// Вызываем при загрузке и при изменении размера окна
calculateMinScale();
window.addEventListener('resize', calculateMinScale);

document.addEventListener('DOMContentLoaded', function () {
	window.scrollTo(0, 0);

	// Элементы DOM
	const map = document.getElementById('map');
	const systemInfo = document.getElementById('systemInfo');
	const bodyInfo = document.getElementById('bodyInfo');
	const closeSystemInfo = document.getElementById('closeSystemInfo');
	const closeBodyInfo = document.getElementById('closeBodyInfo');
	const zoomInBtn = document.getElementById('zoomIn');
	const zoomOutBtn = document.getElementById('zoomOut');
	const zoomSlider = document.getElementById('zoomSlider');
	const zoomSliderHandle = document.getElementById('zoomSliderHandle');
	const coordinates = document.getElementById('coordinates');

	// Состояние карты
	let scale = 1;
	let minScale = 1;
	let maxScale = 5;
	let offsetX = 0;
	let offsetY = 0;
	let isDragging = false;
	let isZoomDragging = false;
	let startX, startY;
	let touchDistance = null;

	map.style.width = (window.innerWidth > options.width ? window.innerWidth : options.width) + 'px';
	map.style.height = (window.innerHeight > options.height ? window.innerHeight : options.height) + 'px';

	// Инициализация карты
	renderStars();
	renderSectors();
	renderPaths();
	renderSystems();
	updateMapTransform();
	updateZoomSlider();

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

	closeSystemInfo.addEventListener('click', () =>
		systemInfo.classList.remove('is-open')
	);
	closeBodyInfo.addEventListener('click', () =>
		bodyInfo.classList.remove('is-open')
	);

	//Координаты
	map.addEventListener('mousemove', setCoordinates);

	function generateStars(count, width, height) {
		const stars = [];
		for (let i = 0; i < count; i++) {
			stars.push({
				x: Math.random() * width,
				y: Math.random() * height,
				size: Math.random() * 2 + 1,
				opacity: Math.random() * 0.8 + 0.2
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
		options.systems.forEach(system => {
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
			const points = sectorSystems.map(sys => ({ x: sys.x, y: sys.y }));
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
			const expandedPath = expandPolygon(hull, padding)
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
			const center = hull.reduce((acc, point) => {
				return { x: acc.x + point.x / hull.length, y: acc.y + point.y / hull.length };
			}, { x: 0, y: 0 });
			
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
			el.style.width = `${system.size}px`;
			el.style.height = `${system.size}px`;
			el.style.setProperty('--system-color', system.color);

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
		const bodiesContainer = document.getElementById('celestialBodies');
		bodiesContainer.innerHTML = '';

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
				bodyEl.className = `celestial-body ${body.size}`;
				bodyEl.style.setProperty('--celestial-color', body.color);

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
						moonEl.className = 'moon';
						moonEl.style.setProperty('--moon-color', moon.color);

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
			bodiesContainer.appendChild(orbitGroup);
		});

		systemInfo.classList.add('is-open');
	}

	function showBodyInfo(body) {
		document.getElementById('bodyName').textContent = body.name;
		const detailsContainer = document.getElementById('bodyDetails');
		detailsContainer.innerHTML = '';

		const typeEl = document.createElement('p');
		typeEl.textContent = `Тип: ${body.type}`;
		detailsContainer.appendChild(typeEl);

		const sizeEl = document.createElement('p');
		sizeEl.textContent = `Размер: ${translateSize(body.size)}`;
		detailsContainer.appendChild(sizeEl);

		const orbitEl = document.createElement('p');
		orbitEl.textContent = `Орбита: ${body.orbit} а.е.`;
		detailsContainer.appendChild(orbitEl);

		if (body.type === 'Планета' || body.type === 'Спутник') {
			const gravityEl = document.createElement('p');
			gravityEl.textContent = `Гравитация: ${body.gravity} g`;
			detailsContainer.appendChild(gravityEl);

			const tempEl = document.createElement('p');
			tempEl.textContent = `Температура: ${body.temperature}°C`;
			detailsContainer.appendChild(tempEl);

			if (body.moons && body.moons.length > 0) {
				const moonsEl = document.createElement('p');
				moonsEl.textContent = `Спутники: ${body.moons.length}`;
				detailsContainer.appendChild(moonsEl);
			}
		}

		bodyInfo.classList.add('is-open');
	}

	function translateSize(size) {
		const sizes = {
			small: 'Маленький',
			medium: 'Средний',
			large: 'Большой',
			huge: 'Огромный',
		};
		return sizes[size] || size;
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
		const newOffsetX = offsetX - (mouseX * (newScale / scale - 1));
		const newOffsetY = offsetY - (mouseY * (newScale / scale - 1));
		
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

		const maxOffsetX = map.offsetWidth + (map.offsetWidth * (currentScale - 1)) / 2 - viewportWidth;
		const maxOffsetY = map.offsetHeight + (map.offsetHeight * (currentScale - 1)) / 2 - viewportHeight;
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
});
