# bcx

A lightweight utility for working with CSS and Tailwind classes.

## Why does this exist?
If you are using Tailwind, there’s a high chance you’re also using `clsx`, `tailwind-merge`, or `class-variance-authority (cva)`. Very likely all three of them.

The goal of this library is to unify the functionality of `clsx` and `cva` in a slightly opinionated way. For class building and merging, that means adding sensible constraints. For variants management, a simpler, more streamlined API.

## Features
- Conditional class name composition (like clsx)
- Variant class management (inspired by cva)