import { ShortcutInput } from 'ng-keyboard-shortcuts';

export const boardShortcuts : ShortcutInput[] = [
  {
    key: ["?"],
    label: "Help",
    description: "Question mark",
    command: e => console.log("question mark clicked", { e }),
    preventDefault: true
  },
  {
    key: ["up up down down"],
    label: "Sequences",
    description: "Konami code!",
    command: e => console.log(e)
  },
  {
    key: ["ctrl + b"],
    label: "Help",
    description: "Ctrl + b",
    command: e => console.log(e),
    preventDefault: true
  }
]