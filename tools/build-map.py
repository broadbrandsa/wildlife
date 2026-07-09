#!/usr/bin/env python3
"""Build src/components/game/map-geometry.ts from OSM data.

Projection contract (must match src/lib/game.ts):
  x = (lng - LNG0) / (LNG1 - LNG0)   0 = west edge, 1 = east edge
  y = (LAT0 - lat) / (LAT0 - LAT1)   0 = north edge, 1 = south edge
Rendered into a 360 x 760 viewBox. Normalised tap fractions therefore map
straight onto this drawing (the interactive layer is aspect-locked).
"""
import json, math, sys

VW, VH = 360, 760

def load(p):
    return json.load(open(p))

# ---------------------------------------------------------------- stitching
def stitch(ways):
    """Join way geometries that share endpoints into polylines."""
    segs = [[(pt["lon"], pt["lat"]) for pt in w.get("geometry", [])] for w in ways]
    segs = [s for s in segs if len(s) >= 2]
    out = []
    while segs:
        line = segs.pop(0)
        changed = True
        while changed:
            changed = False
            for i, s in enumerate(segs):
                if close(line[-1], s[0]):
                    line += s[1:]; segs.pop(i); changed = True; break
                if close(line[-1], s[-1]):
                    line += list(reversed(s))[1:]; segs.pop(i); changed = True; break
                if close(line[0], s[-1]):
                    line = s + line[1:]; segs.pop(i); changed = True; break
                if close(line[0], s[0]):
                    line = list(reversed(s)) + line[1:]; segs.pop(i); changed = True; break
        out.append(line)
    return out

def close(a, b, eps=1e-6):
    return abs(a[0]-b[0]) < eps and abs(a[1]-b[1]) < eps

# ---------------------------------------------------------------- simplify
def rdp(pts, eps):
    if len(pts) < 3:
        return pts
    def perp(p, a, b):
        if a == b:
            return math.hypot(p[0]-a[0], p[1]-a[1])
        t = ((p[0]-a[0])*(b[0]-a[0]) + (p[1]-a[1])*(b[1]-a[1])) / ((b[0]-a[0])**2 + (b[1]-a[1])**2)
        t = max(0, min(1, t))
        q = (a[0]+t*(b[0]-a[0]), a[1]+t*(b[1]-a[1]))
        return math.hypot(p[0]-q[0], p[1]-q[1])
    dmax, idx = 0, 0
    for i in range(1, len(pts)-1):
        d = perp(pts[i], pts[0], pts[-1])
        if d > dmax:
            dmax, idx = d, i
    if dmax > eps:
        left = rdp(pts[:idx+1], eps)
        right = rdp(pts[idx:], eps)
        return left[:-1] + right
    return [pts[0], pts[-1]]

# ---------------------------------------------------------------- main
bdata = load("kruger-boundary.json")
rel = bdata["elements"][0]
outer = [m for m in rel["members"] if m["type"] == "way" and m.get("role") == "outer"]
rings = stitch(outer)
rings.sort(key=len, reverse=True)
ring = rings[0]
print(f"boundary ring: {len(ring)} pts, {len(rings)} rings", file=sys.stderr)

lngs = [p[0] for p in ring]; lats = [p[1] for p in ring]
# pad the bbox a touch so the park is not glued to the frame
PAD_X = 0.06; PAD_Y = 0.015
LNG0 = min(lngs) - (max(lngs)-min(lngs)) * PAD_X
LNG1 = max(lngs) + (max(lngs)-min(lngs)) * PAD_X
LAT0 = max(lats) + (max(lats)-min(lats)) * PAD_Y
LAT1 = min(lats) - (max(lats)-min(lats)) * PAD_Y
print(f"bbox lng [{LNG0:.4f},{LNG1:.4f}] lat [{LAT1:.4f},{LAT0:.4f}]", file=sys.stderr)

def proj(lnglat):
    x = (lnglat[0]-LNG0)/(LNG1-LNG0)*VW
    y = (LAT0-lnglat[1])/(LAT0-LAT1)*VH
    return (x, y)

def nproj(lnglat):
    return ((lnglat[0]-LNG0)/(LNG1-LNG0), (LAT0-lnglat[1])/(LAT0-LAT1))

def path_of(pts, close_path=False, prec=1):
    xy = [proj(p) for p in pts]
    d = f"M{xy[0][0]:.{prec}f},{xy[0][1]:.{prec}f}"
    for p in xy[1:]:
        d += f" L{p[0]:.{prec}f},{p[1]:.{prec}f}"
    if close_path:
        d += " Z"
    return d

ring_s = rdp(ring, 0.004)  # ~400 m tolerance
print(f"simplified boundary: {len(ring_s)} pts", file=sys.stderr)
park_path = path_of(ring_s, close_path=True)

# rivers ---------------------------------------------------------------
rdata = load("kruger-rivers.json")
by_name = {}
for w in rdata["elements"]:
    n = w["tags"].get("name", "")
    key = None
    tier = 1
    for want in ["Luvuvhu", "Shingwedzi", "Letaba", "Olifants", "Timbavati", "Sabie", "Crocodile", "Limpopo"]:
        if want.lower() in n.lower():
            key = want
    if key is None:
        for want in ["N'wanetsi", "Sweni", "Tsendze", "Mphongolo", "N'waswitsontso", "Phugwane", "Biyamiti", "Mbyamiti"]:
            if want.lower() in n.lower():
                key = want; tier = 2
    if key:
        by_name.setdefault((key, tier), []).append(w)

