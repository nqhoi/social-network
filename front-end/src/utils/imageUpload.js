export const checkImage = (file) => {
  let err = "";
  if (!file) return (err = "File dose not exist.");

  if (file.size > 1024 * 1024) err = "The largest file size is 1mb";

  if (file.type !== "image/jpeg" && file.type !== "image/png")
    err = "Image format is incorrect";

  return err;
};

export const imageUpLoad =  async(images) => {
    let imgArr = [];
    for(const item of images){
        const formData = new FormData()

        if(item.camera){
            formData.append("file", item.camera)
        }else{
            formData.append("file", item)
        }
        
        formData.append("upload_preset", "ubbuzfbu")
        formData.append("cloud_name", "nqh34200")

        const res = await fetch("https://api.cloudinary.com/v1_1/nqh34200/upload", {
            method: "POST",
            body: formData
        })
        
        const data = await res.json()
        imgArr.push({public_id: data.public_id, url: data.secure_url})
    }
    return imgArr;
}