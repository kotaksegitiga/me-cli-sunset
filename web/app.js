const { useMemo, useState } = React;

const menuItems = [
  { id: "1", label: "Login/Ganti akun" },
  { id: "2", label: "Lihat Paket Saya" },
  { id: "3", label: "Beli Paket 🔥 HOT 🔥" },
  { id: "4", label: "Beli Paket 🔥 HOT-2 🔥" },
  { id: "8", label: "Riwayat Transaksi" },
  { id: "9", label: "Family Plan/Akrab Organizer" },
  { id: "10", label: "Circle" },
  { id: "11", label: "Store Segments" },
  { id: "12", label: "Store Family List" },
  { id: "13", label: "Store Packages" },
  { id: "14", label: "Redemables" },
  { id: "N", label: "Notifikasi" },
  { id: "00", label: "Bookmark Paket" },
];

const initialProfile = {
  number: "62812xxxxxxx",
  subscriptionType: "PREPAID",
  balance: 45500,
  activeUntil: "2025-12-31",
  points: 120,
  tier: 2,
};

const packageCatalog = [
  {
    code: "XL-UNL-01",
    name: "Unlimited Turbo 7 Hari",
    price: 49000,
    validity: "7 hari",
    benefits: ["Unlimited", "Bonus 2GB"],
    hot: true,
  },
  {
    code: "XL-COMBO-02",
    name: "Xtra Combo 12GB",
    price: 65000,
    validity: "30 hari",
    benefits: ["12GB kuota utama", "1GB YouTube"],
    hot: true,
  },
  {
    code: "XL-EDU-03",
    name: "Edukasi 5GB",
    price: 10000,
    validity: "1 hari",
    benefits: ["5GB kuota edukasi"],
    hot: false,
  },
];

const initialPackages = [
  {
    name: "Xtra Combo Flex",
    quota: "5.2 GB / 10 GB",
    expires: "2025-02-04",
  },
  {
    name: "Unlimited Turbo",
    quota: "Unlimited",
    expires: "2025-02-01",
  },
];

const initialNotifications = [
  {
    id: "notif-1",
    title: "Promo spesial akhir minggu!",
    body: "Diskon paket data hingga 30%.",
    time: "10 menit lalu",
  },
  {
    id: "notif-2",
    title: "Pembelian sukses",
    body: "Paket Xtra Combo 12GB aktif.",
    time: "2 jam lalu",
  },
];

const initialTransactions = [
  {
    id: "trx-1",
    title: "Beli Xtra Combo 12GB",
    price: 65000,
    status: "SUCCESS",
    date: "2025-01-27",
  },
  {
    id: "trx-2",
    title: "Beli Unlimited Turbo",
    price: 49000,
    status: "PENDING",
    date: "2025-01-25",
  },
];

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID").format(amount);
}

