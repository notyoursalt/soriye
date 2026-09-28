/**
 * Sorryye — Application Core Logic (3-Stage Apple & Samsung One UI Wizard)
 * Realtime Resignation Letter Generator & 1-Page A4 Guarantee
 */

// State Object matching the 3 clear stages
const state = {
  currentStep: 1, // 1, 2, 3
  currentTemplate: 'modern', // 'modern', 'classic', 'clean'
  currentView: 'landing', // 'landing', 'builder'
  mobileMode: 'form', // 'form', 'preview'
  
  // TAHAP 1: DATA DIRI & KANTOR
  fullName: 'Ahmad Rizky Pratama',
  jobTitle: 'Senior Product Designer',
  department: 'Product & Experience Design',
  employeeId: 'EMP-2023-08819',
  city: 'Jakarta',
  
  companyName: 'PT Teknologi Maju Sejahtera',
  managerName: 'Dewi Anggraini',
  recipientPosition: 'Head of People',
  companyAddress: 'SCBD Lot 8, Jakarta Selatan',
  
  // TAHAP 2: WAKTU & ALASAN
  letterDate: '',
  lwdDate: '',
  noticeDays: 30,
  reason: 'melanjutkan jenjang karier dan tantangan profesional baru',
  customReason: '',
  hideReason: false,
  additionalNotes: 'Saya berkomitmen penuh untuk menyelesaikan seluruh tanggung jawab serta membantu proses transisi dan serah terima (handover) pekerjaan sebelum hari kerja terakhir saya.',
  
  // TAHAP 3: TANDA TANGAN & LOGO
  logoUrl: null,
  hasCustomLogo: false,
  signatureDataUrl: null,
  hasSignature: false,
  modernGradient: 'sunset' // 'sunset', 'ocean', 'emerald', 'violet'
};

// Indonesian Month Names
const INDO_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function formatDateIndo(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return `${day} ${INDO_MONTHS[monthIndex] || ''} ${year}`;
  }
  return dateStr;
}

