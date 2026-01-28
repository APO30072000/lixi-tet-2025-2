/* =======================
   DATA
======================= */
let prizes = [
  { name: "Nguyễn Văn Trãi", qty: 1 },
  { name: "Bùi Mạnh Thắng", qty: 1 },
  { name: "Nguyễn Văn Thú", qty: 1 },
  { name: "Nguyễn Đức Độ", qty: 1 },
  { name: "Vũ Văn Bình", qty: 1 },
  { name: "Vũ Văn Hùng", qty: 1 },
  { name: "Nguyễn Xuân Cư", qty: 1 },
  { name: "Phạm Gia Hóa", qty: 1 },
  { name: "Trương Ngọc Thúy", qty: 1 },
  { name: "Nguyễn Văn Huy", qty: 1 },
  { name: "Phạm Trung Tuyển", qty: 1 },
  { name: "Hoàng Văn Huynh", qty: 1 },
  { name: "Đỗ Đình Công", qty: 1 },
  { name: "Tây Môn Khánh ", qty: 1 },
  { name: "Phạm Văn Quang", qty: 1 },
  { name: "Nguyễn Đình Nhất", qty: 1 },
  { name: "Phạm Văn Bắc", qty: 1 },
  { name: "Nguyễn Văn Hải", qty: 1 },
  { name: "Nguyễn Thị Hà", qty: 1 },
  { name: "Vũ Thị Hằng", qty: 1 },
  { name: "Vũ Xuân Hạnh", qty: 1 },
  { name: "Đào Văn Lượm", qty: 1 },
  { name: "Hà Duy Hải", qty: 1 },
  { name: "Đỗ Duy Trưởng", qty: 1 },
  { name: "Hà Phương Hằng", qty: 1 },
  { name: "Tô Tài Dũng", qty: 1 },
  { name: "Nguyễn Đình Mạnh", qty: 1 },
  { name: "Ngô Chí Hoàn", qty: 1 },
  { name: "Chu Văn Tuyến", qty: 1 },
  { name: "Đỗ Văn Cung", qty: 1 },
  { name: "Nguyễn Quốc Đạt", qty: 1 },
  { name: "Nguyễn Ngọc Trường", qty: 1 },
  { name: "Hà Ngọc Quang", qty: 1 },
  { name: "Đào Văn Nho", qty: 1 },
  { name: "Hà Văn Ninh", qty: 1 },
  { name: "Nguyễn Thị Trang", qty: 1 },
  { name: "Nguyễn Quang Loát", qty: 1 },
  { name: "Nguyễn Danh Tới", qty: 1 },
  { name: "Vũ Văn Cường", qty: 1 },
  { name: "Phạm Thị Vân", qty: 1 },
  { name: "Lê Huy Sơn", qty: 1 },
  { name: "Vũ Viết Đại", qty: 1 },
  { name: "Nguyễn Xuân Tài", qty: 1 },
  { name: "Nguyễn Thị Hiền", qty: 1 },
  { name: "Trương Đình Tiến", qty: 1 },
  { name: "Đặng Văn Ngọc", qty: 1 },
  { name: "Phạm Thị Thắm", qty: 1 },
  { name: "Lê Lương An", qty: 1 }
];

/* =======================
   SAVE / LOAD
======================= */
/* =======================
   SAVE / LOAD
======================= */
function savePrizes() {
  localStorage.setItem("lixi_prizes", JSON.stringify(prizes));
}
function loadPrizes() {
  const data = localStorage.getItem("lixi_prizes");
  if (data) prizes = JSON.parse(data);
}
loadPrizes();


/* =======================
   DOM
======================= */
const circle = document.getElementById("circle");
const result = document.getElementById("result");
const music = document.getElementById("music");
const spinBtn = document.getElementById("spinBtn");
const settingBtn = document.getElementById("settingBtn");
const modal = document.getElementById("modal");
const prizeTable = document.getElementById("prizeTable");

/* =======================
   CONFIG
======================= */
const LIXI_COUNT = 12;
const RADIUS = 190;
const SPIN_TIME = 30; // 🔥 THỜI GIAN QUAY (GIÂY)

let spinning = false;

