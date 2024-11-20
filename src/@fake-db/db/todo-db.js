import mock from "../mock";

const todoDB = {
  todos: [
    {
      id: "561551bd7fe2ff461101c192",
      title: "2",
      notes: " Rue de la Madeleine, 59000 Lille",
      startDate: new Date(2018, 8, 3),
      dueDate: new Date(2018, 8, 5),
      completed: false,
      starred: false,
      important: false,
      deleted: false,
      labels: [1],
    },
    {
      id: "561551bd7fe2ff61101c192",
      title: "3",
      notes: " Rue de la Madeleine, 59000 Lille",
      startDate: new Date(2018, 8, 3),
      dueDate: new Date(2018, 8, 5),
      completed: false,
      starred: false,
      important: false,
      deleted: false,
      labels: [2],
    },
    {
      id: "5551bd7fe2ff461101c192",
      title: "4",
      notes: " Rue de la Madeleine, 59000 Lille",
      startDate: new Date(2018, 8, 3),
      dueDate: new Date(2018, 8, 5),
      completed: false,
      starred: false,
      important: false,
      deleted: false,
      labels: [3],
    },
    {
      id: "5615517fe2ff461101c192",
      title: "5",
      notes: " Rue de la Madeleine, 59000 Lille",
      startDate: new Date(2018, 8, 3),
      dueDate: new Date(2018, 8, 5),
      completed: false,
      starred: false,
      important: false,
      deleted: false,
      labels: [4],
    },
    {
      id: "561551bd7fe2ff4611c192",
      title: "6",
      notes: " Rue de la Madeleine, 59000 Lille",
      startDate: new Date(2018, 8, 3),
      dueDate: new Date(2018, 8, 5),
      completed: false,
      starred: false,
      important: false,
      deleted: false,
      labels: [],
    },
    {
      id: "561551bd7fe2ff411c192",
      title: "7",
      notes: " Rue de la Madeleine, 59000 Lille",
      startDate: new Date(2018, 8, 3),
      dueDate: new Date(2018, 8, 5),
      completed: false,
      starred: false,
      important: false,
      deleted: false,
      labels: [],
    },
    {
      id: "5615bd7fe2ff4611c192",
      title: "8",
      notes: " Rue de la Madeleine, 59000 Lille",
      startDate: new Date(2018, 8, 3),
      dueDate: new Date(2018, 8, 5),
      completed: false,
      starred: false,
      important: false,
      deleted: false,
      labels: [],
    },
  ],
  folders: [
    {
      id: 0,
      handle: "all",
      title: "All",
      icon: "view_headline",
    },
  ],
  filters: [
    {
      id: 0,
      handle: "starred",
      title: "Starred",
      icon: "star",
    },
    {
      id: 1,
      handle: "important",
      title: "Priority",
      icon: "error",
    },
    {
      id: 2,
      handle: "dueDate",
      title: "Sheduled",
      icon: "schedule",
    },
    {
      id: 3,
      handle: "today",
      title: "Today",
      icon: "today",
    },
    {
      id: 4,
      handle: "completed",
      title: "Done",
      icon: "check",
    },
    {
      id: 5,
      handle: "deleted",
      title: "Deleted",
      icon: "delete",
    },
  ],
  labels: [
    {
      id: 1,
      handle: "rdv",
      title: "RDV",
      color: "#388E3C",
    },

    {
      id: 2,
      handle: "abs",
      title: "Absent",
      color: "#FF9800",
    },
    {
      id: 3,
      handle: "refus",
      title: "Refus",
      color: "#F44336",
    },
    {
      id: 4,
      handle: "hc",
      title: "Hors Cible",
      color: "#000000",
    },
  ],
};

mock.onGet("/api/todo-app/todos").reply((config) => {
  const { params } = config;
  let response = [];
  if (params.labelHandle) {
    const labelId = todoDB.labels.find(
      (label) => label.handle === params.labelHandle
    ).id;

    response = todoDB.todos.filter(
      (todo) => todo.labels.includes(labelId) && !todo.deleted
    );
  } else if (params.filterHandle) {
    if (params.filterHandle === "deleted") {
      response = todoDB.todos.filter((todo) => todo.deleted);
    } else {
      response = todoDB.todos.filter(
        (todo) => todo[params.filterHandle] && !todo.deleted
      );
    }
  } // folderHandle
  else {
    let { folderHandle } = params;
    if (!folderHandle) {
      folderHandle = "all";
    }

    if (folderHandle === "all") {
      response = todoDB.todos.filter((todo) => !todo.deleted);
    } else {
      const folderId = todoDB.folders.find(
        (folder) => folder.handle === folderHandle
      ).id;
      response = todoDB.todos.filter(
        (todo) => todo.folder === folderId && !todo.deleted
      );
    }
  }

  return [200, response];
});

mock.onPost("/api/todo-app/update-todo").reply((request) => {
  const todo = JSON.parse(request.data);

  todoDB.todos = todoDB.todos.map((_todo) => {
    if (_todo.id === todo.id) {
      return todo;
    }
    return _todo;
  });

  return [200, todo];
});

mock.onPost("/api/todo-app/new-todo").reply((request) => {
  const todo = JSON.parse(request.data);

  todoDB.todos = [todo, ...todoDB.todos];

  return [200, todo];
});

mock.onPost("/api/todo-app/remove-todo").reply((request) => {
  const todoId = request.data;
  todoDB.todos = todoDB.todos.map((_todo) => {
    if (_todo.id === todoId) {
      _todo.deleted = true;
    }
    return _todo;
  });
  return [200, todoId];
});

mock.onGet("/api/todo-app/filters").reply(200, todoDB.filters);
mock.onGet("/api/todo-app/labels").reply(200, todoDB.labels);
mock.onGet("/api/todo-app/folders").reply(200, todoDB.folders);

mock.onPost("/api/todo-app/set-folder").reply((request) => {
  const data = JSON.parse(request.data);
  const { selectedTodoIds, folderId } = data;
  todoDB.todos = todoDB.todos.map((_todo) => {
    if (selectedTodoIds.includes(_todo.id)) {
      return {
        ..._todo,
        folder: folderId,
      };
    }
    return _todo;
  });

  return [200];
});

mock.onPost("/api/todo-app/toggle-label").reply((request) => {
  const data = JSON.parse(request.data);
  const { selectedTodoIds, labelId } = data;
  todoDB.todos = todoDB.todos.map((_todo) => {
    if (selectedTodoIds.includes(_todo.id)) {
      return {
        ..._todo,
        labels: _todo.labels.includes(labelId)
          ? _todo.labels.filter((_id) => _id !== labelId)
          : [..._todo.labels, labelId],
      };
    }
    return _todo;
  });

  return [200];
});
mock.onPost("/api/todo-app/delete-todos").reply((request) => {
  const data = JSON.parse(request.data);
  const { selectedTodoIds } = data;
  todoDB.todos = todoDB.todos.filter((_todo) =>
    selectedTodoIds.includes(_todo.id) ? false : _todo
  );
  return [200];
});
