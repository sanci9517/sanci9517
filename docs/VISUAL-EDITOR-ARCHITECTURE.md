# Sanci9517 Visual Editor – Canonical Architecture

## Purpose

This document freezes the architectural contract of the Visual Editor. Future features, including AI, must build on this model instead of introducing a second editor state or a second hierarchy system.

## Source of truth

The structured document tree is the source of truth:

```text
root
├── node
│   ├── child
│   └── child
└── node
```

Each node has a stable `id`, `type`, `children`, content, layout, style and metadata.

The Canvas, Layers and Inspector are views/controllers over the same document state. They must never maintain independent copies of the hierarchy.

## Canonical runtime

`public/editor/editor-core.js` is the canonical editor runtime.

`public/editor/app.js` remains the compatibility/application layer for:

- page loading and saving
- element definitions
- document normalization
- inspector fields
- existing page-management behaviour

It must not become a second source of truth for selection, hierarchy, layer order or editor rendering.

## Canonical state flow

```text
User / future AI
      ↓
Action
      ↓
Validation
      ↓
Document state
      ↓
History
      ↓
Canvas / Layers / Inspector
      ↓
Persistence (D1)
```

## Selection contract

Selection is centralized. The supported operations are:

- `select`
- `selectAdd`
- `selectRemove`
- `selectToggle`
- `clearSelection`

Canvas and Layers use the same node IDs.

## Hierarchy contract

The supported structural operations are:

- `parentOf`
- `hasDescendant`
- `moveToParent`
- `addChildren`
- `moveOut`

Circular relationships are rejected. A node may not become its own ancestor.

## Layer-order contract

Layer order is defined among siblings. The canonical operations are:

- `forward`
- `backward`
- `front`
- `back`

The hierarchy is never flattened to implement layer order.

## History contract

Mutating editor actions create a snapshot before the change. Undo and redo operate on the same document state used by Canvas and Layers.

History must not be created by a simple selection click. Drag operations create history only after an actual movement/resize begins.

## AI contract

AI must not directly manipulate arbitrary DOM/CSS when operating the editor.

AI will use the same structured editor actions as the human editor:

```text
AI intent
  ↓
structured action
  ↓
SanciEditor API
  ↓
validation
  ↓
state change
  ↓
history
  ↓
render
```

The current `SanciEditor` API is an AI-ready foundation, not yet the final autonomous AI layer. Future work can add action IDs, schemas, permissions, preview, approval, audit and rollback without replacing the document model.

## Stable IDs

The long-term platform uses stable IDs for:

- page
- section
- component
- element/node
- action
- version
- media
- schedule

## Compatibility rule

New editor functionality must extend the canonical core or call its public actions. New parallel implementations of selection, hierarchy, layer order or rendering are prohibited.

## Current version

Editor core schema/API generation: `3 / 1`.

The document schema remains compatible with the existing Sanci document structure.

## Long-term target

```text
Visual Editor
    ↓
Structured document engine
    ↓
Action/validation layer
    ↓
Versioning + audit + permissions
    ↓
AI Orchestrator
    ↓
Web Engineer / QA / Content / Stream agents
```

The Visual Editor must remain fully usable without AI.
