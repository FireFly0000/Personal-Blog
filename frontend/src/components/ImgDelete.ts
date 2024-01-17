import axios from "axios";


const ImgDelete = async (imgNamePath : String | undefined ) => {
    try{
        if (imgNamePath === undefined) return
        const formData = new FormData();
        const imgNameArray = imgNamePath.split('/')
        const TempImgName = imgNameArray[imgNameArray.length-1]
        const imgName = TempImgName.slice(0,-4)
        formData.append("img_name", imgName)
        const options = {
          method: 'POST',
          data: formData,
          url: "https://personal-blog-backend-deploy.vercel.app/api/deleteImg"
        };
        const res = await axios(options);
        return res
  
      }catch(err){
        console.log(err)
    }
}

export default ImgDelete
