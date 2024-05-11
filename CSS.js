import { useState,useEffect } from "react";
import axios from "axios";
 const koneksiMahasiswa = axios.create({
   baseURL: "http://127.0.0.1:5000/api/mahasiswa"
});
export default function FormMahasiswa() {
    const [statenama, setNama] = useState("");
    const [statenim, setNim] = useState("");
    const [mahasiswa, setMahasiswa] =  useState(null);
       useEffect(() => {
      async function getMahasiswa() {
        const response = await koneksiMahasiswa.get("/").then(function (axiosResponse) {         setMahasiswa(axiosResponse.data.data);
         })
         .catch(function (error) {
          alert('error from mahasiswa in api mahasiswa: '+error);
         });;
          }
      getMahasiswa();
    }, []);
if(mahasiswa==null){
return(
  <div>
    waiting...
  </div>
)
}else{
  return (

    <div>
      <form >
        {/* onSubmit={handleSubmit}> */}
          <table border={0}>
            <tbody>
            <tr>
            <td> <label> nim:</label></td>
            <td><input type="text" id="nim"  value={statenim} />
              {/* onChange={handleOnchangeNim}  /> */}
              </td>
        </tr>
        <tr>
            <td>  <label> nama:</label></td>
            <td><input type="text" id="nama"  value={statenama}
              // onChange={(e) => setNama(e.target.value)}
               /></td>
        </tr>
        <tr>
            <td>  <label> Foto:</label></td>
            <td>   <input
                    type="file" name="foto"/>  </td>
        </tr>
        <tr>
            <td>  <label> Tanggal Lahir:</label></td>
            <td>  <input type="date" value="2018-07-22"
           min="1970-01-01" max="2025-12-31"/>
     </td>
        </tr>
        <tr>
            <td>  <label> alamat:</label></td>
            <td><textarea  id="address" style={{resize: "none"}} /></td>
        </tr>
            </tbody>
          </table>
          <input type="submit" />
                  </form>  

                  <br/>
        <br/>
        <br/>

    Tabel Mahasiswa hasil get Local Nodejs
           <table border={1}>
            <thead>
                <tr><td>Nim</td>
                <td>Nama</td></tr>
            </thead>
            <tbody>
            {mahasiswa.map((mhs) =>
                <tr>
                    <td>{mahasiswa[0].nim}</td>
                    <td>{mahasiswa[0].nama}</td>           <td><button>edit</button>&nbsp;<button>delete</button></td>
                </tr>
           )}    
                   </tbody>
          </table>  
          </div>
        )
}
 
  }
   

