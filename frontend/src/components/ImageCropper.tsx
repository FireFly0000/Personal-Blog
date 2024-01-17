import 'react-image-crop/dist/ReactCrop.css'
import ReactCrop, { makeAspectCrop, type Crop, centerCrop, convertToPixelCrop } from 'react-image-crop'
import { useState, useRef, useEffect} from 'react';
import { useAuth } from '../context/authContext'
import ImgUploader from '../components/ImgUploader';
import ImgDelete from './ImgDelete';
import CroppingTool from './CroppingTool';
import axios from 'axios'

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 200;

interface Props {
    onClose: () => void;
}

const ImageCropper = ({onClose}: Props) => {

    const {currentUser, access_token, fetchCurrentUserInfo} = useAuth()

    const [crop, setCrop] = useState<Crop>()
    const [imgPreview, setImgPreview] = useState("")
    const [imgFile, setImgFile] = useState<File | undefined>(undefined);
    const [ imgName, setImgName] = useState('')
    const imgRef = useRef<HTMLImageElement | null>(null);
    const imgInputRef = useRef<HTMLInputElement | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [ErrorMessage, setErrorMessage] = useState("");

    useEffect( () => {
        const updateAvatar = async () =>{
            if (imgFile) {
                const imgURL = await ImgUploader(imgFile);
                const inputs = {
                    img: imgURL,
                    access_token: access_token
                }
                try{
                    await ImgDelete(currentUser.img)
                    await axios.put('users/updateUserImg', inputs)
                    await fetchCurrentUserInfo()
                }
                catch(err: any){
                    console.log(err)
                    setErrorMessage(err.response.data)
                }
            }
        }

        updateAvatar()
    }, [imgFile]);

    const onImageLoad = async (e: React.FormEvent<HTMLImageElement>) =>{
        const { width, height} = e.currentTarget;
        const widthPercent = (MIN_DIMENSION/width) * 100

        const crop = makeAspectCrop(
          {
            unit: "%",
            width: widthPercent,
          },
          ASPECT_RATIO,
          width,
          height,
        );
        const centeredCrop = centerCrop(crop, width, height)
        await setCrop(centeredCrop);
    }
    

    const ChangeImage = async (e: React.FormEvent<HTMLInputElement>) =>{
        const target = e.target as HTMLInputElement & {
          files: FileList;
        }
    
        const file = target.files?.[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          const imageElement = new Image();
          const imageUrl = reader.result?.toString() || "";
          imageElement.src = imageUrl;
    
          imageElement.addEventListener("load", (e) => {
            if (ErrorMessage) setErrorMessage("");
            const { naturalWidth, naturalHeight } = e.currentTarget as HTMLImageElement;
            if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
              setErrorMessage("Image must be at least 200 x 200 pixels.");
              return setImgPreview("")
            }

            setImgName(file.name)
            setImgPreview(imageUrl)
          })
        })
        reader.readAsDataURL(file);
    
    }

    const cancelCropperHandler = async () =>{
        setImgPreview("")
        setImgFile(undefined)
        if (imgRef.current) {
          imgRef.current.src = ''
        }
        if(imgInputRef.current){
          imgInputRef.current.value = ''
        }
    
        onClose()
        setErrorMessage("")
    }

    const uploadHandler = async () =>{
        if(crop === undefined ||  imgRef?.current?.width === undefined ||  imgRef?.current?.height === undefined) return
        CroppingTool(                
        imgRef?.current, // HTMLImageElement
        previewCanvasRef?.current, // HTMLCanvasElement
        convertToPixelCrop(
          crop,
          imgRef.current.width, 
          imgRef.current.height 
        ))
        if (previewCanvasRef.current instanceof HTMLCanvasElement) {
            previewCanvasRef.current.toBlob(async (blob) => {
                if (blob) {
                    const file = new File([blob], imgName, { type: 'image/*' });
                    setImgFile(file)
                }
            }, 'image/*');
        }
        onClose()
    }

    return (
    <div>
        <div className='img-input'>
            <input style={{display:"none"}} type= "file" id='file' name='file' accept='image/*' onChange={ChangeImage} ref={imgInputRef}/>
            <label className='modal-buttons' htmlFor='file'>Choose Image</label>
            <label className='modal-label'>{imgName != "" ? <>{imgName}</> : <>No Image Uploaded</>}</label>
            <div>    
                <button className='modal-buttons' onClick={cancelCropperHandler}>Cancel</button>
                {imgPreview != "" && <button className='modal-buttons' onClick={uploadHandler}> Upload </button> }
            </div>
            {ErrorMessage != "" && <p>{ErrorMessage}</p>}
        </div>
        {imgPreview != "" &&
        <div className='cropper-container'>
            <ReactCrop crop={crop} 
            circularCrop keepSelection 
            aspect={ASPECT_RATIO} minWidth={MIN_DIMENSION}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            onComplete={(crop) => setCrop(crop)}>
                <img src={imgPreview} style={{ maxHeight: "70vh"}} alt='Upload' ref={imgRef} onLoad={onImageLoad}/>
            </ReactCrop>
        </div>
        }
        {crop && (
            <canvas
            ref={previewCanvasRef}
            className="mt-4"
            style={{
                display: 'none',
                border: "1px solid black",
                objectFit: "contain",
                width: 150,
                height: 150,
            }}
            />
        )}
    </div>
  )
}

export default ImageCropper
