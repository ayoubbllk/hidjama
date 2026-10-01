/**
 * لوحة طلبيات أبو عبد الرحمان
 *
 * طريقة التثبيت:
 * 1. افتح Google Sheet "commande hidjama"
 * 2. Extensions → Apps Script
 * 3. استبدل كل الكود بهذا الملف
 * 4. من القائمة اختر setupSheet ثم Run (مرة واحدة)
 * 5. Deploy → Manage deployments → Edit → New version → Deploy
 *    (لا تغيّر الرابط إذا كان نفس المشروع)
 */

var SHEET_NAME = "commande hidjama";
var STATUSES = ["جديد", "قيد المعالجة", "تم التأكيد", "تم الشحن", "ملغى"];

var COLORS = {
  ink: "#10231c",
  header: "#0b3d2e",
  headerText: "#f4fbf7",
  emerald: "#059669",
  mint: "#d1fae5",
  band: "#ecfdf5",
  white: "#ffffff",
  line: "#d7e8df",
  muted: "#5f746b",
  zebra: "#f7fbf9",
  newBg: "#ecfdf5",
  newText: "#065f46",
  progressBg: "#fff7ed",
  progressText: "#9a3412",
  confirmedBg: "#eff6ff",
  confirmedText: "#1e3a8a",
  shippedBg: "#f5f3ff",
  shippedText: "#5b21b6",
  cancelledBg: "#fef2f2",
  cancelledText: "#991b1b",
};

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet_();
  ss.setActiveSheet(sheet);

  var existing = readExistingOrders_(sheet);

  sheet.clear();
  sheet.clearConditionalFormatRules();
  sheet.setRightToLeft(true);
  sheet.setHiddenGridlines(true);
  sheet.setTabColor(COLORS.emerald);

  buildBanner_(sheet);
  buildStats_(sheet);
  buildFilters_(sheet);
  buildTableHeader_(sheet);
  writeOrders_(sheet, existing);
  styleDataArea_(sheet);
  applyStatusColors_(sheet);

  sheet.setFrozenRows(8);
  sheet.setRowHeights(1, 1, 18);
  sheet.setRowHeight(2, 42);
  sheet.setRowHeight(3, 22);
  sheet.setRowHeights(4, 2, 28);
  sheet.setRowHeight(6, 16);
  sheet.setRowHeight(7, 36);
  sheet.setRowHeight(8, 46);

  var widths = [46, 168, 190, 140, 130, 360, 90, 130, 150, 220];
  for (var i = 0; i < widths.length; i++) sheet.setColumnWidth(i + 1, widths[i]);

  protectLayout_(sheet);
  ss.toast("تم تجهيز لوحة الطلبيات", "أبو عبد الرحمان", 4);
}

function buildBanner_(sheet) {
  sheet.getRange("A1:J1").setBackground(COLORS.ink);
  sheet.getRange("A2:J2").merge()
    .setValue("أبو عبد الرحمان  ·  لوحة الطلبيات")
    .setBackground(COLORS.ink)
    .setFontColor("#ffffff")
    .setFontSize(20)
    .setFontWeight("bold")
    .setHorizontalAlignment("right")
    .setVerticalAlignment("middle");
  sheet.getRange("A3:J3").merge()
    .setValue("كؤوس الحجامة الإسلامية   |   التوصيل إلى جميع ولايات الجزائر")
    .setBackground(COLORS.ink)
    .setFontColor("#a7f3d0")
    .setFontSize(11)
    .setHorizontalAlignment("right")
    .setVerticalAlignment("middle");
}

function buildStats_(sheet) {
  var cards = [
    ["إجمالي الطلبيات", '=COUNTA(B9:B)'],
    ["جديد", '=COUNTIF(I9:I,"جديد")'],
    ["قيد المعالجة", '=COUNTIF(I9:I,"قيد المعالجة")'],
    ["تم الشحن", '=COUNTIF(I9:I,"تم الشحن")'],
    ["المجموع دج", '=IFERROR(SUM(H9:H),0)']
  ];
  var starts = [1, 3, 5, 7, 9];
  for (var i = 0; i < cards.length; i++) {
    var col = starts[i];
    sheet.getRange(4, col, 1, 2).merge()
      .setValue(cards[i][0])
      .setBackground(COLORS.band)
      .setFontColor(COLORS.muted)
      .setFontSize(10)
      .setFontWeight("bold")
      .setHorizontalAlignment("center");
    sheet.getRange(5, col, 1, 2).merge()
      .setFormula(cards[i][1])
      .setBackground(COLORS.white)
      .setFontColor(COLORS.header)
      .setFontSize(16)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setNumberFormat(i === 4 ? '#,##0" دج"' : "0");
  }
  sheet.getRange("A4:J5").setBorder(true, true, true, true, true, true, COLORS.line, SpreadsheetApp.BorderStyle.SOLID);
}

