# Team Rotation Timeline — Task Tracker

## Phase 1: TypeScript Interfaces
- [x] Add TeamRotationEvent interface to types/guide.ts
- [x] Add RotationConfig interface to types/guide.ts
- [x] Add rotation_timeline field to GuideContent

## Phase 2: Timeline Player Component
- [x] Create components/ww/TeamRotationTimeline.tsx
- [x] 3-lane layout with slot labels + avatars
- [x] Playhead animation (requestAnimationFrame + transform-gpu)
- [x] Play/Pause + digital timer
- [x] Click-to-seek on ruler
- [x] Active block detection + glow effect
- [x] Color-coded event type blocks
- [x] Auto-loop at totalDuration
- [x] Empty state / placeholder UI (RotationEmptyState)
- [x] Mobile responsive (horizontal scroll)

## Phase 3: Tab Integration
- [x] Import TeamRotationTimeline in GuideClient.tsx
- [x] Add 'ROTATION' to tabs array
- [x] Add conditional render block for ROTATION tab

## Phase 4: Admin Panel Rotation Builder
- [x] Create components/admin/RotationBuilder.tsx
- [x] Add "rotation" tab to admin tabs array
- [x] Import + render RotationBuilder in admin page
- [x] Event list editor (add/edit/remove)
- [x] Live timeline preview
- [x] Slot name + totalDuration inputs
