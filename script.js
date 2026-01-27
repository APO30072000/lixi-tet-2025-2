let prizes = [
  { name: "10.000đ", qty: 10 },
  { name: "20.000đ", qty: 6 },
  { name: "50.000đ", qty: 4 },
  { name: "Chúc bạn may mắn", qty: 10 }
];

/* =======================
   SAVE / LOAD LOCALSTORAGE
======================= */
function savePrizes() {
  localStorage.setItem("lixi_prizes", JSON.stringify(prizes));
}

function loadPrizes() {
  const data = localStorage.getItem("lixi_prizes");
  if (data) {
    prizes = JSON.parse(data);
  }
}

loadPrizes();

/* =======================
   DOM
======================= */
const circle = document.getElementById("circle");
const result = document.getElementById("result");
const music = document.getElementById("music");
const btn = document.getElementById("spinBtn");
const settingBtn = document.getElementById("settingBtn");
const modal = document.getElementById("modal");
const prizeTable = document.getElementById("prizeTable");
const addPrizeBtn = document.getElementById("addPrize");

/* =======================
   CONFIG
======================= */
const LIXI_COUNT = 12;
const RADIUS = 190;

/* =======================
   TẠO LÌ XÌ CÁNH QUẠT
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
   DRAW PRIZE RANDOM
======================= */
function drawPrize() {
  const total = totalQty();
  if (total <= 0) return null;

  let r = Math.random() * total;
  for (let p of prizes) {
    if (r < p.qty) {
      p.qty--;                  // tự động -1
      savePrizes();             // lưu lại
      renderPrizeDisplay();     // cập nhật bảng trực tiếp
      return p.name;
    }
    r -= p.qty;
  }
}

/* =======================
   SPIN BUTTON
======================= */
btn.onclick = () => {
  if (totalQty() <= 0) {
    result.innerHTML = "🎊 ĐÃ HẾT PHẦN QUÀ 🎊";
    return;
  }

  result.innerHTML = "";
  music.currentTime = 0;
  music.play();

  circle.style.transition = "none";
  circle.style.transform = "rotate(0deg)";

  setTimeout(() => {
    circle.style.transition = "transform 30s cubic-bezier(.15,.75,.25,1)";
    circle.style.transform = `rotate(${1800 + Math.random() * 360}deg)`;
  }, 50);

  btn.onclick = () => {
  if (totalQty() <= 0) {
    result.innerHTML = "🎊 ĐÃ HẾT PHẦN QUÀ 🎊";
    return;
  }

  btn.disabled = true; // chặn spam click
  result.innerHTML = "";

  music.currentTime = 0;
  music.play();

  circle.style.transition = "none";
  circle.style.transform = "rotate(0deg)";

  setTimeout(() => {
    circle.style.transition = "transform 30s cubic-bezier(.15,.75,.25,1)";
    circle.style.transform = `rotate(${1800 + Math.random() * 360}deg)`;
  }, 50);

  // ✅ CHỜ QUAY DỪNG HẲN
  circle.addEventListener("transitionend", onSpinEnd, { once: true });
};

function onSpinEnd() {
  const prize = drawPrize();
  result.innerHTML = `🎉 Bạn nhận được: <b>${prize}</b> 🎉`;
  btn.disabled = false;
}

};

/* =======================
   SETTINGS MODAL
======================= */
settingBtn.onclick = () => {
  modal.style.display = "block";
  renderPrizeTable();
};

function closeModal() {
  savePrizes();
  modal.style.display = "none";
}

/* =======================
   RENDER TABLE TRONG MODAL
======================= */
function renderPrizeTable() {
  prizeTable.innerHTML = `
    <tr>
      <th>Tên quà</th>
      <th>Số lượng</th>
      <th>Tỷ lệ (%)</th>
      <th></th>
    </tr>
  `;

  const total = totalQty();
  prizes.forEach((p, i) => {
    const rate = total ? ((p.qty / total) * 100).toFixed(1) : 0;
    const row = prizeTable.insertRow();
    row.innerHTML = `
      <td>
        <input value="${p.name}" onchange="prizes[${i}].name=this.value; savePrizes(); renderPrizeDisplay();">
      </td>
      <td>
        <input type="number" min="0" value="${p.qty}"
          onchange="prizes[${i}].qty=+this.value; savePrizes(); renderPrizeTable(); renderPrizeDisplay();">
      </td>
      <td>${rate}%</td>
      <td>
        <button onclick="removePrize(${i})">❌</button>
      </td>
    `;
  });

  renderPrizeDisplay();
}

/* =======================
   RENDER BẢNG HIỂN THỊ TRỰC TIẾP
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

/* =======================
   ADD / REMOVE QUÀ
======================= */
function removePrize(i) {
  prizes.splice(i, 1);
  savePrizes();
  renderPrizeTable();
  renderPrizeDisplay();
}

addPrizeBtn.onclick = () => {
  prizes.push({ name: "Phần quà mới", qty: 1 });
  savePrizes();
  renderPrizeTable();
  renderPrizeDisplay();
}

// Gọi render lần đầu
renderPrizeDisplay();