/* =======================
   RENDER LÌ XÌ
======================= */
function renderCircle() {
  circle.innerHTML = "";
  for (let i = 0; i < LIXI_COUNT; i++) {
    const li = document.createElement("div");
    li.className = "lixi";

    const angle = (2 * Math.PI / LIXI_COUNT) * i;
    const x = RADIUS * Math.cos(angle);
    const y = RADIUS * Math.sin(angle);
    const rotateDeg = angle * 180 / Math.PI + 90;

    li.style.left = "50%";
    li.style.top = "50%";
    li.style.transform = `
      translate(-50%, -50%)
      translate(${x}px, ${y}px)
      rotate(${rotateDeg}deg)
    `;
    circle.appendChild(li);
  }
}
renderCircle();

/* =======================
   TOTAL QTY
======================= */
function totalQty() {
  return prizes.reduce((s, p) => s + Math.max(0, p.qty), 0);
}

/* =======================
   DRAW PRIZE (THEO QTY)
======================= */
function drawPrize() {
  const total = totalQty();
  if (total <= 0) return null;

  let r = Math.random() * total;
  for (let p of prizes) {
    if (r < p.qty) {
      p.qty--;
      savePrizes();
      renderPrizeDisplay();
      renderSettingTable();
      return p.name;
    }
    r -= p.qty;
  }
  return null;
}

/* =======================
   SPIN
======================= */
spinBtn.onclick = () => {
  if (spinning) return;
  if (totalQty() <= 0) {
    result.innerHTML = "🎊 ĐÃ HẾT PHẦN QUÀ 🎊";
    return;
  }

  spinning = true;
  result.innerHTML = "";

  music.currentTime = 0;
  music.play();

  circle.style.transition = "none";
  circle.style.transform = "rotate(0deg)";
  circle.offsetHeight;

  const rotateDeg = 3000 + Math.random() * 360;
  circle.style.transition = `transform ${SPIN_TIME}s cubic-bezier(.15,.75,.25,1)`;
  circle.style.transform = `rotate(${rotateDeg}deg)`;
};

circle.addEventListener("transitionend", () => {
  if (!spinning) return;
  spinning = false;

  const prize = drawPrize();
  result.innerHTML = prize
    ? `🎉 Bạn nhận được: <b>${prize}</b> 🎉`
    : "😢 Không có phần quà";
});

/* =======================
   HIỂN THỊ BẢNG QUÀ (GÓC PHẢI)
======================= */
function renderPrizeDisplay() {
  const table = document.getElementById("prizeTableDisplay");
  table.innerHTML = `
    <tr>
      <th>Tên quà</th>
      <th>Số lượng</th>
      <th>Tỷ lệ (%)</th>
    </tr>
  `;

  const total = totalQty();
  prizes.forEach(p => {
    const rate = total ? ((p.qty / total) * 100).toFixed(1) : 0;
    const row = table.insertRow();
    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.qty}</td>
      <td>${rate}%</td>
    `;
  });
}
renderPrizeDisplay();

/* =======================
   MODAL CÀI ĐẶT
======================= */
settingBtn.onclick = () => {
  modal.style.display = "block";
  renderSettingTable();
};

function closeModal() {
  modal.style.display = "none";
  savePrizes();
  renderPrizeDisplay();
}

/* =======================
   BẢNG CÀI ĐẶT
======================= */
function renderSettingTable() {
  prizeTable.innerHTML = `
    <tr>
      <th>Tên quà</th>
      <th>Số lượng</th>
      <th></th>
    </tr>
  `;

  prizes.forEach((p, i) => {
    const row = prizeTable.insertRow();
    row.innerHTML = `
      <td><input value="${p.name}" onchange="updateName(${i}, this.value)"></td>
      <td><input type="number" min="0" value="${p.qty}" onchange="updateQty(${i}, this.value)"></td>
      <td><button onclick="removePrize(${i})">❌</button></td>
    `;
  });
}

/* =======================
   CRUD
======================= */
function updateName(i, v) {
  prizes[i].name = v;
  savePrizes();
}
function updateQty(i, v) {
  prizes[i].qty = parseInt(v) || 0;
  savePrizes();
  renderPrizeDisplay();
}
function removePrize(i) {
  prizes.splice(i, 1);
  savePrizes();
  renderSettingTable();
  renderPrizeDisplay();
}

document.getElementById("addPrize").onclick = () => {
  prizes.push({ name: "Quà mới", qty: 1 });
  renderSettingTable();
};


