# Development 🚧
There are two pieces of code for the extension, one piece is extension code which runs under nodejs environment and located in `src/` and it's entry file is `extension.ts`. Another piece of code is for UI, which is basically a webview and uses react, and located in `src/app`. And there is `src/shared` which contains the code that being used by the extension and webapp.

## Prerequisite
- Node LTS version
- Visual Studio Code
- yarn

## 💻 Setup
- clone this repository
- install node dependencies 

## 🏃 To debug extension
- run  `yarn watch` 
  - *watch command watches files changes of extension and webview*
- In VScode press `F5` or run debug config named `Run Extension`
  - *This opens new vscode instance which would have extension already installed*
  - *To view new changes of extension new vscode instance needs to reload by vscode command `Developer: Reload window`*
  - *New changes of UI/webview can be refresh by vscode command `Developer: Reload webviwes` or just closing and reopening extension sidebar window*

## 🎨 To develop Webview UI
This project contains storybook configuration which can run by `yarn storybook` command. and all the UI stories defined into `*.stories.tsx`
