const options = {
	width: 2000,
	height: 1000,
	default_color: '#999',
	systems: [
		{
			id: 999,
			name: 'Цвета',
			x: 1200,
			y: 600,
			sector: 'Сектор Цвета',
			color: consts.colors.systems.yellow,
			celestialBodies: [
				{
					name: 'white',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.white,
					orbit: 0,
				},
				{
					name: 'white_light',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.white_light,
					orbit: 0,
				},
				{
					name: 'white_dark',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.white_dark,
					orbit: 0,
				},
				{
					name: 'gray',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.gray,
					orbit: 1,
				},
				{
					name: 'gray_light',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.gray_light,
					orbit: 1,
				},
				{
					name: 'gray_dark',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.gray_dark,
					orbit: 1,
				},
				{
					name: 'red',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.red,
					orbit: 2,
				},
				{
					name: 'red_light',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.red_light,
					orbit: 2,
				},
				{
					name: 'red_dark',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.red_dark,
					orbit: 2,
				},
				{
					name: 'orange',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.orange,
					orbit: 3,
				},
				{
					name: 'orange_light',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.orange_light,
					orbit: 3,
				},
				{
					name: 'orange_dark',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.orange_dark,
					orbit: 3,
				},
				{
					name: 'yellow',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.yellow,
					orbit: 4,
				},
				{
					name: 'yellow_light',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.yellow_light,
					orbit: 4,
				},
				{
					name: 'yellow_dark',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.yellow_dark,
					orbit: 4,
				},
				{
					name: 'green',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.green,
					orbit: 5,
				},
				{
					name: 'green_light',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.green_light,
					orbit: 5,
				},
				{
					name: 'green_dark',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.green_dark,
					orbit: 5,
				},
				{
					name: 'green_toxic',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.green_toxic,
					orbit: 6,
				},
				{
					name: 'green_toxic_light',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.green_toxic_light,
					orbit: 6,
				},
				{
					name: 'green_toxic_dark',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.green_toxic_dark,
					orbit: 6,
				},
				{
					name: 'turquoise',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.turquoise,
					orbit: 7,
				},
				{
					name: 'turquoise_light',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.turquoise_light,
					orbit: 7,
				},
				{
					name: 'turquoise_dark',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.turquoise_dark,
					orbit: 7,
				},
				{
					name: 'aqua',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.aqua,
					orbit: 8,
				},
				{
					name: 'aqua_light',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.aqua_light,
					orbit: 8,
				},
				{
					name: 'aqua_dark',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.aqua_dark,
					orbit: 8,
				},
				{
					name: 'blue',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.blue,
					orbit: 9,
				},
				{
					name: 'blue_light',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.blue_light,
					orbit: 9,
				},
				{
					name: 'blue_dark',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.blue_dark,
					orbit: 9,
				},
				{
					name: 'purple',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.purple,
					orbit: 10,
				},
				{
					name: 'purple_light',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.purple_light,
					orbit: 10,
				},
				{
					name: 'purple_dark',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.purple_dark,
					orbit: 10,
				},
				{
					name: 'pink',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.pink,
					orbit: 11,
				},
				{
					name: 'pink',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.pink_light,
					orbit: 11,
				},
				{
					name: 'pink_dark',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: consts.colors.planet.pink_dark,
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
			color: consts.colors.systems.yellow,
			celestialBodies: [
				{
					name: 'Солнце',
					type: consts.types.star.value,
					size: consts.sizes.huge.value,
					color: '#FFD700',
					orbit: 0,
				},
				{
					name: 'Меркурий',
					type: consts.types.planet.value,
					size: consts.sizes.small.value,
					color: '#A9A9A9',
					orbit: 0.4,
					gravity: 0.38,
					temperature: 167,
				},
				{
					name: 'Венера',
					type: consts.types.planet.value,
					size: consts.sizes.medium.value,
					color: '#E6C229',
					orbit: 0.7,
					gravity: 0.91,
					temperature: 464,
				},
				{
					name: 'Земля',
					type: consts.types.planet.value,
					size: consts.sizes.medium.value,
					color: '#1E90FF',
					orbit: 1.0,
					gravity: 1.0,
					temperature: 15,
					moons: [
						{
							name: 'Луна',
							type: consts.types.sputnik.value,
							size: consts.sizes.small.value,
							color: '#C0C0C0',
							orbit: 0.002,
							gravity: 0.16,
							temperature: -23,
						},
					],
				},
				{
					name: 'Мюллер',
					type: consts.types.station.value,
					size: consts.sizes.medium.value,
					image: 'images/stations/1.png',
					orbit: 1.0,
					moons: [
						{
							name: 'Кулак Мюллера',
							type: consts.types.station.value,
							size: consts.sizes.medium.value,
							image: 'images/stations/1.png',
							orbit: 0.004,
						},
						{
							name: 'Глаз Мюллера',
							type: consts.types.station.value,
							size: consts.sizes.small.value,
							image: 'images/stations/2.png',
							orbit: 0.006,
						},
						{
							name: 'Ноготь Мюллера',
							type: consts.types.station.value,
							size: consts.sizes.huge.value,
							image: 'images/stations/3.png',
							orbit: 0.008,
						},
					],
				},
				{
					name: 'Марс',
					type: consts.types.planet.value,
					size: consts.sizes.medium.value,
					color: '#FF4500',
					orbit: 1.5,
					gravity: 0.38,
					temperature: -65,
					moons: [
						{
							name: 'Фобос',
							type: consts.types.sputnik.value,
							size: consts.sizes.small.value,
							color: '#A9A9A9',
							orbit: 0.0001,
							gravity: 0.005,
							temperature: -100,
						},
						{
							name: 'Деймос',
							type: consts.types.sputnik.value,
							size: consts.sizes.small.value,
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
			color: consts.colors.systems.orange,
			celestialBodies: [
				{
					name: 'Проксима Центавра',
					type: consts.types.star.value,
					size: consts.sizes.medium.value,
					color: '#FF6347',
					orbit: 0,
				},
				{
					name: 'Проксима b',
					type: consts.types.planet.value,
					size: consts.sizes.medium.value,
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
			color: consts.colors.systems.red,
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