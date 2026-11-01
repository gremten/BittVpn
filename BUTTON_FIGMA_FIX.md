# BitVPN Button – Figma CSS outline fix

Patch against the latest TMA-share build.

Changes:
- removes the SVG outline layer from the shared `Button` component;
- outlined is again a native stretchable button border: `1.5px dashed rgba(233,240,243,.20)`;
- restores Figma size minima/paddings: xsmall 44×24, small min 68×32, medium min 76×44, large min 76×56;
- restores squircle radii: 8 / 12 / 16 / 16;
- restores icon sizing: 16px for xsmall/small, 24px for medium/large;
- keeps outlined interaction transparent and press-scale only;
- aligns warning/menu states to the Figma component set.

Replace the two files under `src/components/ui/`.