function getTodayString() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDaysToDateString(dateStr, days) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// DOM Elements
const elements = {
  // Views & Nav
  landingView: document.getElementById('landingView'),
  builderView: document.getElementById('builderView'),
  siteHeader: document.getElementById('siteHeader'),
  navLinkHome: document.getElementById('navLinkHome'),
  navLinkHow: document.getElementById('navLinkHow'),
  navLinkTemplates: document.getElementById('navLinkTemplates'),
  navLinkFaq: document.getElementById('navLinkFaq'),
  
  // Buttons
  btnNavCreate: document.getElementById('btnNavCreate'),
  btnHeroCreate: document.getElementById('btnHeroCreate'),
  btnHeroQuickStart: document.getElementById('btnHeroQuickStart'),
  btnHowToBuilder: document.getElementById('btnHowToBuilder'),
  btnBackToHome: document.getElementById('btnBackToHome'),
  btnLoadSampleData: document.getElementById('btnLoadSampleData'),
  btnSaveDraft: document.getElementById('btnSaveDraft'),
  
  // Mobile View Switcher
  btnMobileShowForm: document.getElementById('btnMobileShowForm'),
  btnMobileShowPreview: document.getElementById('btnMobileShowPreview'),
  builderWorkspace: document.getElementById('builderWorkspace'),
  
  // 3-Stage Segmented Wizard
  stepSegmentBtns: document.querySelectorAll('.step-segment-btn'),
  stepPanels: [
    document.getElementById('stepPanel1'),
    document.getElementById('stepPanel2'),
    document.getElementById('stepPanel3')
  ],
  btnPrevStep: document.getElementById('btnPrevStep'),
  btnNextStep: document.getElementById('btnNextStep'),
  
  // Tahap 1: Data Diri & Kantor
  inputFullName: document.getElementById('inputFullName'),
  inputJobTitle: document.getElementById('inputJobTitle'),
  inputDepartment: document.getElementById('inputDepartment'),
  inputEmployeeId: document.getElementById('inputEmployeeId'),
  inputCity: document.getElementById('inputCity'),
  inputCompanyName: document.getElementById('inputCompanyName'),
  inputManagerName: document.getElementById('inputManagerName'),
  inputRecipientPosition: document.getElementById('inputRecipientPosition'),
  inputCompanyAddress: document.getElementById('inputCompanyAddress'),
  
  // Tahap 2: Waktu & Alasan
  inputLetterDate: document.getElementById('inputLetterDate'),
  inputLwdDate: document.getElementById('inputLwdDate'),
  noticePresetBtns: document.querySelectorAll('.notice-presets .preset-btn'),
  selectReason: document.getElementById('selectReason'),
  customReasonGroup: document.getElementById('customReasonGroup'),
  inputCustomReason: document.getElementById('inputCustomReason'),
  checkNoReason: document.getElementById('checkNoReason'),
  inputAdditionalNotes: document.getElementById('inputAdditionalNotes'),
  
  // Tahap 3: Tanda Tangan & Logo
  logoThumbImg: document.getElementById('logoThumbImg'),
  logoNoThumbIcon: document.getElementById('logoNoThumbIcon'),
  logoFileName: document.getElementById('logoFileName'),
  logoFileInput: document.getElementById('logoFileInput'),
  btnUploadLogo: document.getElementById('btnUploadLogo'),
  btnRemoveLogo: document.getElementById('btnRemoveLogo'),
  
  signatureCanvas: document.getElementById('signatureCanvas'),
  sigWrapper: document.getElementById('sigWrapper'),
  btnClearSig: document.getElementById('btnClearSig'),
  btnUseSampleSig: document.getElementById('btnUseSampleSig'),
  sigFileInput: document.getElementById('sigFileInput'),
  btnUploadSigFile: document.getElementById('btnUploadSigFile'),
  
  // Template Selectors
  templatePillBtns: document.querySelectorAll('.template-pill-btn'),
  templateCardPreviews: document.querySelectorAll('.template-choice-card'),
  modernGradientOptions: document.getElementById('modernGradientOptions'),
  activeGradientName: document.getElementById('activeGradientName'),
  gradientSwatchBtns: document.querySelectorAll('.gradient-swatch-btn'),
  
  // A4 Document Elements (1 Lembar Pas)
  a4Document: document.getElementById('a4Document'),
  docHeaderCompany: document.getElementById('docHeaderCompany'),
  docHeaderAddress: document.getElementById('docHeaderAddress'),
  docLogoWrapper: document.getElementById('docLogoWrapper'),
  docLogoImg: document.getElementById('docLogoImg'),
  docLocation: document.getElementById('docLocation'),
  docFormattedDate: document.getElementById('docFormattedDate'),
  docManager: document.getElementById('docManager'),
  docCompany: document.getElementById('docCompany'),
  docAddress: document.getElementById('docAddress'),
  docBodyName: document.getElementById('docBodyName'),
  docBodyRole: document.getElementById('docBodyRole'),
  docBodyDept: document.getElementById('docBodyDept'),
  docBodyIdRow: document.getElementById('docBodyIdRow'),
  docBodyId: document.getElementById('docBodyId'),
  docRoleRepeat: document.getElementById('docRoleRepeat'),
  docCompanyRepeat: document.getElementById('docCompanyRepeat'),
  docEffectiveDate: document.getElementById('docEffectiveDate'),
  docReasonText: document.getElementById('docReasonText'),
  docAdditionalNotesPara: document.getElementById('docAdditionalNotesPara'),
  docSigImg: document.getElementById('docSigImg'),
  docSigPlaceholder: document.getElementById('docSigPlaceholder'),
  docSigName: document.getElementById('docSigName'),
  docSigTitle: document.getElementById('docSigTitle'),
  
  // Actions Toolbar
  btnCopyText: document.getElementById('btnCopyText'),
  btnPrintLetter: document.getElementById('btnPrintLetter'),
  btnDownloadPdf: document.getElementById('btnDownloadPdf'),
  
  // Modals & Toast
  successModal: document.getElementById('successModal'),
  btnCloseSuccessModal: document.getElementById('btnCloseSuccessModal'),
  toastMsg: document.getElementById('toastMsg'),
  toastText: document.getElementById('toastText')
};

// Toast notification helper
function showToast(text, duration = 2400) {
  if (!elements.toastMsg || !elements.toastText) return;
  elements.toastText.textContent = text;
  elements.toastMsg.classList.add('show');
  setTimeout(() => {
    elements.toastMsg.classList.remove('show');
  }, duration);
}

// Router & View Management
function switchView(viewName) {
  state.currentView = viewName;
  if (viewName === 'builder') {
    document.body.classList.add('builder-active');
    document.body.classList.remove('landing-active');
    elements.landingView.classList.remove('active');
    elements.builderView.classList.add('active');
    window.location.hash = '#builder';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initSignatureCanvas();
  } else {
    document.body.classList.remove('builder-active');
    document.body.classList.add('landing-active');
    elements.builderView.classList.remove('active');
    elements.landingView.classList.add('active');
    window.location.hash = '#home';
  }
}