function buildFilters_(sheet) {
  sheet.getRange("A6:J6").setBackground("#f8faf9");
  sheet.getRange("A7:B7").merge()
    .setValue("تصفية حسب الحالة")
    .setFontColor(COLORS.muted)
    .setFontWeight("bold")
    .setHorizontalAlignment("right")
    .setVerticalAlignment("middle")
    .setBackground(COLORS.white);

  var labels = ["الكل", "جديد", "قيد المعالجة", "تم التأكيد", "تم الشحن", "ملغى"];
  for (var i = 0; i < labels.length; i++) {
    sheet.getRange(7, 3 + i)
      .setValue(labels[i])
      .setBackground(i === 0 ? COLORS.header : COLORS.mint)
      .setFontColor(i === 0 ? "#ffffff" : COLORS.header)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle")
      .setBorder(true, true, true, true, false, false, COLORS.emerald, SpreadsheetApp.BorderStyle.SOLID);
  }
  sheet.getRange("I7:J7").merge()
    .setFormula('="آخر تحديث: "&TEXT(NOW(),"yyyy-MM-dd HH:mm")')
    .setFontColor(COLORS.muted)
    .setHorizontalAlignment("left")
    .setVerticalAlignment("middle");
}

function buildTableHeader_(sheet) {
  var headers = ["#", "التاريخ", "الاسم", "الهاتف", "الولاية", "تفاصيل الطلب", "الكمية", "المجموع", "الحالة", "ملاحظات"];
  var header = sheet.getRange(8, 1, 1, headers.length);
  header.setValues([headers]);
  header
    .setBackground(COLORS.header)
    .setFontColor(COLORS.headerText)
    .setFontWeight("bold")
    .setFontSize(11)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
}

function styleDataArea_(sheet) {
  var body = sheet.getRange("A9:J508");
  body
    .setFontColor(COLORS.ink)
    .setFontSize(11)
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center")
    .setBackground(COLORS.white)
    .setBorder(true, true, true, true, true, true, COLORS.line, SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange("F9:F508").setHorizontalAlignment("right").setWrap(true);
  sheet.getRange("J9:J508").setHorizontalAlignment("right").setWrap(true);
  sheet.getRange("C9:C508").setHorizontalAlignment("right").setFontWeight("bold");
  sheet.getRange("H9:H508").setNumberFormat('#,##0').setFontWeight("bold").setFontColor(COLORS.header);

  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUSES, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("I9:I508").setDataValidation(rule);

  var banding = sheet.getRange("A9:J508").getBandings();
  banding.forEach(function (b) { b.remove(); });
  sheet.getRange("A9:J508").applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false)
    .setFirstRowColor(COLORS.white)
    .setSecondRowColor(COLORS.zebra)
    .setHeaderRowColor(null)
    .setFooterRowColor(null);
}

function applyStatusColors_(sheet) {
  var range = sheet.getRange("I9:I508");
  var rules = sheet.getConditionalFormatRules();
  var map = [
    ["جديد", COLORS.newBg, COLORS.newText],
    ["قيد المعالجة", COLORS.progressBg, COLORS.progressText],
    ["تم التأكيد", COLORS.confirmedBg, COLORS.confirmedText],
    ["تم الشحن", COLORS.shippedBg, COLORS.shippedText],
    ["ملغى", COLORS.cancelledBg, COLORS.cancelledText]
  ];
  map.forEach(function (item) {
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(item[0])
        .setBackground(item[1])
        .setFontColor(item[2])
        .setRanges([range])
        .build()
    );
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied('=$I9="' + item[0] + '"')
        .setBackground(item[1])
        .setRanges([sheet.getRange("A9:H508"), sheet.getRange("J9:J508")])
        .build()
    );
  });
  sheet.setConditionalFormatRules(rules);
}

