// Kullanıcı verileri array'i
let users = [];
let userIdCounter = 1;
let deleteUserId = null;

// DOM elementi seçicileri
const userForm = document.getElementById("userForm");
const userTable = document.getElementById("userTable");
const emptyMessage = document.getElementById("emptyMessage");
const tableContainer = document.getElementById("tableContainer");
const alertContainer = document.getElementById("alertContainer");
const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
const deleteUserInfo = document.getElementById("deleteUserInfo");
const confirmDeleteBtn = document.getElementById("confirmDelete");

// Form submit event listener
userForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (validateForm()) {
    addUser();
  }
});

// Form reset event listener
userForm.addEventListener("reset", function () {
  clearValidation();
  hideAlert();
});

// Confirm delete button event listener
confirmDeleteBtn.addEventListener("click", function () {
  if (deleteUserId !== null) {
    removeUser(deleteUserId);
    deleteModal.hide();
    deleteUserId = null;
  }
});

// Form validasyonu
function validateForm() {
  const tcNo = document.getElementById("tcNo").value.trim();
  const adSoyad = document.getElementById("adSoyad").value.trim();
  const telefon = document.getElementById("telefon").value.trim();
  const adres = document.getElementById("adres").value.trim();
  const il = document.getElementById("il").value;
  const ulke = document.getElementById("ulke").value;

  let isValid = true;

  // TC Kimlik No kontrolü
  if (!validateTcNo(tcNo)) {
    showFieldError(
      "tcNo",
      "TC Kimlik No 11 haneli olmalı ve sadece rakam içermelidir."
    );
    isValid = false;
  } else if (isTcNoExists(tcNo)) {
    showFieldError("tcNo", "Bu TC Kimlik No zaten kayıtlıdır.");
    isValid = false;
  } else {
    clearFieldError("tcNo");
  }

  // Ad Soyad kontrolü
  if (adSoyad.length < 2) {
    showFieldError("adSoyad", "Ad Soyad en az 2 karakter olmalıdır.");
    isValid = false;
  } else {
    clearFieldError("adSoyad");
  }

  // Telefon kontrolü
  if (!validatePhoneNumber(telefon)) {
    showFieldError(
      "telefon",
      "Cep telefonu formatı: 05xxxxxxxxx şeklinde olmalıdır."
    );
    isValid = false;
  } else {
    clearFieldError("telefon");
  }

  // Adres kontrolü
  if (adres.length < 10) {
    showFieldError("adres", "Adres en az 10 karakter olmalıdır.");
    isValid = false;
  } else {
    clearFieldError("adres");
  }

  // İl kontrolü
  if (!il) {
    showFieldError("il", "Lütfen bir il seçiniz.");
    isValid = false;
  } else {
    clearFieldError("il");
  }

  // Ülke kontrolü
  if (!ulke) {
    showFieldError("ulke", "Lütfen bir ülke seçiniz.");
    isValid = false;
  } else {
    clearFieldError("ulke");
  }

  return isValid;
}

// TC Kimlik No validasyonu
function validateTcNo(tcNo) {
  // 11 haneli ve sadece rakam kontrolü
  const tcRegex = /^[0-9]{11}$/;
  if (!tcRegex.test(tcNo)) {
    return false;
  }

  // İlk hane 0 olamaz
  if (tcNo[0] === "0") {
    return false;
  }

  // TC Kimlik No algoritması (basit kontrol)
  const digits = tcNo.split("").map(Number);
  const sum1 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
  const check1 = (sum1 * 7 - sum2) % 10;
  const check2 = (sum1 + sum2 + digits[9]) % 10;

  return check1 === digits[9] && check2 === digits[10];
}

// Telefon numarası validasyonu
function validatePhoneNumber(phone) {
  const phoneRegex = /^05[0-9]{9}$/;
  return phoneRegex.test(phone);
}

// TC No'nun daha önce kayıtlı olup olmadığını kontrol et
function isTcNoExists(tcNo) {
  return users.some((user) => user.tcNo === tcNo);
}

// Field error gösterme
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const feedback = field.nextElementSibling;

  field.classList.add("is-invalid");
  field.classList.remove("is-valid");
  feedback.textContent = message;
}

