# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a test/demo project using **Spark** (`@sparkjsdev/spark`), an advanced 3D Gaussian Splatting renderer for THREE.js. The project currently has no source files beyond the dependency — it's set up for experimenting with Spark's API.

## Dependencies

- `@sparkjsdev/spark` v2.0.0-preview — installed from GitHub (`sparkjsdev/spark#v2.0.0-preview`)
- `fflate` — transitive dependency (compression library)

Install with: `npm install`

## Key Concepts

Spark integrates with THREE.js to render 3D Gaussian Splats. The core API pattern:

```js
import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";

const splat = new SplatMesh({ url: "path/to/file.spz" });
scene.add(splat);
```

Supported splat formats: `.PLY`, `.SPZ`, `.SPLAT`, `.KSPLAT`, `.SOG`

## Assets

- `splats/` — contains `.ply` splat files for rendering
- Spark docs and examples: https://sparkjs.dev/

## Goal

https://sparkjs.dev/2.0.0-preview/
このドキュメントを参考に、sparkを使ってsplats/以下のファイルを閲覧するWebページを作ってください。
