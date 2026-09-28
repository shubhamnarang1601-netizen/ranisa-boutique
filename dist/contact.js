const selectedStyle = new URLSearchParams(location.search).get('style');
if (selectedStyle) document.querySelector('[name="style"]').value = selectedStyle;

const form = document.getElementById('enquiryForm');
const imagesInput = document.getElementById('referenceImages');
const previews = document.getElementById('imagePreviews');
const imageError = document.getElementById('imageError');
const handoff = document.getElementById('whatsappHandoff');
const openChat = document.getElementById('openWhatsApp');
const shareImages = document.getElementById('shareImages');
const submitButton = form.querySelector('[type="submit"]');
const submissionStatus = document.getElementById('submissionStatus');
const API = 'https://bhfmhzwcogfbnzpdrzih.supabase.co/functions/v1/ranisa-submit-enquiry';
const PUBLIC_KEY = 'sb_publishable_POe4-O4LRqn7I-4D_Rz8sw_mxuwHFgp';
let previewUrls = [];

function selectedImages() {
  return Array.from(imagesInput.files || []);
}

function validateImages(files) {
  if (files.length > 5) return 'Choose up to 5 images.';
  if (files.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) return 'Choose JPG, PNG or WebP images only.';
  if (files.some(file => file.size > 10 * 1024 * 1024)) return 'Each image must be 10 MB or smaller.';
  if (files.reduce((total, file) => total + file.size, 0) > 20 * 1024 * 1024) return 'Images must be 20 MB or smaller in total.';
  return '';
}

imagesInput.addEventListener('change', () => {
  submitButton.disabled = false;
  submissionStatus.textContent = '';
  previewUrls.forEach(URL.revokeObjectURL);
  previewUrls = [];
  previews.replaceChildren();
  const files = selectedImages();
  imageError.textContent = validateImages(files);
  handoff.hidden = true;
  if (imageError.textContent) return;
  files.forEach(file => {
    const url = URL.createObjectURL(file);
    previewUrls.push(url);
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = url;
    img.alt = `Selected reference: ${file.name}`;
    const caption = document.createElement('figcaption');
    caption.textContent = file.name;
    figure.append(img, caption);
    previews.append(figure);
  });
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  const files = selectedImages();
  imageError.textContent = validateImages(files);
  if (imageError.textContent) return;
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const style = String(data.get('style') || '').trim();
  const details = String(data.get('message') || '').trim();
  if (!name || !style || !details) return;
  if (name.length > 120 || style.length > 160 || details.length > 3000) {
    submissionStatus.textContent = 'Please shorten your name, style or description.';
    return;
  }
  submissionStatus.textContent = 'Saving your enquiry and images…';
  submitButton.disabled = true;
  const request = new FormData();
  request.append('name', name);
  request.append('style', style);
  request.append('message', details);
  request.append('company_website', String(data.get('company_website') || ''));
  files.forEach(file => request.append('images', file));
  let enquiryId;
  try {
    const response = await fetch(API, { method: 'POST', headers: { apikey: PUBLIC_KEY }, body: request });
    const result = await response.json();
    if (!response.ok || !result.enquiryId) throw new Error(result.error || 'Please try again.');
    enquiryId = result.enquiryId;
  } catch (error) {
    submissionStatus.textContent = error.message || 'Unable to save your enquiry. Please try again.';
    submitButton.disabled = false;
    return;
  }
  submissionStatus.textContent = `Enquiry saved. Reference: ${enquiryId}. Continue in WhatsApp to send your message.`;
  const message = `Hello Ranisa Boutique, I would like to discuss a customised order.\nReference: ${enquiryId}\nName: ${name}\nStyle: ${style}\nDetails: ${details}` +
    (files.length ? `\n\nI uploaded ${files.length} reference image${files.length === 1 ? '' : 's'} to my enquiry.` : '');
  const chatUrl = 'https://wa.me/919004517938?text=' + encodeURIComponent(message);
  if (!files.length) {
    window.location.assign(chatUrl);
    return;
  }
  openChat.href = chatUrl;
  shareImages.hidden = !(navigator.canShare && navigator.share && navigator.canShare({ files }));
  shareImages.onclick = async () => {
    try {
      await navigator.share({ files, text: message });
    } catch (error) {
      if (error.name !== 'AbortError') imageError.textContent = 'Sharing was unavailable. Open the WhatsApp chat and attach your images there.';
    }
  };
  handoff.hidden = false;
  handoff.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

form.addEventListener('input', event => {
  if (event.target !== imagesInput) {
    handoff.hidden = true;
    submitButton.disabled = false;
    submissionStatus.textContent = '';
  }
});
window.addEventListener('pagehide', () => previewUrls.forEach(URL.revokeObjectURL));
