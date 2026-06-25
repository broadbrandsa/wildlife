Status indicator with a leading dot. Built for IUCN conservation statuses on species pages, but tones are generic too.

```jsx
<Badge status="vu" />            {/* → "Vulnerable" */}
<Badge status="en">Endangered</Badge>
<Badge status="lc" solid />
```

Statuses: `lc` (Least Concern), `nt` (Near Threatened), `vu` (Vulnerable), `en` (Endangered), `cr` (Critically Endangered), plus `info` / `neutral`. IUCN statuses auto-label when no children are passed.
