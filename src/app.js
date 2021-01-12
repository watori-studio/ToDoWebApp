Vue.createApp({
  // アプリケーションの定義
  data: function () {
    return {
      todoTitle: '',
      todoDescription: '',
      searchWord: '',
      todoCategories: [],
      selectedCategory: this.currentSelectedCategory,
      todos: [],
      categories: [],
      hideDoneTodo: false,
      order: 'desc',
      categoryName: '',
      count: 0,
      testText: '',
      storedTodoCategories: this.storedTodoCategories,
    };
  },
  // データの変更を監視する
  watch: {
    todos: {
      handler: function (next) {
        // localにjs形式で一時保存する
        window.localStorage.setItem('todos', JSON.stringify(next));
      },
      deep: true,
    },
    categories: {
      handler: function (next) {
        // localにjs形式で一時保存する
        window.localStorage.setItem('categories', JSON.stringify(next));
      },
      deep: true,
    },
  },

  // イベント実行時の動作を定義
  methods: {
    createTodo: function () {
      // Todo　作成チェック
      if (!this.canCreateTodo) {
        alert('作成できません。');
        return;
      }
      this.todos.push({
        id: 'todo-' + Date.now,
        title: this.todoTitle,
        description: this.todoDescription,
        categories: this.todoCategories,
        dateTime: Date.now(),
        done: false,
      });

      alert('作成しました');

      //　クリア処理
      this.todoTitle = '';
      this.todoDescription = '';
      this.todoCategories = [];
    },

    createCategory: function () {
      if (!this.canCreateCategory) {
        alert('カテゴリが未入力です。');
        return;
      }
      alert('カテゴリー「' + this.categoryName + '」を作成しました。');
      this.categories.push(this.categoryName);
      this.storedTodoCategories.push(this.categoryName);
      this.categoryName = '';
    },
    // ライフサイクルイベント(vueのインスタンス生成時に呼び出しする)
    created: function () {
      const todos = window.localStorage.getItem('categories');
      const categories = window.localStorage.getItem(
        'categories',
        JSON.stringify(next)
      );

      if (todos) {
        this.todos = JSON.parse(todos);
      }
      if (categories) {
        this.categories = JSON.parse(categories);
      }
      alert('作成しました。');
    },
  },

  computed: {
    // 必須属性
    canCreateTodo: function () {
      return this.todoTitle !== '';
    },
    canCreateCategory: function () {
      return this.categoryName !== '' && !this.existsCategory;
    },

    existsCategory: function () {
      return (
        this.categories.indexOf(this.categoryName) !== -1 ||
        this.storedTodoCategories.indexOf(this.categoryName) !== -1
      );
    },

    joinedToDoCategories: function () {
      return this.todoCategories.join(' / ');
    },
    categoryText: function () {
      return '選択されているカテゴリー: ' + this.joinedToDoCategories;
    },
    dateFormat: function () {
      const date = new Date();
      return date.getFullYear() + '/' + (date.getMonth() + 1);
    },
    hasTodos: function () {
      const a = JSON.parse(localStorage.getItem('todos')).length > 0;

      return this.todos.length > 0 || a;
    },
    storedTodoCategories: function () {
      const categories = JSON.parse(localStorage.getItem('categories'));
      if (categories) {
        return categories;
      } else {
        return [];
      }
    },
    currentSelectedCategory: function () {
      const selectedCategoryEl = document.getElementById(
        'todo-search-category'
      );
      let selectedCategory = '';
      if (selectedCategoryEl) {
        selectedCategory = selectedCategoryEl.value;
      }
      return selectedCategory;
    },

    resultTodos: function () {
      const selectedCategory = this.selectedCategory;

      const hideDoneTodo = this.hideDoneTodo;
      const order = this.order;
      const serchWord = this.searchWord;

      const currentTodos = JSON.parse(localStorage.getItem('todos'));
      return currentTodos
        .filter(function (todo) {
          // カテゴリーの条件
          return (
            !selectedCategory ||
            todo.categories.indexOf(selectedCategory) !== -1
          );
        })
        .filter(function (todo) {
          // 非表示のTodoはfalseを返却
          if (hideDoneTodo) {
            return !todo.done;
          }
          return true;
        })
        .filter(function (todo) {
          // タイトル、概要の部分一致検索
          return (
            todo.title.indexOf(serchWord) !== -1 ||
            todo.description.indexOf(serchWord) !== -1
          );
        })
        .sort(function (a, b) {
          if (order === 'asc') {
            return a.dateTime - b.dataTime;
          }
          return b.dateTime - a.dateTime;
        });
    },
  },
}).mount('#app');
