# Email Template Builder — Project Overview

The Email Template Builder is a visual drag-and-drop editor that enables users to create responsive email templates without writing code. It combines a component-based architecture with real-time preview, property editing, layer management, and HTML code visibility — all within a single-page application.

The builder is part of a larger platform that includes a widget-based chatbot interface. The chatbot renders structured responses (tables, forms, bullets, images) as interactive widgets, and can launch the email template builder as an embedded widget within the chat.

---

## The Problem

Creating email templates is tedious and error-prone. Email HTML has unique constraints — no flexbox, limited CSS, table-based layouts — that make hand-coding painful. Existing builders are either too simple (limited customisation) or too complex (enterprise tools with steep learning curves). Most lack real-time preview, code visibility, and the ability to chain template creation into a conversational workflow.

---

## The Solution

A three-panel visual editor with a bottom code panel:

- **Left Panel (20%)** — component library (basic, custom, column layouts) with drag-and-drop
- **Middle Panel (60%)** — live canvas (600px email width) with component selection, inline editing, and DnD reordering
- **Right Panel (20%)** — properties editor, layer tree, and image gallery
- **Bottom Panel (100%)** — HTML code viewer/editor with syntax highlighting and bidirectional sync

Components are dragged from the library onto the canvas. Selecting a component populates the properties panel. All changes reflect in real-time across the canvas, properties panel, and HTML output.

The template builder is also accessible as a **chatbot widget** — the AI can open it in response to a user request like "build me an email template", embedding the full editor inside the chat interface.

---

## How It's Built

The frontend is a **Next.js 16** application with **Tailwind CSS v4** for styling. State management uses **Redux Toolkit** with four slices: `chat`, `ui`, `templateBuilder`, and `emailBuilder`. Drag-and-drop is powered by **DnD Kit** (core + sortable). Icons use **Font Awesome**. HTML preview uses **react-syntax-highlighter**.

The application has two main interfaces:

1. **Widget-Based Chatbot** — dark-themed conversational UI with sidebar history, chat area with widget rendering (paragraphs, tables, bullets, forms, images, template builder), and a chat input with attachments.

2. **Email Template Builder** — four-panel visual editor that can run standalone or embedded as a chatbot widget.

The component tree is stored as a nested array in Redux. Each component has an `id`, `type`, `props`, `children`, `parentId`, `visibility`, and `locked` state. Helper functions traverse the tree for find, remove, move, and duplicate operations.

---

## Key Features

- Drag-and-drop component placement from library to canvas
- Real-time template preview at email width (600px)
- Component selection with property editing
- Layer management with visibility/lock toggles
- HTML code viewer with syntax highlighting
- Device preview (desktop, tablet, mobile)
- Zoom controls
- Template metadata (name, subject, from, reply-to)
- Widget-based chatbot with structured response rendering
- Dark theme chat interface with conversation history

---

## Who It's For

Email marketers, designers, and business users who need to create professional email templates quickly. The chatbot interface makes it accessible to non-technical users — they can describe what they want, and the AI can help build it.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 |
| Styling | Tailwind CSS v4 |
| State | Redux Toolkit |
| DnD | @dnd-kit/core + @dnd-kit/sortable |
| Icons | Font Awesome |
| Code Highlight | react-syntax-highlighter |
| IDs | uuid v13 |
| Screenshot | html2canvas |

---

_Email Template Builder — Visual Email Design, Conversational Workflow_
_Document Version 1.0 | March 2026_