// Mobile View Mode Switcher
function setMobileMode(mode) {
  state.mobileMode = mode;
  if (mode === 'preview') {
    elements.btnMobileShowPreview.classList.add('active');
    elements.btnMobileShowForm.classList.remove('active');
    elements.builderWorkspace.classList.add('show-preview-mode');
    elements.builderWorkspace.classList.remove('show-form-mode');
  } else {
    elements.btnMobileShowForm.classList.add('active');
    elements.btnMobileShowPreview.classList.remove('active');
    elements.builderWorkspace.classList.add('show-form-mode');
    elements.builderWorkspace.classList.remove('show-preview-mode');
  }
}

// Wizard 3-Stage Navigation
function goToStep(stepNumber) {
  if (stepNumber < 1 || stepNumber > 3) return;
  state.currentStep = stepNumber;

  elements.stepSegmentBtns.forEach((btn, idx) => {
    if (idx + 1 === stepNumber) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  elements.stepPanels.forEach((panel, idx) => {
    if (panel) {
      if (idx + 1 === stepNumber) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    }
  });

  // Previous button visibility
  if (stepNumber === 1) {
    elements.btnPrevStep.style.display = 'none';
  } else {
    elements.btnPrevStep.style.display = 'inline-flex';
  }

  // Next button text
  const stepLabels = [
    'Lanjut: Tahap 2 (Waktu & Alasan)',
    'Lanjut: Tahap 3 (Tanda Tangan)',
    'Download PDF (Pas 1 Lembar A4)'
  ];
  elements.btnNextStep.innerHTML = `
    <span>${stepLabels[stepNumber - 1]}</span>
    <svg class="svg-icon" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
  `;

  if (stepNumber === 3) {
    setTimeout(initSignatureCanvas, 100);
  }
}

// Modern Gradient Switcher
function setModernGradient(gradientKey) {
  state.modernGradient = gradientKey;
  const swatchNames = {
    sunset: 'Sunset Rose',
    ocean: 'Ocean Cyan',
    emerald: 'Emerald Mint',
    violet: 'Royal Violet'
  };

  if (elements.activeGradientName) {
    elements.activeGradientName.textContent = swatchNames[gradientKey] || 'Sunset Rose';
  }

  if (elements.gradientSwatchBtns) {
    elements.gradientSwatchBtns.forEach(btn => {
      if (btn.dataset.gradient === gradientKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  if (elements.a4Document) {
    elements.a4Document.classList.remove('gradient-sunset', 'gradient-ocean', 'gradient-emerald', 'gradient-violet');
    elements.a4Document.classList.add(`gradient-${gradientKey}`);
  }
}

// Template Switcher
function setTemplate(templateName) {
  state.currentTemplate = templateName;
  
  elements.templatePillBtns.forEach(btn => {
    if (btn.dataset.template === templateName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (elements.modernGradientOptions) {
    if (templateName === 'modern') {
      elements.modernGradientOptions.classList.remove('hidden');
    } else {
      elements.modernGradientOptions.classList.add('hidden');
    }
  }

  if (elements.a4Document) {
    elements.a4Document.className = `a4-document-sheet template-${templateName} gradient-${state.modernGradient || 'sunset'}`;
  }
}

// Realtime Live Data Binding to A4 Sheet
function renderDocument() {
  elements.docHeaderCompany.textContent = state.companyName || 'NAMA PERUSAHAAN';
  elements.docHeaderAddress.textContent = state.companyAddress || 'Alamat Kantor';
  
  // Logo: ONLY shown if explicitly uploaded
  if (state.hasCustomLogo && state.logoUrl) {
    elements.docLogoImg.src = state.logoUrl;
    elements.docLogoWrapper.style.display = 'block';
  } else {
    elements.docLogoImg.src = '';
    elements.docLogoWrapper.style.display = 'none';
  }

  elements.docLocation.textContent = state.city || 'Jakarta';
  elements.docFormattedDate.textContent = formatDateIndo(state.letterDate) || formatDateIndo(getTodayString());

  // Recipient block
  const managerStr = state.managerName ? state.managerName : 'HRD / Management';
  const posStr = state.recipientPosition ? ` (${state.recipientPosition})` : '';
  elements.docManager.textContent = `${managerStr}${posStr}`;
  elements.docCompany.textContent = state.companyName || 'Perusahaan';
  elements.docAddress.textContent = state.companyAddress || 'Alamat Perusahaan';

  // Body personal details
  elements.docBodyName.textContent = state.fullName || 'Nama Karyawan';
  elements.docBodyRole.textContent = state.jobTitle || 'Jabatan';
  elements.docBodyDept.textContent = state.department || 'Departemen';
  
  if (state.employeeId && state.employeeId.trim()) {
    elements.docBodyId.textContent = state.employeeId;
    elements.docBodyIdRow.style.display = 'flex';
  } else {
    elements.docBodyIdRow.style.display = 'none';
  }

  elements.docRoleRepeat.textContent = state.jobTitle || 'karyawan';
  elements.docCompanyRepeat.textContent = state.companyName || 'perusahaan ini';
  elements.docEffectiveDate.textContent = formatDateIndo(state.lwdDate) || 'tanggal yang disepakati';

  // Reason handling (respecting "Don't include reason" checkbox)
  if (state.hideReason) {
    elements.docReasonText.textContent = '';
    elements.docReasonText.style.display = 'none';
  } else {
    elements.docReasonText.style.display = 'inline';
    let reasonText = state.reason;
    if (state.reason === 'custom' && state.customReason) {
      reasonText = state.customReason;
    }
    elements.docReasonText.textContent = ` sehubungan dengan ${reasonText}`;
  }

  // Additional Notes
  if (state.additionalNotes && state.additionalNotes.trim()) {
    elements.docAdditionalNotesPara.textContent = state.additionalNotes;
    elements.docAdditionalNotesPara.style.display = 'block';
  } else {
    elements.docAdditionalNotesPara.style.display = 'none';
  }

  // Signature
  if (state.hasSignature && state.signatureDataUrl) {
    elements.docSigImg.src = state.signatureDataUrl;
    elements.docSigImg.style.display = 'block';
    elements.docSigPlaceholder.style.display = 'none';
  } else {
    elements.docSigImg.style.display = 'none';
    elements.docSigPlaceholder.style.display = 'flex';
  }

  elements.docSigName.textContent = state.fullName || 'Nama Karyawan';
  elements.docSigTitle.textContent = state.jobTitle || 'Jabatan';
}

// Signature Canvas Engine
let isDrawing = false;
let sigCtx = null;
let lastX = 0;
let lastY = 0;

function initSignatureCanvas() {
  const canvas = elements.signatureCanvas;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;

  sigCtx = canvas.getContext('2d');
  sigCtx.scale(2, 2);
  sigCtx.strokeStyle = '#12234E';
  sigCtx.lineWidth = 2.4;
  sigCtx.lineCap = 'round';
  sigCtx.lineJoin = 'round';

  if (state.signatureDataUrl) {
    const img = new Image();
    img.onload = () => {
      sigCtx.drawImage(img, 0, 0, rect.width, rect.height);
    };
    img.src = state.signatureDataUrl;
  } else {
    drawDefaultSignature();
  }
}

function drawDefaultSignature() {
  if (!sigCtx) return;
  const canvas = elements.signatureCanvas;
  const rect = canvas.getBoundingClientRect();
  sigCtx.clearRect(0, 0, rect.width, rect.height);

  sigCtx.beginPath();
  sigCtx.moveTo(35, 60);
  sigCtx.bezierCurveTo(55, 18, 65, 12, 70, 50);
  sigCtx.bezierCurveTo(75, 90, 80, 10, 90, 46);
  sigCtx.bezierCurveTo(100, 75, 110, 50, 125, 55);
  sigCtx.bezierCurveTo(140, 60, 155, 40, 170, 50);
  sigCtx.bezierCurveTo(185, 60, 195, 32, 210, 38);
  sigCtx.stroke();

  sigCtx.beginPath();
  sigCtx.moveTo(50, 78);
  sigCtx.quadraticCurveTo(110, 92, 220, 52);
  sigCtx.stroke();

  sigCtx.beginPath();
  sigCtx.moveTo(160, 32);
  sigCtx.lineTo(178, 22);
  sigCtx.stroke();

  state.signatureDataUrl = canvas.toDataURL('image/png');
  state.hasSignature = true;
  renderDocument();
}

function startDrawing(e) {
  isDrawing = true;
  const pos = getCanvasPos(e);
  lastX = pos.x;
  lastY = pos.y;
}

function draw(e) {
  if (!isDrawing || !sigCtx) return;
  e.preventDefault();
  const pos = getCanvasPos(e);

  sigCtx.beginPath();
  sigCtx.moveTo(lastX, lastY);
  sigCtx.lineTo(pos.x, pos.y);
  sigCtx.stroke();

  lastX = pos.x;
  lastY = pos.y;

  state.signatureDataUrl = elements.signatureCanvas.toDataURL('image/png');
  state.hasSignature = true;
  renderDocument();
}

function stopDrawing() {
  if (isDrawing) {
    isDrawing = false;
    state.signatureDataUrl = elements.signatureCanvas.toDataURL('image/png');
    state.hasSignature = true;
    renderDocument();
  }
}

function getCanvasPos(e) {
  const canvas = elements.signatureCanvas;
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

// Logo Handling
function setupLogoUploader() {
  if (elements.btnUploadLogo) {
    elements.btnUploadLogo.addEventListener('click', () => {
      elements.logoFileInput.click();
    });
  }

  if (elements.logoFileInput) {
    elements.logoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          state.logoUrl = event.target.result;
          state.hasCustomLogo = true;
          elements.logoThumbImg.src = state.logoUrl;
          elements.logoThumbImg.style.display = 'block';
          if (elements.logoNoThumbIcon) elements.logoNoThumbIcon.style.display = 'none';
          elements.logoFileName.textContent = file.name;
          elements.btnRemoveLogo.style.display = 'inline-flex';
          renderDocument();
          showToast('Logo kop surat berhasil diterapkan.');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (elements.btnRemoveLogo) {
    elements.btnRemoveLogo.addEventListener('click', () => {
      state.hasCustomLogo = false;
      state.logoUrl = null;
      elements.logoFileInput.value = '';
      elements.logoThumbImg.src = '';
      elements.logoThumbImg.style.display = 'none';
      if (elements.logoNoThumbIcon) elements.logoNoThumbIcon.style.display = 'inline';
      elements.logoFileName.textContent = 'Belum ada logo (Opsional)';
      elements.btnRemoveLogo.style.display = 'none';
      renderDocument();
      showToast('Logo dihapus.');
    });
  }
}

// Signature Controls
function setupSignatureControls() {
  const canvas = elements.signatureCanvas;
  if (!canvas) return;
  
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  canvas.addEventListener('touchstart', startDrawing, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', stopDrawing);

  if (elements.btnClearSig) {
    elements.btnClearSig.addEventListener('click', () => {
      if (sigCtx) {
        const rect = canvas.getBoundingClientRect();
        sigCtx.clearRect(0, 0, rect.width, rect.height);
        state.signatureDataUrl = null;
        state.hasSignature = false;
        renderDocument();
        showToast('Canvas tanda tangan dibersihkan.');
      }
    });
  }

  if (elements.btnUseSampleSig) {
    elements.btnUseSampleSig.addEventListener('click', () => {
      drawDefaultSignature();
      showToast('Contoh paraf otomatis diterapkan.');
    });
  }

  if (elements.btnUploadSigFile) {
    elements.btnUploadSigFile.addEventListener('click', () => {
      elements.sigFileInput.click();
    });
  }

  if (elements.sigFileInput) {
    elements.sigFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          state.signatureDataUrl = event.target.result;
          state.hasSignature = true;
          renderDocument();

          if (sigCtx) {
            const img = new Image();
            img.onload = () => {
              const rect = canvas.getBoundingClientRect();
              sigCtx.clearRect(0, 0, rect.width, rect.height);
              sigCtx.drawImage(img, 0, 0, rect.width, rect.height);
            };
            img.src = state.signatureDataUrl;
          }
          showToast('Tanda tangan berhasil diunggah.');
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// Input Event Listeners
function setupFormListeners() {
  const mapInput = (inputElem, stateKey) => {
    if (!inputElem) return;
    inputElem.addEventListener('input', (e) => {
      state[stateKey] = e.target.value;
      renderDocument();
    });
  };

  mapInput(elements.inputFullName, 'fullName');
  mapInput(elements.inputJobTitle, 'jobTitle');
  mapInput(elements.inputDepartment, 'department');
  mapInput(elements.inputEmployeeId, 'employeeId');
  mapInput(elements.inputCity, 'city');
  mapInput(elements.inputCompanyName, 'companyName');
  mapInput(elements.inputManagerName, 'managerName');
  mapInput(elements.inputRecipientPosition, 'recipientPosition');
  mapInput(elements.inputCompanyAddress, 'companyAddress');
  mapInput(elements.inputAdditionalNotes, 'additionalNotes');
  mapInput(elements.inputCustomReason, 'customReason');

  // Dates
  if (elements.inputLetterDate) {
    elements.inputLetterDate.addEventListener('change', (e) => {
      state.letterDate = e.target.value;
      if (state.noticeDays > 0 && state.letterDate) {
        state.lwdDate = addDaysToDateString(state.letterDate, state.noticeDays);
        if (elements.inputLwdDate) elements.inputLwdDate.value = state.lwdDate;
      }
      renderDocument();
    });
  }

  if (elements.inputLwdDate) {
    elements.inputLwdDate.addEventListener('change', (e) => {
      state.lwdDate = e.target.value;
      renderDocument();
    });
  }

  // Notice Presets
  elements.noticePresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.noticePresetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const days = parseInt(btn.dataset.notice, 10);
      state.noticeDays = days;
      if (state.letterDate) {
        state.lwdDate = addDaysToDateString(state.letterDate, days);
        if (elements.inputLwdDate) elements.inputLwdDate.value = state.lwdDate;
        renderDocument();
      }
    });
  });

  // Reason select
  if (elements.selectReason) {
    elements.selectReason.addEventListener('change', (e) => {
      state.reason = e.target.value;
      if (state.reason === 'custom') {
        elements.customReasonGroup.style.display = 'block';
      } else {
        elements.customReasonGroup.style.display = 'none';
      }
      renderDocument();
    });
  }

  // Checkbox: Don't include reason
  if (elements.checkNoReason) {
    elements.checkNoReason.addEventListener('change', (e) => {
      state.hideReason = e.target.checked;
      elements.selectReason.disabled = state.hideReason;
      if (state.hideReason) {
        elements.customReasonGroup.style.display = 'none';
      } else if (state.reason === 'custom') {
        elements.customReasonGroup.style.display = 'block';
      }
      renderDocument();
    });
  }

  // Template Buttons
  elements.templatePillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setTemplate(btn.dataset.template);
    });
  });

  // Modern Gradient Swatches
  if (elements.gradientSwatchBtns) {
    elements.gradientSwatchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        setModernGradient(btn.dataset.gradient);
      });
    });
  }

  elements.templateCardPreviews.forEach(card => {
    card.addEventListener('click', () => {
      const selected = card.dataset.selectTemplate;
      setTemplate(selected);
      switchView('builder');
      showToast(`Gaya ${selected.toUpperCase()} dipilih!`);
    });
  });

  // 3-Stage Segmented Tabs
  elements.stepSegmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(parseInt(btn.dataset.step, 10));
    });
  });

  // Next / Prev Actions
  if (elements.btnNextStep) {
    elements.btnNextStep.addEventListener('click', () => {
      if (state.currentStep < 3) {
        goToStep(state.currentStep + 1);
      } else {
        downloadPdf();
      }
    });
  }

  if (elements.btnPrevStep) {
    elements.btnPrevStep.addEventListener('click', () => {
      if (state.currentStep > 1) {
        goToStep(state.currentStep - 1);
      }
    });
  }

  // Mobile Switcher Buttons
  if (elements.btnMobileShowForm) {
    elements.btnMobileShowForm.addEventListener('click', () => setMobileMode('form'));
  }
  if (elements.btnMobileShowPreview) {
    elements.btnMobileShowPreview.addEventListener('click', () => setMobileMode('preview'));
  }
}

