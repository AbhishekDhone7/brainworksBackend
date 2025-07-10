import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import { getCroppedImg } from "./cropUtils";
import "./CropImage.css";

const CropImage = ({ file, onCropDone, onCancel }) => {
  const [imageSrc, setImageSrc] = useState(URL.createObjectURL(file));
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropDone(croppedImageBlob);
  };

  return (
    <div className="crop-container">
      <div className="cropper">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          cropShape="rect" // or "round" if you want circular crop
          showGrid={true} // helpful for alignment
          style={{
            containerStyle: {
              touchAction: "none", // ensures drag works on all devices
            },
          }}
        />
      </div>
      <div className="controls">
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, zoom) => setZoom(zoom)}
        />
        <button onClick={handleDone}>Done</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default CropImage;
