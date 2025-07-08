const quests = {
  active: [
    {
      id: 1,
      title: "Разведка сектора Альфа",
      description: "Исследуйте новые системы в секторе Альфа",
      tasks: [
        {
          id: 1,
          title: "Достигнуть сектора Альфа",
          location: { type: "sector", sector: "Сектор Альфа" },
          status: "active",
        },
        {
          id: 2,
          title: "Исследовать Солнечную систему",
          location: { type: "system", system: "Солнечная система" },
          status: "active",
        },
        {
          id: 3,
          title: "Посетить Марс",
          location: { type: "planet", system: "Солнечная система", planet: "Марс" },
          status: "active",
        },
        {
          id: 4,
          title: "Посетить Луну",
          location: { type: "moon", system: "Солнечная система", planet: "Земля", moon: "Луна" },
          status: "active",
        },
      ],
      status: "active",
    },
  ],
  completed: [
    {
      id: 2,
      title: "Первое путешествие",
      description: "Ознакомительный полет",
      tasks: [
        {
          id: 1,
          title: "Выйти за пределы Солнечной системы",
          status: "completed",
        },
      ],
      status: "completed",
    },
  ],
};
