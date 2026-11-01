# Bonus segmented control

The checkout bonus selector is a real segmented control, not two independent Button instances.

- Figma layout source: `6606:23748`
- container: 330×52 in the 362px checkout card, padding 4, radius 20
- two equal slots, 44px high
- active pill: `#242A33`, radius 16
- both labels stay visible throughout interaction
- tap selects a segment
- horizontal drag snaps the shared active pill between the real segment slots
- the pill never follows a free X position
- Motion timing is shared with Navigator through `motionTransitions.js`
- segmented slots intentionally do not inherit the generic Button press-scale
