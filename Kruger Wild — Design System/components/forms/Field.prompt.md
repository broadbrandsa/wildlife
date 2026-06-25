Labeled text input with optional leading icon, hint, and error. Use for search, booking forms, newsletter signup.

```jsx
<Field label="Search species" icon={<i className="ph ph-magnifying-glass" />} placeholder="Leopard, marula, fish eagle…" />
<Field label="Email" type="email" required hint="We'll send your itinerary here." />
```

Pass `error` to show a red message and red border. `inputStyle` targets the inner `<input>`.
