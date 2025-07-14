# SyncSphere

A web-based prototype of a PC app to route audio output simultaneously to multiple headphones and devices, and share video content with others. This is a Next.js app bootstrapped with Firebase Studio.

## Cross-Platform Prototype: The "How"

This application is built as a web app using Next.js and React. This means it can run on any modern web browser across different operating systems, including **Windows, macOS, and Linux**.

While it demonstrates the user interface and features of an audio routing tool, it operates within the security sandbox of a web browser. This means **it cannot directly control your computer's system audio or interact with other applications like VLC or games**.

In a real-world scenario, this web-based UI would be packaged into a native desktop application using a framework like [Electron](https://www.electronjs.org/) or [Tauri](https://tauri.app/). This step would grant the application the necessary permissions to access and manage system-level audio hardware, enabling it to route sound from any source to multiple outputs simultaneously.

Think of this project as the high-fidelity, interactive blueprint for that final desktop application.