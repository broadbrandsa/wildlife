Standard imagery treatment. Use everywhere a photo goes — it renders a branded duotone placeholder until a real `src` is supplied, then keeps the photo on-palette with a warm overlay.

```jsx
{/* placeholder */}
<PhotoPlate wash="bushveld" icon="paw-print" label="African leopard" />
{/* real photography */}
<PhotoPlate src="/assets/leopard.jpg" alt="Leopard on a marula branch" />
```

Washes: `bushveld` (green), `savanna` (gold), `clay`, `dawn` (teal), `sand` (light). Fill a sized parent (e.g. inside Card `media`).
