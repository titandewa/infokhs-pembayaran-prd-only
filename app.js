"use strict";

// Data item pembayaran UKT
var ITEMS = [
  { id: "her", name: "HER", price: 2900000 },
  { id: "uts", name: "UTS", price: 2900000 }
];
var BANKS = ["Bank BNI", "Bank BRI", "Bank Mandiri"];
var VA_EXAMPLE = "1234 5678 9012 3456"; // contoh, bukan nomor asli

var state = { step: 1, selected: {}, bank: "" };

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

function renderRows(listEl, withRemove) {
  listEl.textContent = "";
  selectedItems().forEach(function (i) {
    var li = el("li");
    var left = el("span", "", i.name + " · " + rupiah(i.price));
    li.appendChild(left);
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
      state.step = 4;
      render();
    });
    li.appendChild(b);
    ul.appendChild(li);
  });
}

function render() {
  var s = state.step;
  var views = ["view-select", "view-confirm", "view-bank", "view-va"];
  views.forEach(function (v, idx) { $(v).hidden = idx + 1 !== s; });

  var titles = ["Pembayaran UKT", "Konfirmasi Pembayaran", "Pilih Bank", "Nomor Virtual Account"];
  $("title").textContent = titles[s - 1];
  $("step-label").textContent = s < 4 ? "InfoKHS · Langkah " + s + " dari 3" : "InfoKHS · Selesai";
  $("total").textContent = rupiah(total());

  var count = selectedItems().length;
  var next = $("btn-next");
  var back = $("btn-back");
  back.hidden = true;
  next.hidden = false;
  next.disabled = false;

  if (s === 1) {
    renderItems();
    renderRows($("selected-list"), true);
    $("selected-empty").hidden = count > 0;
    next.textContent = "Lanjut ke Konfirmasi";
    next.disabled = count === 0;
  } else if (s === 2) {
    renderRows($("confirm-list"), false);
    var names = selectedItems().map(function (i) { return i.name; }).join(" dan ");
    $("confirm-note").textContent = "Pilihan Anda: " + names + ", masing-masing satu kali.";
    back.hidden = false;
    back.textContent = "Ubah pilihan";
    next.textContent = "Pilih Bank";
  } else if (s === 3) {
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
  if (state.step === 4) {
    state = { step: 1, selected: {}, bank: "" };
  } else {
    state.step += 1;
  }
  render();
});
$("btn-back").addEventListener("click", function () {
  state.step = state.step === 3 ? 2 : 1;
  render();
});

render();
