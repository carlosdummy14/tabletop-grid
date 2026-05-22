export async function startCamera(video) {

  try {

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: {
          ideal: 'environment'
        }
      },
      audio: false
    });

    video.srcObject = stream;

  } catch (error) {

    alert('No se pudo abrir la cámara');

    console.error(error);
  }
}