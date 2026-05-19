# Performance Optimization — Task Tracker

## Phase 1: Optimize Heavy CSS Effects (Progressive Enhancement)
- [ ] WutheringWavesUI.tsx — backdrop-blur & mix-blend
- [ ] WWSidebar.tsx — backdrop-blur
- [ ] WWInfoPanel.tsx — backdrop-blur
- [ ] WWTacticalProfile.tsx — backdrop-blur
- [ ] WWInsightBar.tsx — backdrop-blur & mix-blend
- [ ] WWRosterModal.tsx — backdrop-blur
- [ ] WWProsConsModal.tsx — backdrop-blur
- [ ] IntroSection.tsx — backdrop-blur & mix-blend (extended scope)
- [ ] BeginnerGuide.tsx — backdrop-blur & mix-blend (extended scope)

## Phase 2: Hardware Acceleration for Animations
- [ ] WutheringWavesUI.tsx — transform-gpu on motion.divs
- [ ] WWInfoPanel.tsx — transform-gpu on motion.div
- [ ] WWTacticalProfile.tsx — transform-gpu on motion.div
- [ ] WWInsightBar.tsx — transform-gpu on motion.div
- [ ] IntroSection.tsx — transform-gpu on parallax motion.divs

## Phase 3: Optimize Spine 2D WebGL Rendering
- [ ] WutheringWavesUI.tsx — conditional mount with useIsMobile
- [ ] WWInfoPanel.tsx — hide animation toggle on mobile

## Phase 4: Next.js Image Optimization
- [ ] WutheringWavesUI.tsx — replace <img> with <Image>
- [ ] WWRosterModal.tsx — replace <img> with <Image>

## Phase 5: Verification
- [ ] npm run build — no errors
- [ ] Browser test — modals, character switching, spine toggle
- [ ] Create final walkthrough report