function App() {
  const [activeItem, setActiveItem] = useState(menuItems[0]);
  const [profile, setProfile] = useState(initialProfile);
  const [packages, setPackages] = useState(initialPackages);
  const [bookmarks, setBookmarks] = useState([]);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [statusMessage, setStatusMessage] = useState("Siap digunakan.");

  const hotPackages = useMemo(
    () => packageCatalog.filter((item) => item.hot),
    []
  );

  const otherPackages = useMemo(
    () => packageCatalog.filter((item) => !item.hot),
    []
  );

  function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const number = formData.get("number");
    const type = formData.get("type");
    setProfile((prev) => ({
      ...prev,
      number,
      subscriptionType: type,
    }));
    setStatusMessage(`Berhasil memperbarui akun ke ${number}.`);
  }

  function handlePurchase(item) {
    setTransactions((prev) => [
      {
        id: `trx-${Date.now()}`,
        title: `Beli ${item.name}`,
        price: item.price,
        status: "SUCCESS",
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setPackages((prev) => [
      {
        name: item.name,
        quota: item.benefits[0] || "Aktif",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
      },
      ...prev,
    ]);
    setStatusMessage(`Pembelian ${item.name} berhasil.`);
  }

  function handleBookmark(item) {
    setBookmarks((prev) => {
      if (prev.some((saved) => saved.code === item.code)) {
        return prev;
      }
      return [...prev, item];
    });
    setStatusMessage(`Paket ${item.name} ditambahkan ke bookmark.`);
  }

  function handleClearNotifications() {
    setNotifications([]);
    setStatusMessage("Semua notifikasi dibersihkan.");
  }

  function renderDetail() {
    switch (activeItem.id) {
      case "1":
        return (
          <div className="detail-card">
            <p className="detail-title">Login / Ganti Akun</p>
            <form className="form" onSubmit={handleLogin}>
              <label>
                Nomor
                <input
                  name="number"
                  defaultValue={profile.number}
                  placeholder="628xxxx"
                  required
                />
              </label>
              <label>
                Tipe pelanggan
                <select name="type" defaultValue={profile.subscriptionType}>
                  <option value="PREPAID">Prepaid</option>
                  <option value="POSTPAID">Postpaid</option>
                </select>
              </label>
              <button className="primary" type="submit">
                Simpan
              </button>
            </form>
          </div>
        );
      case "2":
        return (
          <div className="detail-card">
            <p className="detail-title">Paket Saya</p>
            <ul className="list">
              {packages.map((pkg) => (
                <li key={pkg.name}>
                  <div>
                    <strong>{pkg.name}</strong>
                    <p>{pkg.quota}</p>
                  </div>
                  <span className="muted">Exp {pkg.expires}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case "3":
      case "4":
        return (
          <div className="detail-card">
            <p className="detail-title">Paket HOT</p>
            <ul className="cards">
              {hotPackages.map((item) => (
                <li key={item.code}>
                  <h5>{item.name}</h5>
                  <p>{item.validity}</p>
                  <p className="price">Rp {formatRupiah(item.price)}</p>
                  <div className="card-actions">
                    <button className="primary" onClick={() => handlePurchase(item)}>
                      Beli
                    </button>
                    <button onClick={() => handleBookmark(item)}>Bookmark</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      case "8":
        return (
          <div className="detail-card">
            <p className="detail-title">Riwayat Transaksi</p>
            <ul className="list">
              {transactions.map((trx) => (
                <li key={trx.id}>
                  <div>
                    <strong>{trx.title}</strong>
                    <p>{trx.date}</p>
                  </div>
                  <div className={`status ${trx.status.toLowerCase()}`}>
                    {trx.status}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      case "N":
        return (
          <div className="detail-card">
            <div className="detail-header">
              <p className="detail-title">Notifikasi</p>
              <button onClick={handleClearNotifications}>Bersihkan</button>
            </div>
            <ul className="list">
              {notifications.length === 0 ? (
                <li className="empty">Tidak ada notifikasi.</li>
              ) : (
                notifications.map((notif) => (
                  <li key={notif.id}>
                    <div>
                      <strong>{notif.title}</strong>
                      <p>{notif.body}</p>
                    </div>
                    <span className="muted">{notif.time}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        );
      case "00":
        return (
          <div className="detail-card">
            <p className="detail-title">Bookmark Paket</p>
            {bookmarks.length === 0 ? (
              <p className="muted">Belum ada paket yang dibookmark.</p>
            ) : (
              <ul className="list">
                {bookmarks.map((item) => (
                  <li key={item.code}>
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.validity}</p>
                    </div>
                    <span className="muted">Rp {formatRupiah(item.price)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      default:
        return (
          <div className="detail-card">
            <p className="detail-title">{activeItem.label}</p>
            <p className="detail-body">
              Fitur ini sedang dalam pengembangan. Gunakan menu Paket HOT untuk
              mencoba alur pembelian.
            </p>
            <div className="cards" style={{ gridTemplateColumns: "1fr" }}>
              {otherPackages.map((item) => (
                <div key={item.code} className="mini-card">
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.validity}</p>
                  </div>
                  <button onClick={() => handleBookmark(item)}>Bookmark</button>
                </div>
              ))}
            </div>
          </div>
        );
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">MYnyak Engsel • React Demo</p>
          <h1>CLI Flow, versi UI React.</h1>
          <p className="subtitle">
            Demo ini sudah interaktif: bisa ganti akun, lihat paket, beli paket,
            dan menyimpan bookmark. Data tetap lokal (belum terkoneksi API).
          </p>
          <div className="status">{statusMessage}</div>
        </div>
        <div className="profile-card">
          <h2>Profil Aktif</h2>
          <dl>
            <div>
              <dt>Nomor</dt>
              <dd>{profile.number}</dd>
            </div>
            <div>
              <dt>Tipe</dt>
              <dd>{profile.subscriptionType}</dd>
            </div>
            <div>
              <dt>Pulsa</dt>
              <dd>Rp {formatRupiah(profile.balance)}</dd>
            </div>
            <div>
              <dt>Aktif sampai</dt>
              <dd>{profile.activeUntil}</dd>
            </div>
            <div>
              <dt>Points</dt>
              <dd>
                {profile.points} • Tier {profile.tier}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <main className="layout">
        <section className="menu">
          <h3>Menu Utama</h3>
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={activeItem.id === item.id ? "active" : ""}
                  onClick={() => setActiveItem(item)}
                >
                  <span className="badge">{item.id}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="detail">
          <h3>Detail Aksi</h3>
          {renderDetail()}
        </section>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
