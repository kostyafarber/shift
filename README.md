<div align="center">
  <p align="center">
    <img width=150 src="https://github.com/user-attachments/assets/521e2732-341d-441d-bb6d-bf7bcdccf764" />
    <h1 align="center"><b>Shift</b></h1
>
    <p>A modern, cross-platform font editor built with TypeScript and Rust, focused on bringing contemporary technologies and design principles to type design.</p>
  </p>
</div>

## Why Shift?
Shift aims to redefine font editing by combining the power of Rust for performance-critical tasks with the flexibility of web-based UI technologies. Whether you're a type designer or a developer, Shift offers a fresh approach to creating and editing fonts with a focus on speed, precision, and extensibility.

> [!IMPORTANT]
> Shift is in a pre-alpha state and is currently only suitable for developers interested in contributing to the project

## Architecture
Shift uses the Tauri framework:

* __UI__: Uses React and Vite for components around the canvas
* __Rendering__: Webview based UI utilising the HTML canvas and rendered with CanvasKit (Skia) for high-quality graphics
* __State management__: Zustland for global React state mangement
* __Backend__: Rust for high-intensive operations and font related processing

## Development Roadmap
We aim to implement the typical features present in font editors such as FontForge, Glyphs, RobotFont etc.

## License
[GNU General Public License (GPL) v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)

Copyright © 2025 Kostya Farber. All rights reserved.
