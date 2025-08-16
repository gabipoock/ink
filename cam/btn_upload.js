const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
    const ALLOWED_TYPES = ['image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif']; // include common types

    // Elements
    const fileInput = document.getElementById('fileInput');
    const chooseBtn = document.getElementById('chooseBtn');
    const clearBtn = document.getElementById('clearBtn');
    const uploadArea = document.getElementById('uploadArea');
    const preview = document.getElementById('preview');
    const tpl = document.getElementById('previewTpl');

    // state
    let files = [];

    // Helpers
    function formatBytes(bytes){
      if(bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B','KB','MB','GB'];
      const i = Math.floor(Math.log(bytes)/Math.log(k));
      return parseFloat((bytes/Math.pow(k,i)).toFixed(2)) + ' ' + sizes[i];
    }

    function isImageType(file){
      return file.type.startsWith('image/') || ALLOWED_TYPES.includes(file.type);
    }

    function showError(message){
      // simple alert for demo; could be improved with a toast
      alert(message);
    }

    // Render previews
    function renderPreviews(){
      preview.innerHTML = '';
      files.forEach((file, idx) => {
        const clone = tpl.content.cloneNode(true);
        const img = clone.querySelector('img');
        const nameSpan = clone.querySelector('.name');
        const removeBtn = clone.querySelector('.remove');

        nameSpan.textContent = file.name + ' · ' + formatBytes(file.size);
        // create object URL
        const url = URL.createObjectURL(file);
        img.src = url;
        img.alt = file.name;

        removeBtn.addEventListener('click', () => {
          URL.revokeObjectURL(url);
          files.splice(idx,1);
          renderPreviews();
        });

        preview.appendChild(clone);
      });
    }

    // Add files (from input or drop)
    function addFilesList(list){
      const arr = Array.from(list);
      for(const f of arr){
        if(!isImageType(f)){
          showError('Tipo não suportado: ' + f.name);
          continue;
        }
        if(f.size > MAX_FILE_SIZE){
          showError('Arquivo muito grande (máx 8 MB): ' + f.name);
          continue;
        }
        files.push(f);
      }
      renderPreviews();
    }

    // Events
    chooseBtn.addEventListener('click', () => fileInput.click());

    clearBtn.addEventListener('click', () => {
      files = [];
      fileInput.value = null;
      renderPreviews();
    });

    fileInput.addEventListener('change', (e) => {
      addFilesList(e.target.files);
    });

    // Drag & drop
    ;['dragenter','dragover'].forEach(ev => {
      uploadArea.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('dragover');
      });
    });

    ;['dragleave','dragend','drop'].forEach(ev => {
      uploadArea.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragover');
      });
    });

    uploadArea.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if(dt && dt.files){
        addFilesList(dt.files);
      }
    });

    // keyboard support: press Enter to open file picker
    uploadArea.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        fileInput.click();
      }
    });

    // Accessibility: support paste (ctrl+v) images from clipboard
    document.addEventListener('paste', (e) => {
      const items = e.clipboardData && e.clipboardData.items;
      if(!items) return;
      const imgs = [];
      for(const it of items){
        if(it.type && it.type.startsWith('image/')){
          const blob = it.getAsFile();
          if(blob) imgs.push(blob);
        }
      }
      if(imgs.length) addFilesList(imgs);
    });

    // Mobile note: drag & drop doesn't work well on some mobile browsers — use the button to select images

    // Optional: example function to upload files to server via fetch
    async function uploadToServer(url){
      if(files.length === 0) return showError('Nenhuma imagem selecionada');
      const fd = new FormData();
      files.forEach((f,i) => fd.append('images[]', f));
      try{
        const res = await fetch(url, { method: 'POST', body: fd });
        if(!res.ok) throw new Error('Erro no upload');
        const data = await res.json();
        return data;
      }catch(err){
        showError('Falha ao enviar: ' + err.message);
      }
    }

    // Expose to window for demo/testing
    window._uploader = { addFilesList, files, uploadToServer };