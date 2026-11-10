# Pasher Shop - Cloudflare D1 Backend & Deployment Guide
(GitHub ছাড়া সরাসরি Cloudflare-এ Deploy করার সম্পূর্ণ নির্দেশিকা)

Pasher Shop-এর Backend এবং Cloudflare D1 Database সম্পূর্ণ প্রস্তুত। এতে সরাসরি Cloudflare Workers এবং D1 SQL Database বাইন্ডিং (`DB`) ব্যবহার করে উচ্চক্ষমতাসম্পন্ন এবং সুরক্ষিত API তৈরি করা হয়েছে।

---

## 🏗️ সিস্টেম আর্কিটেকচার (Architecture)

1. **Database**: Cloudflare D1 SQL
   - **Database Name**: `pasher-shop-db`
   - **Binding Variable**: `DB`
   - **4টি প্রধান টেবিল**: `users`, `categories`, `shops`, `products` (এবং `reviews`, `inquiries`)
2. **Backend Engine**: Cloudflare Worker (`worker.ts`)
   - SQL Injection প্রতিরোধে **Prepared Statements** (`env.DB.prepare(...).bind(...)`)
   - ইনপুট ভ্যালিডেশন এবং নিরাপদ Error Handling
   - গ্লোবাল CORS ও অপ্টিমাইজড JSON রেসপন্স
3. **Static Assets**: Vite React ফ্রন্টএন্ড (`dist/`) ক্লাউডফ্লেয়ারের গ্লোবাল CDN এজ-এ ক্যাশড থাকে।

---

## 📡 প্রস্তুতকৃত API রুটসমূহ (Available APIs)

| মেথড | এন্ডপয়েন্ট | কাজ ও বিবরণ |
|---|---|---|
| **GET** | `/api/categories` | সকল ক্যাটাগরি তালিকা রিটার্ন করে |
| **GET** | `/api/shops` | সকল দোকান রিটার্ন করে (`?category=...&area=...&search=...` সাপোর্টসহ) |
| **GET** | `/api/shops/:id` | নির্দিষ্ট দোকানের বিস্তারিত ও সকল পণ্য রিটার্ন করে |
| **POST** | `/api/shops` | নতুন দোকান যুক্ত করে (Prepared Statements সহ) |
| **PUT** | `/api/shops/:id` | দোকানের তথ্য বা ব্যানার আপডেট করে |
| **DELETE** | `/api/shops/:id` | দোকান মুছে ফেলে |
| **GET** | `/api/products` | পণ্য তালিকা রিটার্ন করে (`?shop_id=...&category=...&search=...` ফিল্টারসহ) |
| **GET** | `/api/products/:id` | নির্দিষ্ট পণ্যের বিস্তারিত তথ্য রিটার্ন করে |
| **POST** | `/api/products` | নতুন পণ্য তৈরি করে |
| **PUT** | `/api/products/:id` | পণ্যের দাম বা স্টক স্ট্যাটাস আপডেট করে |
| **DELETE** | `/api/products/:id` | পণ্য মুছে ফেলে |
| **GET** | `/api/shops/:id/reviews` | কাস্টমার রিভিউ তালিকা |
| **POST** | `/api/shops/:id/reviews` | নতুন কাস্টমার রিভিউ সাবমিট করা |
| **GET** | `/api/d1/status` | Cloudflare D1 ডাটাবেস সংযোগ স্থিতি |

---

## 🚀 GitHub ছাড়া সরাসরি Cloudflare-এ Deploy করার ধাপসমূহ

আপনার কোনো GitHub রিপোজিটরি খোলার বা পুশ করার প্রয়োজন নেই। আপনার লোকাল পিসি/টার্মিনাল থেকেই সরাসরি ক্লাউডফ্লেয়ারে Deploy করা যাবে।

### ধাপ ১: ক্লাউডফ্লেয়ারে লগইন (Cloudflare Login)
টার্মিনালে কমান্ডটি চালান:
```bash
npx wrangler login
```
এটি আপনার ব্রাউজারে একটি উইন্ডো খুলবে। আপনার Cloudflare অ্যাকাউন্টে **Allow** বাটনে ক্লিক করলেই টার্মিনাল লগইন হয়ে যাবে।

---

### ধাপ ২: D1 ডাটাবেস চেক ও টেবিল স্কিমা রান করা
আপনার Cloudflare অ্যাকাউন্টে ডাটাবেসটি উপস্থিত আছে কিনা দেখুন:
```bash
npx wrangler d1 list
```
*(যদি `pasher-shop-db` তৈরি না থাকে, তবে `npx wrangler d1 create pasher-shop-db` দিয়ে ১ সেকেন্ডে তৈরি করে নেওয়া যায়)*

এখন `schema.sql` ফাইল থেকে টেবিলগুলো রিমোট D1 ডাটাবেসে তৈরি করতে রান করুন:
```bash
npm run d1:migrate
```
অথবা সরাসরি:
```bash
npx wrangler d1 execute pasher-shop-db --file=./schema.sql --remote
```

---

### ধাপ ৩: প্রজেক্ট বিল্ড ও সরাসরি ডিপ্লয় (Build & One-Click Deploy)
একটি সিঙ্গেল কমান্ডে ফ্রন্টএন্ড বিল্ড হয়ে সরাসরি Cloudflare Worker-এ আপলোড হয়ে যাবে:
```bash
npm run deploy
```
অথবা:
```bash
npm run build && npx wrangler deploy
```

সফলভাবে ডিপ্লয় হওয়ার পর টার্মিনালে আপনার ওয়েবসাইটের লাইভ লিংক চলে আসবে:
```text
Published pasher-shop (x.xx sec)
  https://pasher-shop.<your-subdomain>.workers.dev
```

---

### ধাপ ৪: নিজস্ব ডোমেন যুক্ত করা (Custom Domain - Optional)
আপনি যদি `pasher-shop.com` বা যেকোনো কাস্টম ডোমেন যুক্ত করতে চান:
1. Cloudflare Dashboard-এ যান।
2. **Workers & Pages** -> **pasher-shop** এ ক্লিক করুন।
3. **Settings** -> **Domains & Routes** -> **Add Custom Domain** এ গিয়ে আপনার ডোমেন দিন।

---

## 🔒 নিরাপত্তা ও পারফরম্যান্স নির্দেশিকা

1. **SQL Injection সুরক্ষা**:
   সব SQL কোয়েরিতে প্যারামিটার কনক্যাটেনেশনের বদলে `env.DB.prepare('SELECT * FROM shops WHERE id = ?').bind(id)` ব্যবহার করা হয়েছে।
2. **জিরো হার্ডকোড (No Hardcoded Secrets)**:
   কোনো পাসওয়ার্ড বা প্রাইভেট টোকেন কোডে লেখা নেই; Cloudflare সরাসরি `env.DB` ইন্টারনাল সিকিউর আরপিসির মাধ্যমে সংযোগ করে।
3. **লোকাল ডেভেলপমেন্ট ও অফলাইন সাপোর্ট**:
   লোকাল পিসিতে চালানোর সময় (`npm run dev`) এটি `server.ts` ও `data/pasher-shop-db.json` ব্যবহার করে কোনো ক্লাউড ক্রেডেনশিয়াল ছাড়াই সম্পূর্ণ অফলাইনে টেস্ট করা যায়।
