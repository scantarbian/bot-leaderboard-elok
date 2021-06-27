# Bot Leaderboard [eLok](https://elok.ugm.ac.id)

## ⚠ Disclaimer ⚠

_Saya, pembuat ([@scantarbian](https://github.com/scantarbian)), dengan ini menyatakan tidak bertanggung jawab terhadap segala dampak, baik langsung maupun tidak langsung, dari penggunaan aplikasi ini._

### Cara penggunaan

#### 1. Install Dependency

Aplikasi ini membutuhkan [Node](https://nodejs.org/en/) versi terbaru.

```sh
npm install
```

Ini akan mengunduh dan memasang file-file yang diperlukan untuk menjalankan aplikasi, terutama [Puppeteer](https://pptr.dev/).

#### 2. Persiapkan .env

Buat file .env dengan variabel `UNAME` (Username SSO UGM), `PASSWORD` (Password SSO UGM), dan `COURSE_URL` (URL Course di [eLOK](https://elok.ugm.ac.id/)).
Contoh:

```env
UNAME=alexander
PASSWORD=alexganteng
COURSE_URL=https://elok.ugm.ac.id/course/view.php?id=0
```

#### 3. Atur [XPath](https://www.w3schools.com/xml/xpath_syntax.asp)

XPath digunakan untuk membantu aplikasi mencari tombol untuk di klik sehingga exp bisa bertambah. Pengaturan XPath dapat ditemukan di line 59.

```js
const target = await page.$x("//span[contains(., 'Presentation Material')]")
```

Menggunakan contoh diatas, aplikasi akan mencari tag HTML `<span>` yang mempunyai teks "Presentation Material" dan mengkliknya. Untuk membidik tombol yang berbeda anda bisa mengedit argumen dalam fungsi `$x` sesuai kebutuhan.

#### 4. (Opsional) Atur Jeda Waktu

Dalam pengaturan bawaan, aplikasi akan melakukan klik terhadap semua tag yang ditemukan menggunakan XPath setiap 10 detik. Hal ini mungkin akan memperlambat kinerja perangkat anda, apabila anda merasa membutuhkan jeda yang lebih besar hal ini dapat diatur di pengaturan [node-schedule](https://github.com/node-schedule/node-schedule) pada line 13.

```js
schedule.scheduleJob("*/10 * * * * *" , async() => { 
```

Silahkan mengatur argumen di dalam tanda kutip sesuai kebutuhan dan sesuai dengan yang tertera pada dokumentasi node-schedule.

#### 5. Jalankan Aplikasi

Aplikasi dapat dijalankan dengan

```sh
npm start
```

atau

```sh
node index.js
```

#### 6. Hentikan Aplikasi

Belum ada sistem parameter yang akan menghentikan aplikasi secara otomatis apabila sudah mencapai jumlah exp tertentu, sehingga untuk menghentikan aplikasi masih dengan cara manual yaitu `Control+X` apabila exp dirasa sudah mencukupi.

### Penutup

Apabila mengalami kendala silahkan buat [issue baru](https://github.com/scantarbian/bot-leaderboard-elok/issues/new) atau fork dan pull request apabila ingin berkolaborasi dalam pengembangan bot ini.
