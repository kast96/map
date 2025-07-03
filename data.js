const colors = {
	systems: {
		yellow: '#FFD700',
		orange: '#FF6347',
		red: '#FFA500',
	},
	planet: {
		//Ледяные – белый с голубоватым оттенком.
		white: '#fff',
		white_light: '#f0f8ff',
		white_dark: '#d3e0ea',

		//Каменные – серый с вариациями светлого и темного.
		gray: '#a9a9a9',
		gray_light: '#d3d3d3',
		gray_dark: '#696969',

		//Горячие – красный с оранжевыми оттенками.
		red: '#ff4500',
		red_light: '#ff8c69',
		red_dark: '#cc3700',

		//Оранжевые – промежуточный между красным и желтым.
		orange: '#ff8c00',
		orange_light: '#ffb280',
		orange_dark: '#cc7000',

		//Пустынные – желтый с приглушенными тонами.
		yellow: '#e6c229',
		yellow_light: '#f0d77c',
		yellow_dark: '#b89c20',

		//Зеленая флора – естественный зеленый (как у растительности).
		green: '#2e8b57',
		green_light: '#5fbd8e',
		green_dark: '#2a7b4f',

		//Токсичные – темно-зеленый (ядовитый оттенок).
		green_toxic: '#82b142',
		green_toxic_light: '#98d069',
		green_toxic_dark: '#3e9929',

		//Газовые/бирюзовые – бирюза (как у Урана или океанов с минералами).
		turquoise: '#40e0d0',
		turquoise_light: '#7ffff1',
		turquoise_dark: '#20b2ac',

		//Водные – голубой (чистая вода).
		aqua: '#1e90ff',
		aqua_light: '#87cefa',
		aqua_dark: '#0093cc',

		//Глубокий синий – насыщенный синий (как у Нептуна).
		blue: '#1661c6',
		blue_light: '#4169e1',
		blue_dark: '#204f9b',

		//Фиолетовые – пурпурные оттенки (экзотические планеты).
		purple: '#9370db',
		purple_light: '#ba9aff',
		purple_dark: '#6a3d9a',

		//Розовые – яркие или пастельные розовые (редкие атмосферы).
		pink: '#ff69b4',
		pink_light: '#ffb6c1',
		pink_dark: '#d44d80',
	}
}