river_entries = []
for (name, tier), ways in by_name.items():
    lines = stitch(ways)
    lines.sort(key=lambda l: len(l), reverse=True)
    keep = [l for l in lines if len(l) > 30][:2] or lines[:1]
    for l in keep:
        # clip points outside the frame with margin
        l = [p for p in l if LNG0-0.05 <= p[0] <= LNG1+0.05 and LAT1-0.05 <= p[1] <= LAT0+0.05]
        if len(l) < 10:
            continue
        s = rdp(l, 0.006)
        river_entries.append((name, tier, path_of(s)))
        print(f"river {name} (t{tier}): {len(l)} -> {len(s)} pts", file=sys.stderr)

# camps & places -------------------------------------------------------
CAMPS = [
    ("Pafuri", 31.198, -22.4266),
    ("Punda Maria", 31.0169, -22.6927),
    ("Shingwedzi", 31.4331, -23.1086),
    ("Mopani", 31.3931, -23.5217),
    ("Letaba", 31.5753, -23.8556),
    ("Olifants", 31.7392, -24.0067),
    ("Satara", 31.7786, -24.3931),
    ("Orpen", 31.3878, -24.4764),
    ("Skukuza", 31.5969, -24.9948),
    ("Lower Sabie", 31.9153, -25.1195),
    ("Pretoriuskop", 31.2686, -25.1706),
    ("Berg-en-Dal", 31.4469, -25.4264),
    ("Crocodile Bridge", 31.8933, -25.3583),
]
LANDMARKS = [
    ("Crooks Corner", 31.3067, -22.4258),
    ("Red Rocks", 31.2833, -23.15),
    ("Olifants Gorge", 31.85, -24.05),
    ("Nwanetsi", 31.98, -24.45),
]
K9_BASE = (30.99, -24.53)  # SAWC campus, west of Orpen

def fmt_pt(name, lnglat):
    x, y = proj(lnglat)
    return f'    {{ label: "{name}", x: {x:.1f}, y: {y:.1f} }},'

# thirds + zone helper fractions for lib/game.ts (printed for reference)
for nm, lng, lat in CAMPS:
    nx, ny = nproj((lng, lat))
    print(f"  frac {nm}: x={nx:.3f} y={ny:.3f}", file=sys.stderr)
MATHEKENYANE = (31.5306, -25.1128)
mx, my = nproj(MATHEKENYANE)
print(f"  POACHER Mathekenyane frac: x={mx:.3f} y={my:.3f}", file=sys.stderr)
for nm, lat in [("Luvuvhu split", -22.75), ("Punda/Shingwedzi split", -23.0), ("Letaba river", -23.86), ("Olifants river", -24.06), ("Tshokwane split", -24.75), ("SW split", -25.6)]:
    _, fy = nproj((31.5, lat))
    print(f"  band {nm}: y={fy:.3f}", file=sys.stderr)

# emit TS ---------------------------------------------------------------
out = []
out.append("// GENERATED from OpenStreetMap data (relation 1752987, Kruger National Park)")
out.append("// by scratchpad/build-map.py. Real geography projected into a 360x760 viewBox.")
out.append("// Projection: x = (lng - %.4f) / %.4f, y = (%.4f - lat) / %.4f" % (LNG0, LNG1-LNG0, LAT0, LAT0-LAT1))
out.append("// Data (c) OpenStreetMap contributors, ODbL.")
out.append("")
out.append(f"export const MAP_W = {VW};")
out.append(f"export const MAP_H = {VH};")
out.append("")
out.append(f'export const PARK_PATH = "{park_path}";')
out.append("")
out.append("export interface RiverPath { name: string; d: string; tier: 1 | 2 }")
out.append("export const RIVER_PATHS: RiverPath[] = [")
for name, tier, d in sorted(river_entries, key=lambda e: e[1]):
    nm = name.replace("'", "\\'")
    out.append(f"    {{ name: '{nm}', d: \"{d}\", tier: {tier} }},")
out.append("];")
out.append("")
out.append("export interface Place { label: string; x: number; y: number }")
out.append("export const CAMPS: Place[] = [")
for nm, lng, lat in CAMPS:
    out.append(fmt_pt(nm, (lng, lat)))
out.append("];")
out.append("")
out.append("export const LANDMARKS: Place[] = [")
for nm, lng, lat in LANDMARKS:
    out.append(fmt_pt(nm, (lng, lat)))
out.append("];")
out.append("")
kx, ky = proj(K9_BASE)
out.append(f"export const K9_BASE = {{ x: {kx:.1f}, y: {ky:.1f} }};")
out.append("")

with open("map-geometry.ts", "w") as f:
    f.write("\n".join(out) + "\n")
print("wrote map-geometry.ts, %d bytes" % len("\n".join(out)), file=sys.stderr)
