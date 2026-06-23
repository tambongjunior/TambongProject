# React + Vite Starter

This repository serves as a foundational template, providing a lightweight setup to launch a React application using Vite. It offers out-of-the-box support for Hot Module Replacement (HMR) and incorporates standard ESLint configurations for code quality.

Currently, you can choose between two official plugins:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react): Powered by [Oxc](https://oxc.rs) to handle compilation.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc): Driven by the blazing fast [SWC](https://swc.rs/) compiler.

## About React Compiler

By default, the React Compiler is disabled in this template due to its potential impact on development and build performance times. If you wish to enable it, please refer to the official [installation documentation](https://react.dev/learn/react-compiler/installation).

## Extending ESLint Configuration

If you are building a full-scale production application, adopting TypeScript alongside type-aware linting rules is highly recommended. For detailed guidance on incorporating TypeScript and the [`typescript-eslint`](https://typescript-eslint.io) plugin into your project, check out the official [Vite TS Template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts).
