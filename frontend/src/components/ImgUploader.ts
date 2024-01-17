import axios from "axios";


const ImgUploader = async (imgFile : File | undefined ) => {
    try{
      if(imgFile === undefined) return
      const formData = new FormData();
      formData.append("file", imgFile)
      const options = {
        method: 'POST',
        data: formData,
        url: "https://personal-blog-backend-deploy.vercel.app/api/upload"
      };
      const res = await axios(options);
      return res.data

    }catch(err){
      console.log(err)
    }
}

export default ImgUploader