// Sample Data Loader
function loadSampleData() {
  state.fullName = 'Ahmad Rizky Pratama';
  state.jobTitle = 'Senior Product Designer';
  state.department = 'Product & Experience Design';
  state.employeeId = 'EMP-2023-08819';
  state.city = 'Jakarta';
  state.companyName = 'PT Teknologi Maju Sejahtera';
  state.managerName = 'Dewi Anggraini';
  state.recipientPosition = 'Head of People';
  state.companyAddress = 'SCBD Lot 8, Jakarta Selatan';
  state.letterDate = getTodayString();
  state.noticeDays = 30;
  state.lwdDate = addDaysToDateString(state.letterDate, 30);
  state.reason = 'melanjutkan jenjang karier dan tantangan profesional baru';
  state.hideReason = false;
  state.additionalNotes = 'Saya berkomitmen penuh untuk menyelesaikan seluruh tanggung jawab serta membantu proses transisi dan serah terima (handover) pekerjaan sebelum hari kerja terakhir saya.';
  state.logoUrl = null;
  state.hasCustomLogo = false;
  state.modernGradient = 'sunset';
  
  if (elements.logoThumbImg) {
    elements.logoThumbImg.src = '';
    elements.logoThumbImg.style.display = 'none';
  }
  if (elements.logoNoThumbIcon) elements.logoNoThumbIcon.style.display = 'inline';
  if (elements.logoFileName) elements.logoFileName.textContent = 'Belum ada logo (Opsional)';
  if (elements.btnRemoveLogo) elements.btnRemoveLogo.style.display = 'none';

  // Sync inputs
  if (elements.inputFullName) elements.inputFullName.value = state.fullName;
  if (elements.inputJobTitle) elements.inputJobTitle.value = state.jobTitle;
  if (elements.inputDepartment) elements.inputDepartment.value = state.department;
  if (elements.inputEmployeeId) elements.inputEmployeeId.value = state.employeeId;
  if (elements.inputCity) elements.inputCity.value = state.city;
  if (elements.inputCompanyName) elements.inputCompanyName.value = state.companyName;
  if (elements.inputManagerName) elements.inputManagerName.value = state.managerName;
  if (elements.inputRecipientPosition) elements.inputRecipientPosition.value = state.recipientPosition;
  if (elements.inputCompanyAddress) elements.inputCompanyAddress.value = state.companyAddress;
  if (elements.inputLetterDate) elements.inputLetterDate.value = state.letterDate;
  if (elements.inputLwdDate) elements.inputLwdDate.value = state.lwdDate;
  if (elements.inputAdditionalNotes) elements.inputAdditionalNotes.value = state.additionalNotes;
  if (elements.selectReason) elements.selectReason.value = state.reason;
  if (elements.checkNoReason) {
    elements.checkNoReason.checked = false;
    elements.selectReason.disabled = false;
  }
  if (elements.customReasonGroup) elements.customReasonGroup.style.display = 'none';

  setModernGradient('sunset');
  setTemplate('modern');
  renderDocument();
  drawDefaultSignature();
  showToast('Contoh data lengkap berhasil dimuat.');
}

