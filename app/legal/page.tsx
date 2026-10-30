export default function LegalPage() {
  return (
    <main className="bg-slate-50">
      <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-9 lg:p-10">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary text-sm font-bold text-white">PM</span>
            <span className="text-lg font-bold tracking-tight text-slate-950">ProjectMatch</span>
          </div>
          <h1 className="mt-6 max-w-4xl text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl">Syarat Penggunaan, Kebijakan Privasi, dan Penggunaan Data</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Dokumen ini mengatur penggunaan ProjectMatch sekaligus menjelaskan cara ProjectMatch mengumpulkan, menggunakan,
            menyimpan, membagikan, dan melindungi data pengguna. Bacalah seluruh ketentuan sebelum membuat akun atau
            menggunakan layanan.
          </p>
          <div aria-label="Informasi dokumen" className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 pt-5 text-xs font-medium leading-5 text-brand-primary [&>span]:rounded-lg [&>span]:bg-brand-soft [&>span]:px-3 [&>span]:py-1.5">
            <span>Terakhir diperbarui: 31 Oktober 2026</span>
            <span>Versi 1.0</span>
            <span>Berlaku di Indonesia</span>
          </div>
        </header>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8">
          <nav
            aria-label="Daftar isi"
            className={[
              "min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto lg:overscroll-contain",
              "[&>h2]:text-lg [&>h2]:font-bold [&>h2]:tracking-tight [&>h2]:text-slate-950",
              "[&>p]:mb-3 [&>p]:mt-6 [&>p]:text-sm [&>p]:leading-6 [&>p]:text-slate-950",
              "[&>ol]:list-decimal [&>ol]:space-y-1 [&>ol]:pl-5 [&>ol]:text-xs [&>ol]:leading-6 [&>ol]:text-slate-400",
              "[&_a]:block [&_a]:rounded-md [&_a]:px-2 [&_a]:py-1 [&_a]:text-sm [&_a]:leading-6 [&_a]:text-slate-600 [&_a]:transition-colors",
              "[&_a:hover]:bg-brand-soft [&_a:hover]:text-brand-primary [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-brand-primary",
            ].join(" ")}
          >
            <h2>Daftar Isi</h2>
            <p><strong>Bagian A. Syarat Penggunaan</strong></p>
            <ol>
              <li><a href="#pendahuluan">Pendahuluan dan Persetujuan</a></li>
              <li><a href="#definisi">Definisi</a></li>
              <li><a href="#kelayakan">Kelayakan dan Usia Pengguna</a></li>
              <li><a href="#akun">Akun dan Informasi Pengguna</a></li>
              <li><a href="#layanan">Ruang Lingkup Layanan</a></li>
              <li><a href="#proyek">Postingan dan Pengajuan Proyek</a></li>
              <li><a href="#pertemuan">Pertemuan Pertama dan Keamanan</a></li>
              <li><a href="#larangan">Penggunaan yang Dilarang</a></li>
              <li><a href="#konten">Konten Pengguna</a></li>
              <li><a href="#moderasi">Pelaporan dan Moderasi</a></li>
              <li><a href="#kekayaan-intelektual">Kekayaan Intelektual</a></li>
              <li><a href="#privasi">Privasi dan Data Pribadi</a></li>
              <li><a href="#pihak-ketiga">Layanan Pihak Ketiga</a></li>
              <li><a href="#batas-layanan">Batasan Layanan</a></li>
              <li><a href="#tanggung-jawab">Tanggung Jawab Bersama</a></li>
              <li><a href="#tanggung-gugat">Batas Layanan</a></li>
              <li><a href="#penangguhan">Penangguhan dan Pengakhiran</a></li>
              <li><a href="#perubahan">Perubahan Layanan dan Ketentuan</a></li>
              <li><a href="#hukum">Hukum dan Penyelesaian Perselisihan</a></li>
            </ol>
            <p><strong>Bagian B. Kebijakan Privasi dan Penggunaan Data</strong></p>
            <ol>
              <li><a href="#privasi-pendahuluan">Ruang Lingkup Kebijakan Privasi</a></li>
              <li><a href="#data-dikumpulkan">Data yang Dikumpulkan</a></li>
              <li><a href="#sumber-data">Sumber Data</a></li>
              <li><a href="#tujuan-data">Tujuan Penggunaan Data</a></li>
              <li><a href="#dasar-pemrosesan">Dasar Pemrosesan Data</a></li>
              <li><a href="#data-anak">Data Pengguna Anak</a></li>
              <li><a href="#akses-data">Akses dan Tampilan Data</a></li>
              <li><a href="#pembagian-data">Pembagian Data</a></li>
              <li><a href="#penyedia-layanan">Penyedia Layanan</a></li>
              <li><a href="#retensi-data">Penyimpanan dan Penghapusan</a></li>
              <li><a href="#keamanan-data">Keamanan Data</a></li>
              <li><a href="#transfer-data">Transfer Data</a></li>
              <li><a href="#hak-pengguna">Hak Pengguna</a></li>
              <li><a href="#cookie-log">Cookie dan Catatan Teknis</a></li>
              <li><a href="#insiden-data">Insiden Data</a></li>
              <li><a href="#perubahan-privasi">Perubahan Kebijakan Privasi</a></li>
            </ol>
          </nav>

          <article
            className={[
              "min-w-0 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600 [overflow-wrap:anywhere] sm:p-9 sm:text-base sm:leading-8 lg:p-10",
              "[&>h2]:mb-6 [&>h2]:mt-10 [&>h2]:rounded-xl [&>h2]:bg-brand-soft [&>h2]:px-4 [&>h2]:py-3 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:leading-7 [&>h2]:text-brand-primary sm:[&>h2]:text-xl",
              "[&>section]:scroll-mt-6 [&>section+section]:mt-8 [&>section+section]:border-t [&>section+section]:border-slate-200 [&>section+section]:pt-8",
              "[&_section>h2]:mb-4 [&_section>h2]:text-lg [&_section>h2]:font-bold [&_section>h2]:leading-7 [&_section>h2]:tracking-tight [&_section>h2]:text-slate-950 sm:[&_section>h2]:text-xl",
              "[&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:leading-7 [&_h3]:text-slate-950",
              "[&_section>p+p]:mt-4 [&_section>p+ul]:mt-3 [&_section>p+ol]:mt-3 [&_section>ul+p]:mt-4 [&_section>ol+p]:mt-4",
              "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_li]:pl-1 [&_li::marker]:text-slate-400",
              "[&_dt]:mt-4 [&_dt]:font-semibold [&_dt]:text-slate-950 [&_dt:first-child]:mt-0 [&_dd]:mt-1",
              "[&_strong]:font-semibold [&_strong]:text-slate-950",
              "[&_aside]:rounded-xl [&_aside]:border [&_aside]:border-accent-opportunity/30 [&_aside]:bg-warning-background [&_aside]:p-4 [&_aside]:text-sm [&_aside]:leading-7 [&_aside]:text-warning-text [&_section>aside]:mt-5",
              "[&_aside>strong]:mb-1 [&_aside>strong]:block [&_aside>strong]:text-warning-text",
              "[&_a]:rounded-sm [&_a]:font-medium [&_a]:text-brand-primary [&_a]:underline [&_a]:decoration-brand-primary/30 [&_a]:underline-offset-4 [&_a]:transition-colors",
              "[&_a:hover]:text-brand-secondary [&_a:hover]:decoration-brand-secondary [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-brand-primary",
            ].join(" ")}
          >
            <aside aria-label="Informasi layanan">
              <strong>Ruang kolaborasi pelajar</strong>
              ProjectMatch ditujukan bagi siswa SMP, SMA/SMK/MA, dan mahasiswa untuk menemukan rekan dan membuat karya bersama.
            </aside>

            <h2>Bagian A. Syarat Penggunaan</h2>

            <section id="pendahuluan">
              <h2>1. Pendahuluan dan Persetujuan</h2>
              <p>
                Syarat Penggunaan ini mengatur hubungan antara pengguna dan Tim Pengembang ProjectMatch sebagai pengelola layanan.
                Istilah “kami” merujuk kepada pengelola ProjectMatch, sedangkan istilah “Anda” merujuk kepada setiap orang
                yang mengakses, membuat akun, atau menggunakan layanan ProjectMatch.
              </p>
              <p>
                Dengan membuat akun, mengakses, atau menggunakan ProjectMatch, Anda menyatakan telah membaca, memahami, dan
                menyetujui Syarat dan Ketentuan ini serta Kebijakan Privasi ProjectMatch. Jika Anda tidak menyetujui salah
                satu ketentuan, Anda tidak diperkenankan menggunakan layanan.
              </p>
              <p>
                Jika Anda menggunakan ProjectMatch atas nama sekolah, perguruan tinggi, organisasi, atau badan lain, Anda
                menyatakan memiliki kewenangan untuk bertindak atas nama pihak tersebut.
              </p>
            </section>

            <section id="definisi">
              <h2>2. Definisi</h2>
              <dl>
                <dt>ProjectMatch</dt>
                <dd>Platform web yang membantu pelajar dan mahasiswa menemukan proyek, peran, serta rekan untuk berkolaborasi.</dd>

                <dt>Pengguna</dt>
                <dd>Setiap orang yang mengakses atau menggunakan ProjectMatch, baik sebagai pemilik proyek maupun calon anggota.</dd>

                <dt>Pemilik Proyek</dt>
                <dd>Pengguna yang membuat dan mengelola postingan proyek serta meninjau pengajuan calon anggota.</dd>

                <dt>Calon Anggota</dt>
                <dd>Pengguna yang memilih posisi dan mengajukan diri untuk bergabung dalam suatu proyek.</dd>

                <dt>Proyek</dt>
                <dd>Kegiatan kolaboratif untuk pendidikan, perlombaan, penelitian, teknologi, kegiatan sosial, kewirausahaan, portofolio, atau pengembangan diri.</dd>

                <dt>Konten Pengguna</dt>
                <dd>Informasi, tulisan, gambar, portofolio, tautan, dan materi lain yang dikirim atau ditampilkan oleh pengguna.</dd>

                <dt>Anak</dt>
                <dd>Setiap orang yang belum berusia 18 tahun sesuai ketentuan peraturan perundang-undangan yang berlaku.</dd>
              </dl>
            </section>

            <section id="kelayakan">
              <h2>3. Kelayakan dan Usia Pengguna</h2>
              <ol>
                <li>ProjectMatch ditujukan bagi siswa SMP, SMA/SMK/MA, dan mahasiswa.</li>
                <li>Pengguna memberikan informasi pendidikan yang benar dan menggunakan akun miliknya sendiri.</li>
                <li>Untuk pengguna yang masih termasuk anak menurut hukum, pengelola memproses data dengan memperhatikan ketentuan persetujuan orang tua atau wali dan pelindungan anak yang berlaku.</li>
              </ol>
            </section>

            <section id="akun">
              <h2>4. Akun dan Informasi Pengguna</h2>
              <ol>
                <li>Isi profil dan pengajuan dengan informasi yang benar.</li>
                <li>Satu pengguna hanya boleh menggunakan akun miliknya sendiri dan tidak boleh membuat akun untuk menyamar sebagai orang lain.</li>
                <li>Jaga informasi masuk akun agar tidak digunakan orang lain. Pengelola juga bertanggung jawab menerapkan pengamanan yang wajar pada sistem.</li>
                <li>Jika akun diduga digunakan tanpa izin, pengguna dapat melaporkannya melalui fitur pelaporan.</li>
                <li>Informasi pendidikan, keterampilan, dan portofolio yang ditampilkan hendaknya sesuai dengan keadaan sebenarnya.</li>
                <li>Anda tidak boleh menjual, memindahtangankan, meminjamkan, atau membagikan akun kepada pihak lain.</li>
                <li>Kami dapat meminta pembaruan informasi apabila data akun tidak lengkap, tidak konsisten, atau diduga tidak benar.</li>
              </ol>
            </section>

            <section id="layanan">
              <h2>5. Ruang Lingkup Layanan</h2>
              <p>ProjectMatch menyediakan fasilitas untuk:</p>
              <ul>
                <li>membuat dan menampilkan profil pendidikan, keterampilan, dan portofolio</li>
                <li>membuat postingan proyek dan posisi yang dibutuhkan</li>
                <li>menjelajahi serta menyaring peluang proyek</li>
                <li>mengajukan diri sebagai calon anggota</li>
                <li>meninjau dan menentukan hasil pengajuan</li>
                <li>menampilkan informasi pertemuan pertama kepada anggota yang diterima</li>
                <li>melaporkan akun, proyek, atau konten yang tidak sesuai</li>
              </ul>
              <p>
                ProjectMatch merupakan sarana untuk mempertemukan pengguna. ProjectMatch bukan pemberi kerja, agen tenaga
                kerja, lembaga pendidikan, penyelenggara lomba, penyedia pembayaran, atau pengelola seluruh pelaksanaan proyek.
              </p>
              <p>
                ProjectMatch tidak menyediakan fitur percakapan langsung di dalam platform. Komunikasi awal dilakukan melalui
                informasi proyek, pengajuan anggota, keputusan pemilik proyek, dan informasi pertemuan pertama yang terstruktur.
              </p>
            </section>

            <section id="proyek">
              <h2>6. Postingan dan Pengajuan Proyek</h2>
              <h3>6.1 Kewajiban Pemilik Proyek</h3>
              <ul>
                <li>Menjelaskan tujuan, kategori, posisi, keterampilan, jumlah anggota, komitmen waktu, tenggat, lokasi, dan cara pelaksanaan proyek secara jujur.</li>
                <li>Hanya membuat proyek yang sesuai dengan pendidikan, perlombaan, penelitian, kegiatan sosial, portofolio, kewirausahaan pelajar, atau pengembangan diri.</li>
                <li>Tidak meminta biaya pendaftaran, pembayaran, investasi, pinjaman, pembelian, atau imbalan finansial dari calon anggota.</li>
                <li>Meninjau pengajuan secara wajar dan tidak melakukan diskriminasi yang melanggar hukum.</li>
                <li>Menjaga kerahasiaan data calon anggota dan hanya menggunakannya untuk proses pembentukan tim.</li>
                <li>Memperbarui atau menutup postingan ketika posisi telah terisi, proyek dibatalkan, atau informasi tidak lagi berlaku.</li>
              </ul>

              <h3>6.2 Kewajiban Calon Anggota</h3>
              <ul>
                <li>Membaca informasi proyek sebelum mengajukan diri.</li>
                <li>Memberikan alasan bergabung, kemampuan, portofolio, dan komitmen waktu secara jujur.</li>
                <li>Tidak mengirim portofolio milik orang lain atau memberikan keterangan palsu.</li>
                <li>Mengajukan diri hanya jika memiliki minat dan kemampuan untuk memenuhi komitmen yang dijelaskan.</li>
                <li>Menghormati keputusan pemilik proyek selama keputusan tersebut tidak melanggar ketentuan atau hukum.</li>
              </ul>

              <h3>6.3 Hasil Pengajuan</h3>
              <p>
                Pemilik proyek menentukan penerimaan atau penolakan calon anggota. ProjectMatch tidak menjamin bahwa setiap
                pengajuan akan diterima, setiap posisi akan terisi, atau setiap tim akan menyelesaikan proyek.
              </p>
            </section>

            <section id="pertemuan">
              <h2>7. Pertemuan Pertama dan Keamanan</h2>
              <ol>
                <li>Informasi pertemuan pertama hanya ditampilkan kepada pengguna yang telah diterima sebagai anggota.</li>
                <li>Pertemuan daring dapat menggunakan tautan Zoom atau layanan konferensi yang ditentukan pemilik proyek.</li>
                <li>Pertemuan luring harus dilakukan di ruang publik yang wajar, mudah dikenali, dan dapat ditemukan melalui tautan peta.</li>
                <li>Pertemuan luring di rumah pribadi, penginapan, lokasi terpencil, kendaraan pribadi, atau tempat yang tidak sesuai bagi pelajar dilarang.</li>
                <li>Sebelum hadir, pengguna dapat memeriksa profil pemilik proyek, informasi proyek, waktu, dan lokasi pertemuan.</li>
                <li>Pengguna yang masih anak disarankan memberi tahu orang tua atau wali mengenai rencana pertemuan.</li>
                <li>Jangan memberikan kata sandi, kode verifikasi, data keuangan, dokumen identitas lengkap, atau informasi pribadi yang tidak diperlukan.</li>
                <li>Jika terdapat permintaan uang, perubahan lokasi yang mencurigakan, ancaman, tekanan, atau perilaku tidak pantas, batalkan pertemuan dan gunakan fitur pelaporan.</li>
                <li>Jika merasa tidak aman, tinggalkan lokasi dan cari bantuan dari orang tepercaya atau layanan darurat setempat.</li>
              </ol>
            </section>

            <section id="larangan">
              <h2>8. Penggunaan yang Dilarang</h2>
              <p>Pengguna dilarang menggunakan ProjectMatch untuk:</p>
              <ul>
                <li><strong>Konten ilegal.</strong> Mengunggah, menawarkan, atau memfasilitasi kegiatan yang melanggar hukum.</li>
                <li><strong>Pelecehan dan eksploitasi.</strong> Melakukan perundungan, ancaman, ujaran kebencian, pelecehan seksual, eksploitasi, grooming, atau pendekatan tidak pantas terhadap anak.</li>
                <li><strong>Penipuan.</strong> Membuat proyek palsu, menyamar, memalsukan identitas pendidikan, mencuri akun, atau meminta uang dengan alasan apa pun.</li>
                <li><strong>Pekerjaan profesional.</strong> Menawarkan pekerjaan penuh waktu, paruh waktu, kontrak profesional, perekrutan tenaga kerja, atau pekerjaan berbayar yang berada di luar tujuan ProjectMatch.</li>
                <li><strong>Transaksi keuangan.</strong> Meminta biaya, investasi, donasi pribadi, pinjaman, pembelian, nomor rekening, kartu pembayaran, atau aset digital.</li>
                <li><strong>Konten berbahaya.</strong> Menampilkan pornografi, kekerasan ekstrem, perjudian, narkotika, senjata, tindakan melukai diri, atau materi lain yang tidak sesuai bagi pelajar.</li>
                <li><strong>Pelanggaran privasi.</strong> Menyebarkan alamat rumah, nomor identitas, data sekolah yang sensitif, data kesehatan, data keuangan, atau informasi pribadi orang lain tanpa hak.</li>
                <li><strong>Pelanggaran karya.</strong> Mengunggah materi yang melanggar hak cipta, merek, rahasia dagang, atau hak kekayaan intelektual pihak lain.</li>
                <li><strong>Gangguan sistem.</strong> Mengirim virus, melakukan scraping tanpa izin, mencoba mengakses akun lain, menghindari pembatasan, atau mengganggu keamanan ProjectMatch.</li>
                <li><strong>Spam.</strong> Membuat postingan berulang, promosi yang tidak relevan, tautan berbahaya, atau pengajuan massal yang tidak sungguh-sungguh.</li>
                <li><strong>Menghindari perlindungan.</strong> Mengajak pengguna memindahkan komunikasi ke saluran pribadi untuk menghindari pelaporan, pemeriksaan, atau ketentuan keamanan ProjectMatch.</li>
              </ul>
            </section>

            <section id="konten">
              <h2>9. Konten Pengguna</h2>
              <ol>
                <li>Anda tetap memiliki hak atas Konten Pengguna yang Anda buat dan unggah.</li>
                <li>Anda menyatakan memiliki hak atau izin yang diperlukan untuk menggunakan dan mengunggah konten tersebut.</li>
                <li>
                  Anda memberikan kepada ProjectMatch izin terbatas, non-eksklusif, bebas royalti, dan berlaku selama konten
                  tersimpan untuk menyimpan, menampilkan, menyesuaikan ukuran, dan memproses konten hanya sejauh diperlukan
                  untuk menyediakan, mengamankan, dan meningkatkan layanan.
                </li>
                <li>Izin tersebut berakhir setelah konten dihapus dari sistem aktif, kecuali penyimpanan sementara diperlukan untuk pencadangan, keamanan, penanganan laporan, atau kewajiban hukum.</li>
                <li>ProjectMatch dapat menyembunyikan atau menghapus konten yang melanggar ketentuan, membahayakan pengguna, atau diwajibkan untuk dihapus berdasarkan hukum.</li>
                <li>Anda memahami bahwa konten yang telah dibagikan kepada anggota tim mungkin telah disalin atau disimpan oleh pengguna tersebut di luar kendali ProjectMatch.</li>
              </ol>
            </section>

            <section id="moderasi">
              <h2>10. Pelaporan dan Moderasi</h2>
              <ol>
                <li>Pengguna dapat melaporkan akun, proyek, pengajuan, atau konten yang diduga melanggar ketentuan.</li>
                <li>Laporan harus dibuat dengan itikad baik dan dilengkapi informasi yang cukup untuk diperiksa.</li>
                <li>Kami dapat meninjau konten, meminta keterangan, membatasi jangkauan, menghapus konten, memberikan peringatan, membatasi fitur, menangguhkan akun, atau mengakhiri akun.</li>
                <li>Kami dapat melakukan tindakan segera jika terdapat risiko terhadap keselamatan anak, penipuan, eksploitasi, ancaman, atau pelanggaran hukum.</li>
                <li>Pelaporan palsu, berulang, atau digunakan untuk mengganggu pengguna lain merupakan pelanggaran.</li>
                <li>Kami dapat menyimpan bukti yang relevan dan bekerja sama dengan sekolah, kampus, orang tua atau wali, penyedia layanan, dan aparat yang berwenang sesuai hukum.</li>
                <li>Pengguna dapat meminta peninjauan ulang atas keputusan moderasi melalui fitur pelaporan yang tersedia pada ProjectMatch.</li>
              </ol>
            </section>

            <section id="kekayaan-intelektual">
              <h2>11. Kekayaan Intelektual ProjectMatch</h2>
              <p>
                Nama, logo, desain, kode, tata letak, teks, dan materi ProjectMatch yang dibuat oleh pengelola dilindungi oleh
                hak kekayaan intelektual. Kecuali diizinkan secara tertulis, pengguna tidak boleh menyalin, menjual,
                memodifikasi, mendistribusikan, atau menggunakan materi tersebut untuk kepentingan komersial.
              </p>
              <p>
                Masukan atau saran yang diberikan kepada ProjectMatch dapat digunakan untuk meningkatkan layanan tanpa
                kewajiban memberikan imbalan, sepanjang tidak menggunakan karya pengguna di luar tujuan masukan tersebut.
              </p>
            </section>

            <section id="privasi">
              <h2>12. Privasi dan Data Pribadi</h2>
              <ol>
                <li>Pengumpulan dan penggunaan data pribadi dijelaskan dalam Bagian B, Kebijakan Privasi dan Penggunaan Data, pada halaman ini.</li>
                <li>Kami hanya memproses data untuk tujuan yang jelas, terbatas, sah, dan disampaikan kepada pengguna.</li>
                <li>Data anak diproses secara khusus dan memerlukan persetujuan orang tua atau wali sesuai hukum yang berlaku.</li>
                <li>Pengguna dapat menggunakan hak atas data pribadinya sesuai ketentuan yang berlaku.</li>
                <li>Pengguna dilarang mengambil, mengumpulkan, atau menggunakan data pengguna lain di luar tujuan kolaborasi yang disetujui.</li>
                <li>Kami menerapkan langkah keamanan yang wajar, tetapi tidak ada sistem elektronik yang sepenuhnya bebas dari risiko.</li>
              </ol>
              <p>Penjelasan mengenai data yang digunakan ProjectMatch tersedia pada Bagian B di bawah ini.</p>
            </section>

            <section id="pihak-ketiga">
              <h2>13. Layanan Pihak Ketiga</h2>
              <p>
                ProjectMatch dapat terhubung dengan layanan pihak ketiga seperti penyedia autentikasi, basis data,
                penyimpanan media, peta, konferensi video, dan hosting. Penggunaan layanan pihak ketiga juga dapat tunduk pada
                syarat dan kebijakan privasi masing-masing penyedia.
              </p>
              <p>
                Tautan Zoom, peta, portofolio, atau situs lain dapat dibuat atau dikelola oleh pengguna dan pihak ketiga.
                ProjectMatch tidak mengendalikan seluruh isi atau ketersediaan layanan tersebut. Periksa tujuan tautan
                sebelum membukanya dan hindari memasukkan informasi sensitif pada halaman yang mencurigakan.
              </p>
            </section>

            <section id="batas-layanan">
              <h2>14. Batasan Layanan dan Verifikasi</h2>
              <ol>
                <li>ProjectMatch berusaha menjaga informasi tetap akurat, tetapi tidak menjamin seluruh informasi pengguna, proyek, portofolio, atau institusi selalu lengkap dan benar.</li>
                <li>Tanda verifikasi menunjukkan bahwa pemeriksaan tertentu telah dilakukan dan bukan jaminan atas karakter, kemampuan, keamanan, atau keberhasilan pengguna.</li>
                <li>ProjectMatch tidak menjamin pengguna akan menemukan rekan, diterima dalam proyek, memenangkan lomba, memperoleh nilai, atau menghasilkan karya tertentu.</li>
                <li>Anggota tim menentukan sendiri pembagian tugas dan penggunaan hasil karya mereka.</li>
                <li>Layanan dapat mengalami pemeliharaan, gangguan teknis, perubahan, atau penghentian sementara.</li>
              </ol>
            </section>

            <section id="tanggung-jawab">
              <h2>15. Tanggung Jawab Bersama</h2>
              <p>Pengguna ProjectMatch perlu:</p>
              <ul>
                <li>memberikan informasi yang benar dan menghormati pengguna lain</li>
                <li>menggunakan proyek dan portofolio secara jujur tanpa mengambil karya orang lain</li>
                <li>menjaga informasi masuk akun dan tidak membagikannya kepada orang lain</li>
                <li>menggunakan fitur pelaporan jika menemukan konten atau ajakan yang mencurigakan</li>
              </ul>
              <p>Tim ProjectMatch mengelola platform, menindaklanjuti laporan yang diterima, dan menjaga data pengguna sesuai ketentuan yang berlaku.</p>
            </section>

            <section id="tanggung-gugat">
              <h2>16. Batas Layanan</h2>
              <p>
                ProjectMatch membantu pelajar menemukan proyek dan calon rekan. Keputusan menerima anggota, pembagian tugas,
                pelaksanaan proyek, dan hasil karya ditentukan oleh anggota tim yang berkolaborasi.
              </p>
              <p>
                ProjectMatch tidak menjamin setiap pengajuan diterima atau setiap proyek berhasil. Pengelola tetap menangani
                hal yang menjadi tanggung jawabnya sebagai penyedia platform sesuai hukum yang berlaku.
              </p>
            </section>

            <section id="penangguhan">
              <h2>17. Penangguhan, Pengakhiran, dan Penghapusan Akun</h2>
              <ol>
                <li>Pengguna dapat berhenti menggunakan layanan dan berhak meminta penghapusan akun. Pengelola wajib menyediakan mekanisme permintaan penghapusan sebelum layanan dibuka untuk umum.</li>
                <li>Kami dapat membatasi atau menangguhkan akun ketika diperlukan untuk pemeriksaan keamanan, pelindungan anak, penanganan laporan, atau pencegahan kerugian.</li>
                <li>Kami dapat mengakhiri akun yang melakukan pelanggaran berat, berulang, ilegal, membahayakan pengguna, atau menghindari tindakan moderasi.</li>
                <li>Sebelum tindakan permanen, kami dapat memberikan pemberitahuan dan kesempatan menjelaskan, kecuali tindakan segera diperlukan untuk keselamatan atau kepatuhan hukum.</li>
                <li>Setelah akun dihapus, data akan ditangani sesuai Kebijakan Privasi dan kewajiban penyimpanan yang berlaku.</li>
                <li>Ketentuan mengenai konten, kekayaan intelektual, penyelesaian perselisihan, dan tanggung jawab tetap berlaku jika sifatnya perlu bertahan setelah akun berakhir.</li>
              </ol>
            </section>

            <section id="perubahan">
              <h2>18. Perubahan Layanan dan Ketentuan</h2>
              <p>
                Kami dapat memperbarui fitur dan Syarat dan Ketentuan untuk menyesuaikan pengembangan layanan, hasil evaluasi
                keamanan, atau perubahan hukum. Perubahan penting akan diberitahukan melalui platform, surat elektronik, atau
                cara lain yang wajar sebelum berlaku jika diwajibkan oleh hukum.
              </p>
              <p>
                Tanggal pembaruan akan dicantumkan pada bagian atas dokumen. Jika perubahan memerlukan persetujuan baru,
                termasuk persetujuan orang tua atau wali, ProjectMatch akan meminta persetujuan tersebut sebelum pemrosesan
                atau fitur terkait dilanjutkan.
              </p>
            </section>

            <section id="hukum">
              <h2>19. Hukum dan Penyelesaian Perselisihan</h2>
              <ol>
                <li>Syarat dan Ketentuan ini tunduk pada hukum Republik Indonesia.</li>
                <li>Keluhan atau perselisihan terlebih dahulu disampaikan melalui kanal dukungan agar dapat diselesaikan secara musyawarah.</li>
                <li>Jika tidak tercapai penyelesaian, para pihak dapat menggunakan mekanisme penyelesaian sengketa yang tersedia berdasarkan hukum Indonesia.</li>
                <li>Jika musyawarah tidak menghasilkan penyelesaian, perselisihan dapat diajukan kepada lembaga atau pengadilan yang berwenang menurut hukum Indonesia.</li>
                <li>Hak pengguna untuk melapor kepada instansi yang berwenang atau menggunakan mekanisme perlindungan konsumen dan data pribadi tetap berlaku.</li>
              </ol>
            </section>

            <h2>Bagian B. Kebijakan Privasi dan Penggunaan Data</h2>

            <section id="privasi-pendahuluan">
              <h2>B.1 Ruang Lingkup Kebijakan Privasi</h2>
              <p>
                Kebijakan Privasi ini menjelaskan cara Tim Pengembang ProjectMatch memproses data pribadi pengguna.
                Kebijakan ini berlaku ketika pengguna membuat akun, melengkapi
                profil, membuat atau mengikuti proyek, mengirim pengajuan, menerima informasi pertemuan, menyampaikan laporan,
                menghubungi dukungan, atau menggunakan bagian lain dari ProjectMatch.
              </p>
              <p>
                Pengelola ProjectMatch bertindak sebagai pengendali data pribadi untuk pemrosesan yang ditentukan oleh
                ProjectMatch. Sekolah, perguruan tinggi, penyedia layanan, atau pihak lain dapat menjadi pengendali data
                tersendiri untuk pemrosesan yang mereka lakukan berdasarkan tujuan dan kebijakan masing-masing.
              </p>
            </section>

            <section id="data-dikumpulkan">
              <h2>B.2 Data yang Dikumpulkan</h2>
              <p>ProjectMatch dapat mengumpulkan kategori data berikut sesuai fitur yang digunakan:</p>

              <h3>B.2.1 Data akun dan identitas</h3>
              <ul>
                <li>nama pengguna dan nama lengkap</li>
                <li>alamat email dan informasi autentikasi</li>
                <li>usia atau tanggal lahir jika diperlukan untuk pemeriksaan usia</li>
                <li>foto profil</li>
                <li>status akun, waktu pendaftaran, dan waktu masuk terakhir</li>
              </ul>

              <h3>B.2.2 Data pendidikan</h3>
              <ul>
                <li>nama sekolah atau perguruan tinggi</li>
                <li>jenjang, tingkat, program studi, atau jurusan</li>
                <li>nomor identitas pendidikan jika diperlukan untuk verifikasi dan telah disetujui</li>
                <li>status atau hasil verifikasi pendidikan</li>
              </ul>

              <h3>B.2.3 Data profil dan portofolio</h3>
              <ul>
                <li>biografi singkat, minat, keterampilan, dan pengalaman</li>
                <li>gambar, dokumen, tautan, atau keterangan portofolio</li>
                <li>preferensi lokasi dan cara pelaksanaan proyek</li>
                <li>informasi lain yang dipilih pengguna untuk ditampilkan pada profil</li>
              </ul>

              <h3>B.2.4 Data proyek dan pengajuan</h3>
              <ul>
                <li>judul, deskripsi, kategori, tujuan, posisi, kebutuhan keterampilan, tenggat, dan komitmen proyek</li>
                <li>alasan bergabung, posisi yang dipilih, kemampuan, portofolio, dan kesiapan waktu calon anggota</li>
                <li>status pengajuan, keputusan pemilik proyek, dan waktu perubahan status</li>
                <li>informasi pertemuan pertama, termasuk jadwal, tautan konferensi, lokasi ruang publik, dan tautan peta</li>
              </ul>

              <h3>B.2.5 Data laporan dan dukungan</h3>
              <ul>
                <li>isi laporan, akun atau konten yang dilaporkan, alasan, bukti, dan hasil penanganan</li>
                <li>pesan yang dikirim kepada tim dukungan atau pengelola</li>
                <li>catatan banding atas keputusan moderasi</li>
              </ul>

              <h3>B.2.6 Data teknis</h3>
              <ul>
                <li>alamat protokol internet, jenis perangkat, sistem operasi, dan peramban</li>
                <li>waktu akses, halaman yang digunakan, catatan kesalahan, dan aktivitas keamanan</li>
                <li>cookie sesi atau teknologi serupa yang diperlukan untuk autentikasi dan keamanan</li>
              </ul>
              <p>
                ProjectMatch tidak meminta data keuangan, kata sandi akun lain, kode verifikasi, alamat rumah lengkap, atau
                dokumen identitas lengkap untuk proses pencarian rekan proyek. Jangan memasukkan data tersebut ke profil,
                postingan, portofolio, pengajuan, atau laporan kecuali diminta secara sah melalui proses khusus yang aman.
              </p>
            </section>

            <section id="sumber-data">
              <h2>B.3 Sumber Data</h2>
              <p>Data dapat diperoleh dari:</p>
              <ul>
                <li>pengguna saat mendaftar, mengisi profil, membuat proyek, mengajukan diri, atau menghubungi ProjectMatch</li>
                <li>orang tua atau wali ketika memberikan persetujuan dan informasi untuk akun anak</li>
                <li>sekolah, perguruan tinggi, atau instansi pendidikan jika terdapat kerja sama dan dasar pemrosesan yang sah</li>
                <li>penyedia autentikasi atau layanan teknis yang digunakan oleh ProjectMatch</li>
                <li>sistem ProjectMatch melalui catatan akses, keamanan, dan penggunaan fitur</li>
                <li>pengguna lain ketika membuat laporan atau memberikan informasi yang berkaitan dengan suatu proyek</li>
              </ul>
              <p>
                Jika data diperoleh dari institusi pendidikan, ProjectMatch akan membatasi penggunaannya untuk tujuan yang
                telah disepakati, memberi informasi kepada pengguna, dan memastikan terdapat izin atau dasar hukum yang sesuai.
              </p>
            </section>

            <section id="tujuan-data">
              <h2>B.4 Tujuan Penggunaan Data</h2>
              <p>ProjectMatch menggunakan data untuk:</p>
              <ol>
                <li>membuat, mengelola, dan mengamankan akun</li>
                <li>menampilkan profil pendidikan, keterampilan, dan portofolio sesuai pengaturan layanan</li>
                <li>menampilkan proyek serta membantu pengguna menemukan posisi yang relevan</li>
                <li>memproses pengajuan dan menyampaikan hasil seleksi</li>
                <li>menampilkan informasi pertemuan pertama kepada anggota yang diterima</li>
                <li>memeriksa usia, persetujuan orang tua atau wali, dan identitas pendidikan jika fitur tersebut diterapkan</li>
                <li>mencegah penipuan, penyalahgunaan akun, konten berbahaya, dan risiko terhadap anak</li>
                <li>menerima, memeriksa, dan menindaklanjuti laporan</li>
                <li>memberikan dukungan serta menjawab pertanyaan pengguna</li>
                <li>menguji, memperbaiki, dan meningkatkan kinerja serta kemudahan penggunaan ProjectMatch</li>
                <li>memenuhi kewajiban hukum dan permintaan sah dari pihak yang berwenang</li>
              </ol>
              <p>
                ProjectMatch tidak menjual atau menyewakan data pribadi pengguna. Data anak tidak digunakan untuk iklan
                perilaku, pemasaran yang ditargetkan, atau penyusunan profil komersial. Data pengguna juga tidak digunakan
                untuk melatih model kecerdasan buatan tanpa pemberitahuan dan dasar pemrosesan yang sesuai.
              </p>
            </section>

            <section id="dasar-pemrosesan">
              <h2>B.5 Dasar Pemrosesan Data</h2>
              <p>Pemrosesan data dilakukan berdasarkan satu atau lebih dasar berikut:</p>
              <ul>
                <li>persetujuan pengguna untuk pemrosesan tertentu</li>
                <li>persetujuan orang tua atau wali untuk pemrosesan data pengguna anak</li>
                <li>pelaksanaan perjanjian ketika data diperlukan untuk menyediakan akun dan fitur yang diminta</li>
                <li>kewajiban hukum yang harus dipenuhi pengelola</li>
                <li>kepentingan yang sah untuk keamanan, pencegahan penyalahgunaan, dan peningkatan layanan setelah mempertimbangkan hak pengguna</li>
                <li>pelindungan kepentingan penting pengguna dalam keadaan darurat sesuai hukum</li>
              </ul>
              <p>
                Jika pemrosesan didasarkan pada persetujuan, pengguna atau orang tua dan wali dapat menarik persetujuan.
                Penarikan tidak memengaruhi keabsahan pemrosesan yang telah dilakukan sebelumnya. Beberapa fitur mungkin tidak
                dapat digunakan apabila data yang diperlukan tidak lagi boleh diproses.
              </p>
            </section>

            <section id="data-anak">
              <h2>B.6 Data Pengguna Anak</h2>
              <ol>
                <li>Data pengguna di bawah 18 tahun diperlakukan sebagai data anak dan diproses secara khusus.</li>
                <li>ProjectMatch ditujukan bagi pelajar sejak jenjang SMP. Data pengguna yang masih anak diproses dengan pelindungan khusus sesuai hukum.</li>
                <li>Untuk memproses data anak, persetujuan orang tua atau wali diperlukan sesuai ketentuan yang berlaku.</li>
                <li>Informasi privasi disampaikan dengan bahasa yang dapat dipahami pelajar dan orang tua atau wali.</li>
                <li>Data anak digunakan untuk penyediaan layanan, keamanan, dan penanganan laporan, sesuai tujuan yang dijelaskan pada kebijakan ini.</li>
                <li>Orang tua atau wali dapat menggunakan hak terkait data anak sesuai ketentuan yang berlaku.</li>
              </ol>
            </section>

            <section id="akses-data">
              <h2>B.7 Akses dan Tampilan Data</h2>
              <p>Tingkat akses data dibedakan sebagai berikut:</p>
              <ul>
                <li><strong>Data profil.</strong> Informasi tertentu dapat dilihat pengguna lain untuk menilai kecocokan kolaborasi.</li>
                <li><strong>Data proyek.</strong> Informasi proyek dapat ditampilkan pada halaman Jelajah dan Detail Proyek.</li>
                <li><strong>Data pengajuan.</strong> Hanya dapat dilihat oleh calon anggota terkait, pemilik proyek, dan pengelola yang berwenang.</li>
                <li><strong>Informasi pertemuan.</strong> Hanya ditampilkan kepada pemilik proyek dan anggota yang telah diterima.</li>
                <li><strong>Data laporan.</strong> Hanya dapat diakses oleh petugas yang menangani keamanan, moderasi, atau kewajiban hukum.</li>
              </ul>
              <p>
                ProjectMatch akan memberi penjelasan pada formulir mengenai informasi yang wajib diisi, bersifat pilihan,
                ditampilkan kepada pengguna lain, atau hanya digunakan untuk keperluan internal.
              </p>
            </section>

            <section id="pembagian-data">
              <h2>B.8 Pembagian dan Pengungkapan Data</h2>
              <p>Data hanya dibagikan dalam keadaan berikut:</p>
              <ul>
                <li>kepada pengguna lain sesuai fungsi profil, proyek, pengajuan, dan pertemuan</li>
                <li>kepada penyedia layanan yang membantu menjalankan ProjectMatch berdasarkan perjanjian dan pembatasan penggunaan data</li>
                <li>kepada sekolah, kampus, atau instansi pendidikan untuk verifikasi jika pengguna telah diberi informasi dan terdapat dasar pemrosesan yang sah</li>
                <li>kepada orang tua atau wali terkait keselamatan dan pengelolaan data anak sesuai hukum</li>
                <li>kepada aparat, pengadilan, kementerian, atau pihak berwenang jika diwajibkan oleh hukum atau diperlukan untuk melindungi keselamatan</li>
                <li>dalam proses penggabungan, pengalihan, atau perubahan pengelola setelah hak pengguna tetap dilindungi dan pemberitahuan diberikan jika diwajibkan</li>
              </ul>
              <p>ProjectMatch tidak akan membuka isi laporan kepada pengguna lain melebihi informasi yang diperlukan untuk pemeriksaan dan penyelesaian.</p>
            </section>

            <section id="penyedia-layanan">
              <h2>B.9 Penyedia Layanan</h2>
              <p>ProjectMatch menggunakan atau berencana menggunakan penyedia berikut:</p>
              <ul>
                <li><strong>Supabase</strong> untuk autentikasi dan penyimpanan basis data</li>
                <li><strong>Cloudinary</strong> untuk penyimpanan dan penyajian gambar</li>
                <li><strong>Penyedia hosting</strong> untuk menjalankan aplikasi web. Identitas penyedia dan lokasi pemrosesan harus diumumkan setelah layanan hosting ditetapkan.</li>
                <li><strong>Zoom</strong> jika pemilik proyek menggunakan tautan Zoom untuk pertemuan pertama</li>
                <li><strong>Layanan peta</strong> jika pengguna membuka tautan lokasi ruang publik</li>
              </ul>
              <p>
                Daftar penyedia, lokasi pemrosesan, dan tautan kebijakan privasi masing-masing penyedia harus diperbarui sesuai
                penggunaan aktual sebelum ProjectMatch diluncurkan. Zoom dan layanan peta hanya memproses data menurut
                interaksi pengguna dengan layanan tersebut dan tunduk pada kebijakan masing-masing.
              </p>
            </section>

            <section id="retensi-data">
              <h2>B.10 Penyimpanan dan Penghapusan Data</h2>
              <p>Data disimpan hanya selama diperlukan untuk menyediakan layanan, menangani laporan, dan memenuhi kewajiban hukum. Masa penyimpanan harus ditetapkan berdasarkan jenis data sebelum layanan dibuka untuk umum. Prinsipnya meliputi:</p>
              <ul>
                <li>data akun disimpan selama akun aktif</li>
                <li>data proyek dan pengajuan dihapus atau dianonimkan ketika tujuan penyimpanannya telah berakhir, kecuali masih diperlukan untuk sengketa atau kewajiban hukum</li>
                <li>data laporan dan keamanan disimpan selama diperlukan untuk pemeriksaan, pencegahan pelanggaran berulang, atau kewajiban hukum</li>
                <li>data pada cadangan dihapus sesuai siklus pencadangan yang harus ditetapkan dan diumumkan oleh pengelola</li>
              </ul>
              <p>
                Ketika akun atau data dihapus, data akan dihapus dari sistem aktif atau dibuat tidak dapat dikaitkan kembali
                dengan pengguna. Sebagian data dapat disimpan lebih lama jika diwajibkan oleh hukum, diperlukan untuk sengketa,
                keamanan, pencegahan penipuan, atau pelindungan anak.
              </p>
            </section>

            <section id="keamanan-data">
              <h2>B.11 Keamanan Data</h2>
              <p>ProjectMatch menerapkan langkah teknis dan organisasi yang sesuai dengan risiko, antara lain:</p>
              <ul>
                <li>autentikasi dan pengendalian hak akses</li>
                <li>pembatasan akses berdasarkan fungsi dan kebutuhan petugas</li>
                <li>pengamanan komunikasi data saat dikirim</li>
                <li>pencatatan aktivitas penting dan pemantauan kesalahan</li>
                <li>perlindungan kunci layanan melalui variabel lingkungan</li>
                <li>pencadangan serta pengujian pemulihan data</li>
                <li>pembaruan keamanan dan pengujian fungsi penting</li>
                <li>prosedur penanganan insiden dan laporan keselamatan anak</li>
              </ul>
              <p>
                Pengguna tetap bertanggung jawab menjaga keamanan akun, perangkat, dan informasi masuk. Jika pengguna menduga
                terjadi akses tanpa izin, pengguna harus segera mengganti informasi masuk yang relevan dan melaporkan kejadian
                melalui fitur pelaporan yang tersedia pada ProjectMatch.
              </p>
            </section>

            <section id="transfer-data">
              <h2>B.12 Transfer Data ke Wilayah Lain</h2>
              <p>
                Penyedia layanan ProjectMatch dapat memproses data pada pusat data di luar Indonesia. Jika terjadi transfer
                data lintas negara, ProjectMatch akan memastikan negara penerima memiliki tingkat pelindungan yang memadai
                atau menerapkan perlindungan lain yang diwajibkan hukum, termasuk perjanjian, penilaian risiko, dan persetujuan
                jika diperlukan.
              </p>
              <p>Lokasi pemrosesan data bergantung pada wilayah layanan yang dipilih pengelola pada Supabase, Cloudinary, dan penyedia hosting. Pengelola wajib mencatat dan mengumumkan wilayah tersebut sebelum layanan dibuka untuk umum.</p>
            </section>

            <section id="hak-pengguna">
              <h2>B.13 Hak Pengguna</h2>
              <p>Sesuai ketentuan yang berlaku, pengguna dapat meminta untuk:</p>
              <ul>
                <li>memperoleh informasi mengenai pemrosesan data</li>
                <li>mengakses dan mendapatkan salinan data pribadi</li>
                <li>memperbaiki data yang tidak akurat atau tidak lengkap</li>
                <li>menghapus atau memusnahkan data dalam keadaan yang diperbolehkan hukum</li>
                <li>menarik persetujuan</li>
                <li>membatasi atau menghentikan pemrosesan tertentu</li>
                <li>mengajukan keberatan terhadap keputusan yang hanya didasarkan pada pemrosesan otomatis</li>
                <li>memperoleh atau memindahkan data dalam bentuk yang dapat digunakan jika diwajibkan hukum</li>
                <li>mengajukan keluhan dan meminta ganti rugi sesuai ketentuan yang berlaku</li>
              </ul>
              <p>
                Pengelola wajib menyediakan mekanisme permintaan hak data dalam layanan sebelum ProjectMatch dibuka untuk umum.
                ProjectMatch dapat meminta informasi yang diperlukan untuk memeriksa identitas pemohon. Untuk akun anak,
                permintaan dapat diajukan oleh anak sesuai kapasitasnya atau oleh orang tua dan wali yang telah diverifikasi.
              </p>
            </section>

            <section id="cookie-log">
              <h2>B.14 Cookie dan Catatan Teknis</h2>
              <p>
                ProjectMatch dapat menggunakan cookie sesi atau teknologi serupa yang diperlukan untuk menjaga pengguna tetap
                masuk, mengingat pengaturan keamanan, mencegah penyalahgunaan, dan menjaga fungsi dasar layanan. Cookie yang
                benar-benar diperlukan tidak digunakan untuk iklan perilaku.
              </p>
              <p>
                Jika ProjectMatch menggunakan analitik tambahan pada masa mendatang, pengguna akan diberi informasi mengenai
                penyedia, jenis data, tujuan, masa penyimpanan, serta pilihan persetujuan sebelum analitik yang tidak wajib
                diaktifkan. Informasi cookie yang digunakan harus dicantumkan pada halaman ini sebelum penggunaan analitik tambahan.
              </p>
            </section>

            <section id="insiden-data">
              <h2>B.15 Insiden dan Kebocoran Data</h2>
              <p>
                Jika terjadi kegagalan pelindungan data pribadi, ProjectMatch akan melakukan pemeriksaan, membatasi dampak,
                memulihkan keamanan, mendokumentasikan kejadian, dan memberikan pemberitahuan kepada pengguna, orang tua atau
                wali, serta pihak berwenang dalam jangka waktu yang diwajibkan hukum.
              </p>
              <p>
                Pemberitahuan akan menjelaskan data yang terdampak, waktu kejadian, kemungkinan akibat, langkah penanganan, dan
                tindakan yang dapat dilakukan pengguna. Dugaan insiden dapat dilaporkan melalui fitur pelaporan ProjectMatch.
              </p>
            </section>

            <section id="perubahan-privasi">
              <h2>B.16 Perubahan Kebijakan Privasi</h2>
              <p>
                Kebijakan Privasi dapat diperbarui ketika terdapat perubahan fitur, penyedia layanan, tujuan penggunaan data,
                atau peraturan. Perubahan penting akan diberitahukan melalui ProjectMatch atau alamat email pengguna sebelum
                berlaku jika diwajibkan hukum.
              </p>
              <p>
                Jika perubahan menimbulkan tujuan pemrosesan baru yang memerlukan persetujuan, ProjectMatch akan meminta
                persetujuan baru dari pengguna atau orang tua dan wali sebelum pemrosesan dilakukan.
              </p>
              <p>Permintaan terkait privasi diproses melalui mekanisme hak data yang wajib disediakan dalam layanan.</p>
            </section>

            <section id="dasar-regulasi">
              <h2>Rujukan Regulasi Utama</h2>
              <p>Dokumen ini disusun dengan memperhatikan regulasi Indonesia yang relevan, termasuk:</p>
              <ul>
                <li><a href="https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022">Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi</a></li>
                <li><a href="https://peraturan.bpk.go.id/Details/316698/pp-no-17-tahun-2025">Peraturan Pemerintah Nomor 17 Tahun 2025 tentang Tata Kelola Penyelenggaraan Sistem Elektronik dalam Pelindungan Anak</a></li>
                <li><a href="https://peraturan.bpk.go.id/Details/122030/pp-no-71-">Peraturan Pemerintah Nomor 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik</a></li>
                <li><a href="https://jdih.komdigi.go.id/produk_hukum/view/id/759/t/pera">Peraturan Menteri Komunikasi dan Informatika Nomor 5 Tahun 2020 tentang Penyelenggara Sistem Elektronik Lingkup Privat</a></li>
                <li><a href="https://jdih.komdigi.go.id/produk_hukum/view/id/1007/t/peraturan%2Bmenteri%2Bkomunikasi%2Bdan%2Bdigital%2Bnomor%2B9%2Btahun%2B2026">Peraturan Menteri Komunikasi dan Digital Nomor 9 Tahun 2026 tentang Pelaksanaan Pelindungan Anak dalam Sistem Elektronik</a></li>
              </ul>
              <p>
                Daftar ini bukan daftar lengkap. Pengelola wajib menyesuaikan dokumen dengan model operasional, hasil penilaian
                risiko layanan, dan peraturan pelaksana yang berlaku pada saat ProjectMatch diluncurkan.
              </p>
            </section>
          </article>
        </div>

        <p className="mt-6 px-2 text-center text-xs leading-6 text-slate-500 sm:mt-8">
          © 2026 ProjectMatch. Syarat Penggunaan dan Kebijakan Privasi versi 1.0.
        </p>
      </div>
    </main>
  );
}
