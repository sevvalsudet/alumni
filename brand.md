# 🎨 Brand Identity & Design System Guidelines

> **Alumni Tracking System (`Alumni.io`)**  
> *Mezuniyetten Kariyere, Kesintisiz ve Güvenilir Bağlantı.*

---

## 🌟 1. Brand Overview & Mission

**Alumni Tracking System**, üniversite mezunları, öğrenciler ve iş dünyası arasında köprü kuran yeni nesil bir mezun takip ve kariyer platformudur. 

Platformun marka kimliği; **minimalist**, **modern**, **zarif (estetik)** ve **güvenilir** ilkeler üzerine inşa edilmiştir. Karmaşık ve yorucu arayüzler yerine, içeriği öne çıkaran açık renk tonları, ferah boşluklar ve çağdaş tipografi ile kullanıcıya seçkin bir deneyim sunar.

### Marka Değerleri
- **Minimalizm & Sadelik:** Gereksiz süslemelerden uzak, sadece amaca hizmet eden temiz arayüzler.
- **Güvenilirlik & Şeffaflık:** Guardian hata koruması, merkezi loglama ve doğrulanmış kariyer verileri.
- **Erişilebilirlik & Akıcılık:** Yüksek kontrastlı okunabilir metinler, duyarlı (responsive) tasarım ve mikro etkileşimler.
- **Topluluk Odaklılık:** Mezunlar ve öğrenciler arasında sürdürülebilir bağlar kurma.

---

## 🎨 2. Color Palette (Renk Paleti)

Tüm arayüzlerde göz yormayan, soft, açık ve kaliteli renk tonları kullanılır.

### 2.1. Zemin ve Yüzey Renkleri (Base & Surfaces)
| İsim | HEX Kodu | RGB | Kullanım Alanı |
| :--- | :--- | :--- | :--- |
| **Slate Base (Zemin)** | `#F8FAFC` | `248, 250, 252` | Genel sayfa arka planı, açık ve yumuşak ortam |
| **Surface Pure (Kartlar)**| `#FFFFFF` | `255, 255, 255` | Kart gövdeleri, modal pencereler, navbar |
| **Surface Subtle** | `#F1F5F9` | `241, 245, 249` | Buton hover durumları, ikincil zeminler |
| **Border Subtle** | `#E2E8F0` | `226, 232, 240` | Kart ve input sınır çizgileri (1px solid) |
| **Border Focus / Hover**| `#CBD5E1` | `203, 213, 225` | Hover ve odaklanma çizgileri |

### 2.2. Tipografi Renkleri (Typography Scale)
| İsim | HEX Kodu | Kullanım Alanı |
| :--- | :--- | :--- |
| **Slate 900 (Headings)** | `#0F172A` | Başlıklar (H1, H2, H3), marka logosu |
| **Slate 600 (Body Text)** | `#475569` | Gövde metinleri, kart açıklamaları |
| **Slate 400 (Muted)** | `#94A3B8` | Alt yazılar, zaman etiketleri, dipnotlar |

### 2.3. Marka Ana Rengi (Primary Brand Accent)
| İsim | HEX Kodu | Kullanım Alanı |
| :--- | :--- | :--- |
| **Brand Primary (Indigo)**| `#4F46E5` | Ana CTA butonları, vurgulu bağlantılar, marka ikonu |
| **Brand Hover (Deep)** | `#4338CA` | Buton üzerine gelme (hover) durumu |
| **Brand Light (Soft Tint)**| `#EEF2FF` | Rozet zeminleri, hafif arka plan vurgusu |

### 2.4. Modül Semantik Renkleri (Harmonious Module Pastels)
Her sistem modülü kendine özel soft pastel tonlarla kimliklendirilmiştir:

```
👥 Mezunlar & Profiller   → Metin: #3B82F6 (Blue 500)   | Zemin: #EFF6FF (Blue 50)
💼 İş & Staj İlanları     → Metin: #10B981 (Emerald 500)| Zemin: #ECFDF5 (Emerald 50)
📝 Başvuru Süreçleri      → Metin: #8B5CF6 (Purple 500) | Zemin: #F5F3FF (Purple 50)
📢 Duyurular & Bildirimler→ Metin: #F59E0B (Amber 500)  | Zemin: #FFFBEB (Amber 50)
⚡ REST API & Swagger     → Metin: #06B6D4 (Cyan 500)   | Zemin: #ECFEFF (Cyan 50)
```