// Save draft to localStorage
function saveDraft() {
  try {
    localStorage.setItem('sorryye_draft_v3', JSON.stringify(state));
    showToast('Draft disimpan di browser!');
  } catch(e) {
    showToast('Gagal menyimpan draft.');
  }
}

function loadDraftIfAvailable() {
  try {
    const saved = localStorage.getItem('sorryye_draft_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
      
      if (elements.inputFullName) elements.inputFullName.value = state.fullName || '';
      if (elements.inputJobTitle) elements.inputJobTitle.value = state.jobTitle || '';
      if (elements.inputDepartment) elements.inputDepartment.value = state.department || '';
      if (elements.inputEmployeeId) elements.inputEmployeeId.value = state.employeeId || '';
      if (elements.inputCity) elements.inputCity.value = state.city || '';
      if (elements.inputCompanyName) elements.inputCompanyName.value = state.companyName || '';
      if (elements.inputManagerName) elements.inputManagerName.value = state.managerName || '';
      if (elements.inputRecipientPosition) elements.inputRecipientPosition.value = state.recipientPosition || '';
      if (elements.inputCompanyAddress) elements.inputCompanyAddress.value = state.companyAddress || '';
      if (elements.inputLetterDate) elements.inputLetterDate.value = state.letterDate || getTodayString();
      if (elements.inputLwdDate) elements.inputLwdDate.value = state.lwdDate || addDaysToDateString(getTodayString(), 30);
      if (elements.inputAdditionalNotes) elements.inputAdditionalNotes.value = state.additionalNotes || '';
      if (elements.selectReason) elements.selectReason.value = state.reason || '';
      if (elements.checkNoReason) elements.checkNoReason.checked = !!state.hideReason;
      
      if (state.logoUrl === 'assets/logo.png') {
        state.logoUrl = null;
        state.hasCustomLogo = false;
      }
      
      setModernGradient(state.modernGradient || 'sunset');
      setTemplate(state.currentTemplate || 'modern');
      renderDocument();
    } else {
      loadSampleData();
    }
  } catch(e) {
    loadSampleData();
  }
}

