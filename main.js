const shirtImages = {
  branca: "assets/img/moldes_camisas/camisa_branca.png",
  preta: "assets/img/moldes_camisas/camisa_preta.png",
};

const stampImages = [
  "assets/img/moldes_estampas/estampa1.png",
  "assets/img/moldes_estampas/estampa2.png",
];

const canvas = new fabric.Canvas("shirtCanvas", {
  preserveObjectStacking: true,
  selection: true,
});

function deleteObject(_eventData, transform) {
  const target = transform.target;
  if (!target || target === shirtObject) {
    return false;
  }

  canvas.remove(target);
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  return true;
}

function renderDeleteIcon(ctx, left, top, _styleOverride, fabricObject) {
  if (fabricObject === shirtObject) {
    return;
  }

  const size = 22;
  const radius = size / 2;

  ctx.save();
  ctx.fillStyle = "#f24b4b";
  ctx.beginPath();
  ctx.arc(left, top, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(left - 5, top - 5);
  ctx.lineTo(left + 5, top + 5);
  ctx.moveTo(left + 5, top - 5);
  ctx.lineTo(left - 5, top + 5);
  ctx.stroke();
  ctx.restore();
}

fabric.Object.prototype.controls.deleteControl = new fabric.Control({
  x: 0.5,
  y: -0.5,
  offsetX: 12,
  offsetY: -12,
  cursorStyle: "pointer",
  mouseUpHandler: deleteObject,
  render: renderDeleteIcon,
  cornerSize: 22,
});

let currentShirt = null;
let shirtObject = null;

function fitImageToCanvas(img, targetWidth, targetHeight) {
  const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
  img.scale(scale);
  img.set({
    left: (targetWidth - img.getScaledWidth()) / 2,
    top: (targetHeight - img.getScaledHeight()) / 2,
  });
}

function setShirt(type) {
  fabric.Image.fromURL(shirtImages[type], (img) => {
    currentShirt = type;

    fitImageToCanvas(img, canvas.getWidth(), canvas.getHeight());
    img.set({
      selectable: false,
      evented: false,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
    });

    if (shirtObject) {
      canvas.remove(shirtObject);
    }

    shirtObject = img;
    canvas.add(shirtObject);
    shirtObject.sendToBack();
    canvas.requestRenderAll();
  });
}

function addStamp(stampUrl) {
  fabric.Image.fromURL(stampUrl, (img) => {
    const maxSize = 180;
    const scale = Math.min(maxSize / img.width, maxSize / img.height);
    img.scale(scale);
    img.set({
      left: canvas.getWidth() / 2 - img.getScaledWidth() / 2,
      top: canvas.getHeight() / 2 - img.getScaledHeight() / 2,
      cornerStyle: "circle",
      transparentCorners: false,
      cornerColor: "#4f8cff",
      borderColor: "#4f8cff",
    });

    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();
  });
}

function removeSelected() {
  const active = canvas.getActiveObject();
  if (!active) {
    return;
  }
  if (active === shirtObject) {
    return;
  }

  canvas.remove(active);
  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

function createStampList() {
  const container = document.getElementById("stampsList");
  stampImages.forEach((url) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "stamp-item";
    button.title = "Adicionar estampa";
    button.innerHTML = `<img src="${url}" alt="Estampa">`;
    button.addEventListener("click", () => addStamp(url));
    container.appendChild(button);
  });
}

function downloadDesign() {
  const previousActiveObject = canvas.getActiveObject();
  if (previousActiveObject) {
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  const restoreSelection = () => {
    if (previousActiveObject) {
      canvas.setActiveObject(previousActiveObject);
      canvas.requestRenderAll();
    }
  };

  const fileName = `camisa_personalizada_${currentShirt || "branca"}.png`;

  try {
    const dataUrl = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
      enableRetinaScaling: true,
    });

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    restoreSelection();
  } catch (_error) {
    restoreSelection();
    const hint =
      window.location.protocol === "file:"
        ? " Abra o projeto por um servidor local (ex.: Live Server), depois tente novamente."
        : "";
    alert(`Nao foi possivel gerar o download da personalizacao.${hint}`);
  }
}

document.getElementById("btnBranca").addEventListener("click", () => setShirt("branca"));
document.getElementById("btnPreta").addEventListener("click", () => setShirt("preta"));
document.getElementById("btnDownload").addEventListener("click", downloadDesign);

window.addEventListener("keydown", (event) => {
  if (event.key === "Delete" || event.key === "Backspace") {
    const active = canvas.getActiveObject();
    if (active) {
      event.preventDefault();
      removeSelected();
    }
  }
});

createStampList();
setShirt("branca");
