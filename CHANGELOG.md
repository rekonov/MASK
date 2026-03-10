# Changelog

All notable changes to the MASK project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project is pre-release and uses date-based sections until a formal versioning scheme is adopted.

## [Unreleased]

## [0.1.0-dev] - 2026-03-10

### Added

- Initial MASK zero-knowledge identity generator.
- Client-side identity generation: name, surname, username, phone, address, DOB, email.
- Deterministic geometric avatar generation via Canvas (hash-based seeding, 8 color palettes).
- Live temporary email integration via mail.tm API with auto-refresh.
- CORS proxy API route (`/api/mail`) with rate limiting (30 req/60s per IP).
- Copy-to-clipboard for all identity fields with visual feedback.
- Dark/light theme toggle with localStorage persistence.
- HTML email rendering with DOMPurify sanitization.
- GitLab CI pipeline (lint, build).
- Unit tests for generator, avatar, and tempmail (15 tests).
- ESLint configuration.

### Changed

- Removed empty screenshots placeholder from README.