### 2.5. Durum & Sistem Göstergeleri (Status Colors)
- **Online / Başarılı:** `#22C55E` (Yeşil nokta animasyonu + `#F0FDF4` açık zemin)
- **Uyarı:** `#F59E0B` (Amber)
- **Hata / Guardian:** `#EF4444` (Kırmızı + `#FEF2F2` açık zemin)

---

## 🔤 3. Typography (Yazı Tipi & Hiyerarşi)

Markanın modern ve trend dijital kimliği için geometrik-humanist hibrit yazı tipi olan **Plus Jakarta Sans** benimsenmiştir.

- **Primary Font Family:** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace Family (Kod/API):** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

### Tipografi Skalası
| Eleman | Boyut | Ağırlık | Satır Yüksekliği | Harf Aralığı |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display H1** | `clamp(34px, 5vw, 52px)` | 800 (Extra Bold) | `1.15` | `-0.035em` |
| **Section Title H2** | `22px - 26px` | 700 (Bold) | `1.25` | `-0.02em` |
| **Card Title H3** | `18px` | 700 (Bold) | `1.3` | `-0.01em` |
| **Lead Paragraph** | `17px` | 400 (Regular) | `1.65` | Normal |
| **Body Text** | `14px - 15px` | 400 / 500 | `1.6` | Normal |
| **Badges / Buttons** | `12px - 14px` | 600 / 700 | `1.2` | `+0.02em` |

---

## 🧱 4. UI Bileşenleri & Tasarım Kuralları (Components)

### 4.1. Kartlar & Gölgeler (Elevation)
- **Border Radius:** Kartlar için `16px` (`var(--radius-lg)`), iç kutular için `12px` (`var(--radius-md)`).
- **Hafif Katmanlı Gölgeler:**
  ```css
  box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.06), 0 1px 4px -1px rgba(15, 23, 42, 0.04);
  ```
- **Hover Etkisi:** Kart üzerine gelindiğinde `transform: translateY(-4px)` ve yumuşak derinlik artışı (`box-shadow: var(--shadow-hover)`).

### 4.2. Rozetler (Pill Badges)
- Tam yuvarlatılmış kenarlar (`border-radius: 9999px`).
- Küçük, büyük harf veya sembollü kısa etiketler (`PROFİLLER`, `KARİYER`, `SÜREÇLER`).
- Yüksek okunabilirlik için açık arka plan üzerine kontrast renk tonu.

### 4.3. Butonlar (Buttons)
- **Primary CTA:** Indigo zemin (`#4F46E5`), beyaz metin, hafif parlama gölgesi (`0 4px 14px rgba(79, 70, 229, 0.3)`).
- **Secondary CTA:** Beyaz zemin, ince gri kenarlık (`#E2E8F0`), koyu metin.
- **Radius:** Tam yuvarlatılmış hap stil (`border-radius: 9999px`) veya `10px`.

### 4.4. Mikro Etkileşimler & Canlı Durum
- **Pulsing Status Dot:** Navbar sağ köşesinde yeşil canlı durum indikatörü (`animation: pulse-dot 2s infinite ease-in-out`).
- **Smooth Transition:** Tüm hover ve focus durumlarında `transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 🗣️ 5. Tone of Voice (İletişim & Dil)

- **Profesyonel fakat Samimi:** Resmiyetten uzak, sıcak, teşvik edici ve net bir Türkçe dil kullanımı.
- **Eylem Odaklı:** Buton ve link metinlerinde açık yönlendirmeler (`İlanları Keşfet →`, `Mezun Ağını İncele`, `Başvuru Yap`).
- **Açık & Bilgilendirici:** Hata veya 404 sayfalarında kullanıcıyı suçlamayan, alternatif rotalar sunan rehber niteliğinde dil.

---

## 📌 6. Dosya & Proje Entegrasyonu

Marka standartları projenin aşağıdaki noktalarında birebir uygulanmıştır:
- [`views/index.ejs`](views/index.ejs) — Ana sayfa tasarımı
- [`views/404.ejs`](views/404.ejs) — 404 Guardian hata arayüzü
- [`views/500.ejs`](views/500.ejs) — 500 Server Error Guardian arayüzü
- [`README.md`](README.md) — Proje dokümantasyonu ve mimari rehberi