// Copy Plaintext Letter
function copyLetterText() {
  const dateFormatted = formatDateIndo(state.letterDate) || formatDateIndo(getTodayString());
  const effectiveFormatted = formatDateIndo(state.lwdDate) || 'tanggal yang ditentukan';
  const managerStr = state.managerName ? `${state.managerName}${state.recipientPosition ? ` (${state.recipientPosition})` : ''}` : 'HRD / Management';
  
  let reasonPart = '';
  if (!state.hideReason) {
    const reasonText = state.reason === 'custom' ? state.customReason : state.reason;
    reasonPart = ` sehubungan dengan ${reasonText}`;
  }

  const text = `${state.city || 'Jakarta'}, ${dateFormatted}

Kepada Yth.
${managerStr}
${state.companyName || 'Perusahaan'}
${state.companyAddress || ''}

Perihal: Surat Permohonan Pengunduran Diri (Resignation)

Dengan hormat,

Melalui surat ini, saya yang bertanda tangan di bawah ini:
Nama        : ${state.fullName}
Jabatan     : ${state.jobTitle}
Departemen  : ${state.department}
${state.employeeId ? `NIK / ID    : ${state.employeeId}\n` : ''}
Bermaksud untuk mengajukan permohonan pengunduran diri dari posisi ${state.jobTitle} di ${state.companyName}, terhitung efektif mulai tanggal ${effectiveFormatted}${reasonPart}.

Saya mengucapkan terima kasih yang sebesar-besarnya atas kesempatan, bimbingan, serta pengalaman berharga yang telah diberikan kepada saya selama bekerja di perusahaan ini. Saya juga memohon maaf yang tulus atas segala kekhilafan dan kekurangan selama saya menjalankan tugas.

${state.additionalNotes ? `${state.additionalNotes}\n\n` : ''}Demikian surat pengunduran diri ini saya sampaikan dengan penuh kesadaran dan tanpa paksaan dari pihak mana pun. Atas perhatian dan pengertian Bapak/Ibu, saya ucapkan terima kasih.

Hormat saya,


${state.fullName}
${state.jobTitle}`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('Teks surat berhasil disalin.');
  }).catch(() => {
    showToast('Gagal menyalin teks.');
  });
}

