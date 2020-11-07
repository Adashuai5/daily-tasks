#!/usr/bin/env node
const { Command } = require("commander");
const program = new Command();
const api = require("./index.js");
const pkg = require("./package.json");

program
  .version(pkg.version)
  .arguments("")
  .action(() => {
    const { argv } = process;
    const { length } = argv;

    if (length === 2) {
      api.showAll();
      return;
    }
    if (length >= 2) {
      if (argv[2] !== "add" || argv[2] !== "clear") {
        console.log(`error: unknown command '${argv[2]}'. See 'dt --help'.`);
      }
    }
  });
program
  .command("add")
  .description("add a task")
  .action((...args) => {
    if (!args[1]) {
      console.log("请输入任务名");
      return;
    }
    api.add(args[1].join(" ")).then(
      () => {
        console.log("添加成功");
      },
      () => {
        console.log("添加失败");
      }
    );
  });
program
  .command("clear")
  .description("clear all tasks")
  .action(() => {
    api.clear().then(
      () => {
        console.log("清除成功");
      },
      () => {
        console.log("清除失败");
      }
    );
  });

program.parse(process.argv);
