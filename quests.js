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
          location: { type: "sector", id: "Сектор Альфа" },
          status: "active",
        },
        {
          id: 2,
          title: "Исследовать Солнечную систему",
          location: { type: "system", id: 1 },
          status: "active",
        },
        {
          id: 3,
          title: "Посетить Марс",
          location: { type: "planet", systemId: 1, name: "Марс" },
          status: "active",
        },
        {
          id: 4,
          title: "Посетить Луну",
          location: { type: "moon", systemId: 1, celestialName: "Мюллер", name: "Кулак Мюллера" },
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
