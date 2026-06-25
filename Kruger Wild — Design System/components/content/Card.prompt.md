Editorial content card for species, articles, trails, and lodges. Composes Eyebrow, Tag, Badge, Button inside.

```jsx
<Card
  media={<PhotoPlate icon="paw-print" label="African leopard" />}
  eyebrow={<Badge status="vu" />}
  title="Leopard"
  meta="-24.0° S · CREPUSCULAR"
  description="Solitary, secretive, and the most elusive of the Big Five."
  footer={<><Tag tone="green">Riverine</Tag><Button size="sm" variant="ghost">View</Button></>}
/>
```

Default mode stacks media → content. `overlay` mode lays title/description over the media with a protection gradient — use for hero tiles and destination cards. `hoverLift` adds the lift+shadow interaction (default on).