const options = {
	width: 2000,
	height: 1000,
	systems: [
		{
			id: 999,
			name: 'Цвета',
			x: 1200,
			y: 600,
			sector: 'Сектор Цвета',
			size: 35,
			color: colors.systems.yellow,
			celestialBodies: [
				{
					name: 'white',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.white,
					orbit: 0,
				},
				{
					name: 'white_light',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.white_light,
					orbit: 0,
				},
				{
					name: 'white_dark',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.white_dark,
					orbit: 0,
				},
				{
					name: 'gray',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.gray,
					orbit: 1,
				},
				{
					name: 'gray_light',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.gray_light,
					orbit: 1,
				},
				{
					name: 'gray_dark',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.gray_dark,
					orbit: 1,
				},
				{
					name: 'red',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.red,
					orbit: 2,
				},
				{
					name: 'red_light',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.red_light,
					orbit: 2,
				},
				{
					name: 'red_dark',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.red_dark,
					orbit: 2,
				},
				{
					name: 'orange',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.orange,
					orbit: 3,
				},
				{
					name: 'orange_light',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.orange_light,
					orbit: 3,
				},
				{
					name: 'orange_dark',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.orange_dark,
					orbit: 3,
				},
				{
					name: 'yellow',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.yellow,
					orbit: 4,
				},
				{
					name: 'yellow_light',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.yellow_light,
					orbit: 4,
				},
				{
					name: 'yellow_dark',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.yellow_dark,
					orbit: 4,
				},
				{
					name: 'green',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.green,
					orbit: 5,
				},
				{
					name: 'green_light',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.green_light,
					orbit: 5,
				},
				{
					name: 'green_dark',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.green_dark,
					orbit: 5,
				},
				{
					name: 'green_toxic',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.green_toxic,
					orbit: 6,
				},
				{
					name: 'green_toxic_light',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.green_toxic_light,
					orbit: 6,
				},
				{
					name: 'green_toxic_dark',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.green_toxic_dark,
					orbit: 6,
				},
				{
					name: 'turquoise',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.turquoise,
					orbit: 7,
				},
				{
					name: 'turquoise_light',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.turquoise_light,
					orbit: 7,
				},
				{
					name: 'turquoise_dark',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.turquoise_dark,
					orbit: 7,
				},
				{
					name: 'aqua',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.aqua,
					orbit: 8,
				},
				{
					name: 'aqua_light',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.aqua_light,
					orbit: 8,
				},
				{
					name: 'aqua_dark',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.aqua_dark,
					orbit: 8,
				},
				{
					name: 'blue',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.blue,
					orbit: 9,
				},
				{
					name: 'blue_light',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.blue_light,
					orbit: 9,
				},
				{
					name: 'blue_dark',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.blue_dark,
					orbit: 9,
				},
				{
					name: 'purple',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.purple,
					orbit: 10,
				},
				{
					name: 'purple_light',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.purple_light,
					orbit: 10,
				},
				{
					name: 'purple_dark',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.purple_dark,
					orbit: 10,
				},
				{
					name: 'pink',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.pink,
					orbit: 11,
				},
				{
					name: 'pink',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.pink_light,
					orbit: 11,
				},
				{
					name: 'pink_dark',
					type: 'Звезда',
					size: 'huge',
					color: colors.planet.pink_dark,
					orbit: 11,
				},
			]
		},
		{
			id: 1,
			name: 'Солнечная система',
			x: 300,
			y: 250,
			sector: 'Сектор Альфа',
			size: 35,
			color: colors.systems.yellow,
			celestialBodies: [
				{
					name: 'Солнце',
					type: 'Звезда',
					size: 'huge',
					color: '#FFD700',
					orbit: 0,
				},
				{
					name: 'Меркурий',
					type: 'Планета',
					size: 'small',
					color: '#A9A9A9',
					orbit: 0.4,
					gravity: 0.38,
					temperature: 167,
				},
				{
					name: 'Венера',
					type: 'Планета',
					size: 'medium',
					color: '#E6C229',
					orbit: 0.7,
					gravity: 0.91,
					temperature: 464,
				},
				{
					name: 'Земля',
					type: 'Планета',
					size: 'medium',
					color: '#1E90FF',
					orbit: 1.0,
					gravity: 1.0,
					temperature: 15,
					moons: [
						{
							name: 'Луна',
							type: 'Спутник',
							size: 'small',
							color: '#C0C0C0',
							orbit: 0.002,
							gravity: 0.16,
							temperature: -23,
						},
					],
				},
				{
					name: 'Марс',
					type: 'Планета',
					size: 'medium',
					color: '#FF4500',
					orbit: 1.5,
					gravity: 0.38,
					temperature: -65,
					moons: [
						{
							name: 'Фобос',
							type: 'Спутник',
							size: 'small',
							color: '#A9A9A9',
							orbit: 0.0001,
							gravity: 0.005,
							temperature: -100,
						},
						{
							name: 'Деймос',
							type: 'Спутник',
							size: 'small',
							color: '#A9A9A9',
							orbit: 0.0002,
							gravity: 0.003,
							temperature: -100,
						},
					],
				},
			],
		},
		{
			id: 2,
			name: 'Проксима Центавра',
			x: 700,
			y: 350,
			sector: 'Сектор Альфа',
			size: 35,
			color: colors.systems.orange,
			celestialBodies: [
				{
					name: 'Проксима Центавра',
					type: 'Звезда',
					size: 'medium',
					color: '#FF6347',
					orbit: 0,
				},
				{
					name: 'Проксима b',
					type: 'Планета',
					size: 'medium',
					color: '#4682B4',
					orbit: 0.05,
					gravity: 1.2,
					temperature: -40,
				},
			],
		},
		{
			id: 3,
			name: 'Альфа Центавра',
			x: 800,
			y: 150,
			sector: 'Сектор Альфа',
			size: 35,
			color: colors.systems.red,
			celestialBodies: [
				// ... (остальные данные о телах системы)
			],
		},
		// ... (другие системы)
	],
	paths: [
		{
			from: 1,
			to: 2,
		},
	],
}