// Field error temizleme
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const feedback = field.nextElementSibling;

  field.classList.remove("is-invalid");
  field.classList.add("is-valid");
  feedback.textContent = "";
}

// Tüm validasyonları temizle
function clearValidation() {
  const fields = ["tcNo", "adSoyad", "telefon", "adres", "il", "ulke"];
  fields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    field.classList.remove("is-invalid", "is-valid");
  });
}

// Kullanıcı ekleme
function addUser() {
  const user = {
    id: userIdCounter++,
    tcNo: document.getElementById("tcNo").value.trim(),
    adSoyad: document.getElementById("adSoyad").value.trim(),
    telefon: document.getElementById("telefon").value.trim(),
    adres: document.getElementById("adres").value.trim(),
    il: document.getElementById("il").value,
    ulke: document.getElementById("ulke").value,
  };

  users.push(user);
  renderTable();
  userForm.reset();
  clearValidation();

  showAlert(
    "success",
    "Kullanıcı başarıyla eklendi!",
    user.adSoyad + " isimli kullanıcı sisteme kaydedildi."
  );
}

// Kullanıcı silme
function removeUser(userId) {
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex > -1) {
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    renderTable();
    showAlert(
      "warning",
      "Kullanıcı silindi!",
      deletedUser.adSoyad + " isimli kullanıcı sistemden kaldırıldı."
    );
  }
}

// Tablo render etme
function renderTable() {
  if (users.length === 0) {
    emptyMessage.classList.remove("d-none");
    tableContainer.classList.add("d-none");
    return;
  }

  emptyMessage.classList.add("d-none");
  tableContainer.classList.remove("d-none");

  userTable.innerHTML = users
    .map(
      (user) => `
        <tr>
            <td><strong>${user.tcNo}</strong></td>
            <td>${user.adSoyad}</td>
            <td>${formatPhoneNumber(user.telefon)}</td>
            <td><small>${user.adres}</small></td>
            <td><span class="badge bg-primary">${user.il}</span></td>
            <td><span class="badge bg-success">${user.ulke}</span></td>
            <td>
                <button class="btn btn-danger btn-sm btn-delete" onclick="showDeleteConfirmation(${
                  user.id
                }, '${user.adSoyad}', '${user.tcNo}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `
    )
    .join("");
}

// Telefon numarasını formatla
function formatPhoneNumber(phone) {
  return phone.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
}

// Silme onayı modalını göster
function showDeleteConfirmation(userId, adSoyad, tcNo) {
  deleteUserId = userId;
  deleteUserInfo.innerHTML = `
        <strong>Ad Soyad:</strong> ${adSoyad}<br>
        <strong>TC Kimlik No:</strong> ${tcNo}
    `;
  deleteModal.show();
}

// Alert mesajı gösterme
function showAlert(type, title, message) {
  const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fas fa-${getAlertIcon(type)}"></i>
            <strong>${title}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

  alertContainer.innerHTML = alertHtml;

  // 5 saniye sonra otomatik kapat
  setTimeout(() => {
    const alert = alertContainer.querySelector(".alert");
    if (alert) {
      bootstrap.Alert.getOrCreateInstance(alert).close();
    }
  }, 5000);
}

// Alert icon'unu belirle
function getAlertIcon(type) {
  switch (type) {
    case "success":
      return "check-circle";
    case "warning":
      return "exclamation-triangle";
    case "danger":
      return "exclamation-circle";
    default:
      return "info-circle";
  }
}

// Alert'i gizle
function hideAlert() {
  alertContainer.innerHTML = "";
}

// Sayfa yüklendiğinde çalışacak kodlar
document.addEventListener("DOMContentLoaded", function () {
  // Örnek veri ekle (demo için)
  // Bu kısmı kaldırabilirsiniz
  /*
    users = [
        {
            id: userIdCounter++,
            tcNo: '12345678901',
            adSoyad: 'Ahmet Yılmaz',
            telefon: '05321234567',
            adres: 'Atatürk Mahallesi, Cumhuriyet Caddesi No:15',
            il: 'İstanbul',
            ulke: 'Türkiye'
        }
    ];
    renderTable();
    */
});
