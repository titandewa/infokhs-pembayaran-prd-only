"use strict";

// Data item pembayaran UKT
var ITEMS = [
  { id: "her", name: "HER", price: 2900000 },
  { id: "uts", name: "UTS", price: 2900000 }
];
var BANKS = ["Bank BNI", "Bank BRI", "Bank Mandiri"];
var VA_EXAMPLE = "1234 5678 9012 3456"; // contoh, bukan nomor asli

// phase: "select" (layar 1-3), "confirm" (layar 4), "bank" (layar 5), "va" (layar 6)
var state = { phase: "select", selected: {}, bank: "" };

function rupiah(n) {
  return "Rp " + new Intl.NumberFormat("id-ID").format(n);
}
function $(id) { return document.getElementById(id); }
function el(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

// Total dihitung dari item yang terpilih, jadi menekan item berulang
// tidak pernah menambah nominal (maksimal Rp 5.800.000).
function selectedItems() {
  return ITEMS.filter(function (i) { return state.selected[i.id]; });
}
function total() {
  return selectedItems().reduce(function (s, i) { return s + i.price; }, 0);
}

// Nomor layar 1-6. Layar 1-3 mengikuti jumlah item yang sudah dipilih.
function screenNo() {
  if (state.phase === "select") return selectedItems().length + 1;
  if (state.phase === "confirm") return 4;
  if (state.phase === "bank") return 5;
  return 6;
}

function renderRows(listEl, withRemove) {
  listEl.textContent = "";
  selectedItems().forEach(function (i) {
    var li = el("li");
    li.appendChild(el("span", "", i.name + " · " + rupiah(i.price)));
    if (withRemove) {
      var b = el("button", "rm", "Hapus");
      b.type = "button";
      b.setAttribute("aria-label", "Hapus " + i.name + " dari daftar");
      b.addEventListener("click", function () {
        delete state.selected[i.id];
        render();
      });
      li.appendChild(b);
    }
    listEl.appendChild(li);
  });
}

function renderItems() {
  var ul = $("items");
  ul.textContent = "";
  ITEMS.forEach(function (i) {
    var li = el("li");
    var on = !!state.selected[i.id];
    var b = el("button", "item");
    b.type = "button";
    b.setAttribute("aria-pressed", on ? "true" : "false");
    var info = el("span");
    info.appendChild(el("span", "name", i.name));
    info.appendChild(el("span", "price", rupiah(i.price)));
    b.appendChild(info);
    b.appendChild(el("span", "tag", on ? "Terpilih" : "Pilih"));
    b.addEventListener("click", function () {
      state.selected[i.id] = true; // idempoten: tekan lagi tidak menambah nominal
      render();
    });
    li.appendChild(b);
    ul.appendChild(li);
  });
}

function renderBanks() {
  var ul = $("banks");
  ul.textContent = "";
  BANKS.forEach(function (name) {
    var li = el("li");
    var b = el("button", "item");
    b.type = "button";
    b.appendChild(el("span", "name", name));
    b.addEventListener("click", function () {
      state.bank = name;
      state.phase = "va";
      render();
    });
    li.appendChild(b);
    ul.appendChild(li);
  });
}

var HINTS = [
  "Pilih item yang ingin Anda bayar. Setiap item hanya bisa dipilih satu kali.",
  "HER sudah terpilih. Menekan item yang sama lagi tidak menambah nominal. Pilih UTS untuk melanjutkan.",
  "HER dan UTS tampil sebagai dua baris terpisah. Menekan item lagi tidak mengubah nominal."
];

function render() {
  var n = screenNo();
  var views = { select: "view-select", confirm: "view-confirm", bank: "view-bank", va: "view-va" };
  Object.keys(views).forEach(function (p) { $(views[p]).hidden = p !== state.phase; });

  var titles = ["Pembayaran UKT", "Pembayaran UKT", "Pembayaran UKT", "Konfirmasi Pembayaran", "Pilih Bank", "Nomor Virtual Account"];
  $("title").textContent = titles[n - 1];
  $("step-label").textContent = n < 6 ? "InfoKHS · Langkah " + n + " dari 5" : "InfoKHS · Selesai";
  $("total").textContent = rupiah(total());
  document.title = "Layar " + n + " · Pembayaran UKT InfoKHS";

  var count = selectedItems().length;
  var next = $("btn-next");
  var back = $("btn-back");
  back.hidden = true;
  next.hidden = false;
  next.disabled = false;

  if (state.phase === "select") {
    $("select-hint").textContent = HINTS[count > 0 ? count : 0];
    if (count === 1) {
      // contoh: HER sudah terpilih -> arahkan memilih item lain
      var left = selectedItems()[0].name;
      $("select-hint").textContent = left + " sudah terpilih. Menekan item yang sama lagi tidak menambah nominal. Pilih item lainnya untuk melanjutkan.";
    }
    renderItems();
    renderRows($("selected-list"), true);
    $("selected-empty").hidden = count > 0;
    next.textContent = "Lanjut ke Konfirmasi";
    next.disabled = count < 2;
  } else if (state.phase === "confirm") {
    renderRows($("confirm-list"), false);
    var names = selectedItems().map(function (i) { return i.name; }).join(" dan ");
    $("confirm-note").textContent = "Pilihan Anda: " + names + ", masing-masing satu kali.";
    back.hidden = false;
    back.textContent = "Ubah pilihan";
    next.textContent = "Pilih Bank";
  } else if (state.phase === "bank") {
    renderBanks();
    next.hidden = true;
    back.hidden = false;
    back.textContent = "Kembali ke Konfirmasi";
  } else {
    $("va-bank").textContent = state.bank;
    $("va-number").textContent = VA_EXAMPLE;
    renderRows($("va-list"), false);
    next.textContent = "Selesai, kembali ke awal";
  }
}

$("btn-next").addEventListener("click", function () {
  if (state.phase === "select") state.phase = "confirm";
  else if (state.phase === "confirm") state.phase = "bank";
  else if (state.phase === "va") state = { phase: "select", selected: {}, bank: "" };
  render();
});
$("btn-back").addEventListener("click", function () {
  state.phase = state.phase === "bank" ? "confirm" : "select";
  render();
});

render();
