#!/usr/bin/env node
const program = require("commander");
const api = require("./index.js");
const pkg = require("./package.json");

program.version(pkg.version);
program
  .option("-d, --debug", "output extra debugging")
  .option("-s, --small", "small pizza size")
  .option("-p, --pizza-type <type>", "flavour of pizza");
program
  .command("add")
  .description("add a task")
  .action((...args) => {
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

if (process.argv.length === 2) {
  void api.showAll();
}
