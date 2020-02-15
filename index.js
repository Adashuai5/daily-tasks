const db = require("./db");
const inquirer = require("inquirer");

module.exports.add = async title => {
  // 读取已有任务
  const list = await db.read();
  // 添加新任务
  list.push({ title, done: false });
  // 存储到文件
  await db.write(list);
};

module.exports.clear = async () => {
  await db.write([]);
};

module.exports.showAll = async () => {
  const list = await db.read();
  printTasks(list);
};

function taskAsDone(list, index) {
  list[index].done = true;
  db.write(list);
}

function taskAsUndone(list, index) {
  list[index].done = false;
  db.write(list);
}

function remove(list, index) {
  list.splice(index, 1);
  db.write(list);
}

function updateTitle(list, index) {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "新的标题",
      default: list[index].title
    })
    .then(answer => {
      list[index].title = answer.title;
      db.write(list);
    });
}

function askForAction(list, index) {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "请选择操作",
      choices: [
        { name: "退出", value: "quit" },
        { name: "已完成", value: "taskAsDone" },
        { name: "未完成", value: "taskAsUndone" },
        { name: "修改标题", value: "updateTitle" },
        { name: "删除", value: "remove" }
      ]
    })
    .then(answer2 => {
      const actionList = { taskAsDone, taskAsUndone, updateTitle, remove };
      const action = actionList[answer2.action];
      action && action(list, index);
    });
}

function askForCreateTask(list, index) {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "新的标题"
    })
    .then(answer => {
      list.push({ title: answer.title, done: false });
      db.write(list);
    });
}

function printTasks(list) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "index",
        message: "请选择你想操作的任务",
        choices: [
          { name: "退出", value: -1 },
          ...list.map((task, index) => {
            return {
              name: `${task.done ? "[×]" : "[_]"} ${index + 1} - ${task.title}`,
              value: index
            };
          }),
          { name: "+创建任务", value: -2 }
        ]
      }
    ])
    .then(answer => {
      const index = answer.index;
      if (index >= 0) {
        askForAction(list, index);
      } else if (index === -2) {
        askForCreateTask(list, index);
      }
    });
}