function readExistingOrders_(sheet) {
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var values = sheet.getRange(1, 1, last, Math.max(sheet.getLastColumn(), 9)).getValues();
  var headerRow = -1;
  for (var r = 0; r < values.length; r++) {
    var joined = values[r].join(" ");
    if (joined.indexOf("الاسم") !== -1 && (joined.indexOf("الهاتف") !== -1 || joined.indexOf("الولاية") !== -1)) {
      headerRow = r;
      break;
    }
  }
  if (headerRow === -1) return [];

  var headers = values[headerRow].map(function (h) { return String(h).trim(); });
  var idx = function (name) { return headers.indexOf(name); };
  var orders = [];
  for (var i = headerRow + 1; i < values.length; i++) {
    var row = values[i];
    var name = row[idx("الاسم")] || row[idx("الاسم الكامل")] || "";
    if (!name) continue;
    var status = String(row[idx("الحالة")] || row[idx("حالة الطلب")] || "جديد").replace(/[^\u0600-\u06FF\s]/g, "").trim();
    if (STATUSES.indexOf(status) === -1) status = "جديد";
    orders.push([
      row[idx("التاريخ")] || row[idx("تاريخ الطلب")] || "",
      name,
      row[idx("الهاتف")] || row[idx("رقم الهاتف")] || "",
      row[idx("الولاية")] || "",
      row[idx("تفاصيل الطلب")] || row[idx("تفاصيل الطلبية")] || "",
      row[idx("الكمية")] || row[idx("إجمالي الكمية")] || "",
      row[idx("المجموع")] || row[idx("المجموع (دج)")] || "",
      status,
      row[idx("ملاحظات")] || ""
    ]);
  }
  return orders;
}

function writeOrders_(sheet, orders) {
  if (!orders.length) return;
  var rows = orders.map(function (order, index) {
    return [index + 1].concat(order);
  });
  sheet.getRange(9, 1, rows.length, 10).setValues(rows);
  sheet.getRange(9, 1, rows.length, 10).setWrap(true);
  for (var i = 0; i < rows.length; i++) sheet.setRowHeight(9 + i, 58);
}

function protectLayout_(sheet) {
  var protections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  protections.forEach(function (p) { p.remove(); });
  var lock = sheet.getRange("A1:J8").protect().setDescription("ترويسة لوحة الطلبيات");
  lock.setWarningOnly(true);
}

function paintNewRow_(sheet, row) {
  sheet.getRange(row, 1, 1, 10)
    .setFontColor(COLORS.ink)
    .setFontSize(11)
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center")
    .setBorder(true, true, true, true, true, true, COLORS.line, SpreadsheetApp.BorderStyle.SOLID)
    .setBackground(row % 2 === 0 ? COLORS.zebra : COLORS.white);
  sheet.getRange(row, 3).setHorizontalAlignment("right").setFontWeight("bold");
  sheet.getRange(row, 6).setHorizontalAlignment("right").setWrap(true);
  sheet.getRange(row, 8).setNumberFormat('#,##0').setFontWeight("bold").setFontColor(COLORS.header);
  sheet.getRange(row, 10).setHorizontalAlignment("right").setWrap(true);
  sheet.setRowHeight(row, 58);
}

function doPost(e) {
  try {
    var sheet = getOrCreateSheet_();
    var data = JSON.parse(e.postData.contents);
    var date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
    var last = Math.max(sheet.getLastRow(), 8);
    var number = last < 9 ? 1 : Number(sheet.getRange(last, 1).getValue() || 0) + 1;
    var row = last + 1;

    sheet.getRange(row, 1, 1, 10).setValues([[
      number,
      date,
      data.name || "",
      data.phone || "",
      data.wilaya || "",
      data.orderDetails || "",
      data.totalItems || "",
      data.totalPrice || "",
      "جديد",
      ""
    ]]);
    paintNewRow_(sheet, row);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function showAll() { clearOrderFilter_(); }
function showNew() { filterByStatus_("جديد"); }
function showProgress() { filterByStatus_("قيد المعالجة"); }
function showConfirmed() { filterByStatus_("تم التأكيد"); }
function showShipped() { filterByStatus_("تم الشحن"); }
function showCancelled() { filterByStatus_("ملغى"); }

function filterByStatus_(status) {
  var sheet = getOrCreateSheet_();
  var range = sheet.getRange("A8:J508");
  var filter = sheet.getFilter();
  if (!filter) filter = range.createFilter();
  var criteria = SpreadsheetApp.newFilterCriteria().whenTextEqualTo(status).build();
  filter.setColumnFilterCriteria(9, criteria);
}

function clearOrderFilter_() {
  var sheet = getOrCreateSheet_();
  var filter = sheet.getFilter();
  if (filter) filter.remove();
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("لوحة الطلبيات")
    .addItem("تجهيز التصميم", "setupSheet")
    .addSeparator()
    .addItem("عرض الكل", "showAll")
    .addItem("جديد", "showNew")
    .addItem("قيد المعالجة", "showProgress")
    .addItem("تم التأكيد", "showConfirmed")
    .addItem("تم الشحن", "showShipped")
    .addItem("ملغى", "showCancelled")
    .addToUi();
}

function onEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAME) return;
  if (e.range.getRow() !== 7) return;
  var col = e.range.getColumn();
  var value = String(e.value || "");
  var actions = {
    3: showAll,
    4: showNew,
    5: showProgress,
    6: showConfirmed,
    7: showShipped,
    8: showCancelled
  };
  if (actions[col] && value) {
    actions[col]();
    e.range.setValue(value);
  }
}
