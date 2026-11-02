#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把 Nam Wah Battery Co Pte Ltd（Amaron 新加坡经销商）的《Vehicle Application Guide》里的行，整理成车型页用的数据。
来源：https://www.namwah.com.sg/battery-catalogues （老板 2026-11-02 确认可直接引用，他从该公司拿货）。
用法：build-fitment.py <从 PDF 解析出的行 JSON> ；输出写入 data/cars.json 的 fitment 字段。PDF 不进仓库，只存挑出的几行事实。
指南里的老型号名对应现在供货商在售的型号（Nam Wah 产品页标题写明 aka）：55B24x → 60B24x，42B20L/R → 50B20L/42B20R，JADE AGM L1~L5 → AGM LN1~LN5。
"""
import json, re, sys
rows = json.load(open(sys.argv[1], encoding="utf-8"))
cars = json.load(open("data/cars.json", encoding="utf-8"))
prices = json.load(open("data/prices.json", encoding="utf-8"))["items"]

SELECT = {  # slug: (指南里的品牌, 车型名正则)
    "toyota-corolla-altis": ("Toyota", r"^Corolla"), "toyota-camry": ("Toyota", r"^Camry"), "toyota-prius": ("Toyota", r"^Prius"),
    "toyota-chr": ("Toyota", r"C-HR|Koba"), "toyota-rav4": ("Toyota", r"^Rav4"),
    "honda-civic": ("Honda", r"^Civic"), "honda-accord": ("Honda", r"^Accord"), "honda-crv": ("Honda", r"^CR-V"), "honda-jazz": ("Honda", r"^Jazz"), "honda-hrv": ("Honda", r"^HR-V"),
    "nissan-xtrail": ("Nissan", r"^X-Trail"), "mazda-3": ("Mazda", r"^Mazda 3"), "mazda-cx5": ("Mazda", r"^CX-5"),
    "hyundai-avante": ("Hyundai", r"^Elantra"), "hyundai-tucson": ("Hyundai", r"^Tucson"), "mitsubishi-asx": ("Mitsubishi", r"^ASX"),
    "subaru-xv": ("Subaru", r"^XV"), "kia-cerato": ("Kia", r"^Cerato"), "volkswagen-golf": ("Volkswagen", r"^Golf"),
    "bmw-3-series": ("BMW", r"^(3 Series|3\d\d)"), "bmw-5-series": ("BMW", r"^(5 Series|5\d\d)"),
    "mercedes-c-class": ("Mercedes", r"^C[ -]?Class|^C\d\d\d"), "mercedes-e-class": ("Mercedes", r"^E[ -]?Class|^E\d\d\d"),
    "audi-a4": ("Audi", r"^A4"), "audi-a6": ("Audi", r"^A6"),
}
def end_year(y):
    m = re.search(r"(\d{4})\s*$", y); 
    return 9999 if y.lower().endswith("on") else (int(m.group(1)) if m else 0)
def to_code(b):
    """指南里的型号 → 我们价格表里的型号；对不上返回 None（页面显示“询价”）。"""
    b = re.sub(r"\s*X\s*2$", "", b.replace("AMARON", "").strip())
    b = re.sub(r"^(FLO|PRO|JADE|ONYX)\s+", "", b)
    for a, c in (("42B20L", "50B20L"), ("42B20R", "42B20R"), ("55B24LS", "60B24LS"), ("55B24RS", "60B24RS"), ("55B24L", "60B24L"), ("55B24R", "60B24R")):
        if b == a: return c if c in prices else None
    m = re.match(r"^AGM L(\d)$", b)
    if m: return f"LN{m.group(1)}" if f"LN{m.group(1)}" in prices else None
    m = re.match(r"^EFB (L3|Q85|S95|N55)$", b)
    if m: return {"N55": "N55L"}.get(m.group(1), m.group(1)) if {"N55": "N55L"}.get(m.group(1), m.group(1)) in prices else None
    return b if b in prices else None
def two(b): return bool(re.search(r"X\s*2$", b))

for c in cars:
    if c["slug"] not in SELECT: continue
    mk, pat = SELECT[c["slug"]]
    out = []
    for r in rows:
        if r["make"] != mk or not re.search(pat, r["model"]) or end_year(r["years"]) < 2008: continue
        out.append({"version": (r["model"] + (f" ({r['gen']})" if r["gen"] else "")).strip(), "years": r["years"], "guide": r["battery"].replace("AMARON ", ""), "code": to_code(r["battery"]), "two": two(r["battery"])})
    if not out: continue
    c["verified"] = True
    c["evidence"] = "Nam Wah Battery Co Pte Ltd Vehicle Application Guide (Amaron's Singapore distributor)."
    c["fitment"] = out
    codes = []
    for f in out:
        if f["code"] and f["code"] not in codes: codes.append(f["code"])
    c["batteries"] = [{"partNo": x, "type": "EFB" if x in ("M42L", "N55L", "Q85", "S95", "L3") else ("AGM" if x.startswith("LN") else "Standard")} for x in codes]
json.dump(cars, open("data/cars.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(sum(1 for c in cars if c.get("fitment")), "cars with fitment;", sum(len(c.get("fitment", [])) for c in cars), "rows")