// Export Strict 1-Page A4 PDF
async function downloadPdf() {
  const element = elements.a4Document;
  const sanitizedName = (state.fullName || 'Karyawan').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Surat_Resign_${sanitizedName}.pdf`;

  showToast('Memproses file PDF 1 lembar A4...', 1800);

  const opt = {
    margin: [6, 6, 6, 6],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      letterRendering: true,
      windowWidth: 1200
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  try {
    await html2pdf().set(opt).from(element).save();

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E52F70', '#FF9F32', '#29B9D0', '#FFE4EC']
      });
    }

    if (elements.successModal) {
      elements.successModal.classList.add('active');
    }
  } catch(err) {
    console.error('PDF Generation Error:', err);
    window.print();
  }
}

// Global Event Initialization
function initApp() {
  setupFormListeners();
  setupLogoUploader();
  setupSignatureControls();

  const builderTriggers = [
    elements.btnNavCreate,
    elements.btnHeroCreate,
    elements.btnHeroQuickStart,
    elements.btnHowToBuilder
  ];
  builderTriggers.forEach(btn => {
    if (btn) btn.addEventListener('click', () => switchView('builder'));
  });

  if (elements.btnBackToHome) {
    elements.btnBackToHome.addEventListener('click', () => switchView('landing'));
  }
  if (elements.btnLoadSampleData) {
    elements.btnLoadSampleData.addEventListener('click', loadSampleData);
  }
  if (elements.btnSaveDraft) {
    elements.btnSaveDraft.addEventListener('click', saveDraft);
  }

  if (elements.btnCopyText) {
    elements.btnCopyText.addEventListener('click', copyLetterText);
  }
  if (elements.btnPrintLetter) {
    elements.btnPrintLetter.addEventListener('click', () => window.print());
  }
  if (elements.btnDownloadPdf) {
    elements.btnDownloadPdf.addEventListener('click', downloadPdf);
  }
  if (elements.btnCloseSuccessModal) {
    elements.btnCloseSuccessModal.addEventListener('click', () => {
      elements.successModal.classList.remove('active');
    });
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#builder') {
      switchView('builder');
    } else {
      switchView('landing');
    }
  });

  if (window.location.hash === '#builder') {
    switchView('builder');
  } else {
    switchView('landing');
  }

  loadDraftIfAvailable();
  
  if (!state.letterDate) {
    state.letterDate = getTodayString();
    if (elements.inputLetterDate) elements.inputLetterDate.value = state.letterDate;
    state.lwdDate = addDaysToDateString(state.letterDate, 30);
    if (elements.inputLwdDate) elements.inputLwdDate.value = state.lwdDate;
  }
  
  renderDocument();

  // Ensure hero video loops and autoplays smoothly
  const heroVideo = document.getElementById('heroFullVideo') || document.getElementById('heroLoopVideo');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.setAttribute('muted', '');
    heroVideo.setAttribute('playsinline', '');

    const tryPlayVideo = () => {
      const p = heroVideo.play();
      if (p !== undefined) {
        p.catch(() => {
          // If browser policy blocks autoplay, play on first user interaction
          const resumeOnInteract = () => {
            heroVideo.play().catch(() => {});
            window.removeEventListener('click', resumeOnInteract);
            window.removeEventListener('touchstart', resumeOnInteract);
          };
          window.addEventListener('click', resumeOnInteract, { once: true });
          window.addEventListener('touchstart', resumeOnInteract, { once: true });
        });
      }
    };

    if (heroVideo.readyState >= 2) {
      tryPlayVideo();
    } else {
      heroVideo.addEventListener('loadeddata', tryPlayVideo, { once: true });
      heroVideo.addEventListener('canplay', tryPlayVideo, { once: true });
    }
  }
}

document.addEventListener('DOMContentLoaded', initApp);

