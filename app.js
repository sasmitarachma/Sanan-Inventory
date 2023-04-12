import  express  from "express";

// AJV JSON Validator
import Ajv from "ajv"
const ajv = new Ajv()

// File System Node
import fs from "fs"

// Express File Upload
import fileUpload from "express-fileupload";

// Path Node
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express()
app.use(express.json())

// Use the express-fileupload middleware
app.use(fileUpload());


// View Engine*
app.set("view engine","ejs")

// Allow URL Encoded
app.use(express.urlencoded({extended:true}))



// Static Files for Images
app.use(express.static('public'))
// app.use(express.static('views'))

// QR Generator
import qr, { toDataURL } from "qrcode"

// Import DB
import { createBarangBaru, getAllBarang, getBarangKeluarDate, getBarangMasuk, getBarangScan, getExpired, insertGudang, outGudang, updatePathBarang } from "./database.js";

//faat
import { getTampilBarang, getTampilBarangMasuk, getTampilGudang, getTampilBarangKeluar,
    getBarangID, getBarangIDMasuk, getGudangID, getTampilLaporan, 
    updateBarang, updateBarangMasuk, updateGudang} from "./database.js";

// 
app.get("/testing", async (req,res)=>{
    let nama = "Dewa"
    res.render("testing",{nama})
})

// Reroute Home
app.get("/", async (req,res)=>{
    res.redirect("/dashboard")
})

// Dashboard
app.get("/dashboard", async (req,res)=>{
    const datas = await getTampilGudang()
    console.log(datas)
    res.render("index",{datas})
})

app.get("/data", async (req,res)=>{
   res.json(await getAllBarang())
})

// Buat Barang Baru
app.get("/tambah-produk", async (req,res)=>{
    res.render("tambah-produk")
})

app.post("/tambah-produk", async (req,res)=>{
    const {namaBarang,kategori,harga} = req.body
    const {barangImg} = req.files


    let barang = await createBarangBaru(namaBarang,kategori,harga,null,null)
    if(!barangImg) return res.send("No Image !")

    barangImg.name = barang.insertId + ".png"
    // console.log(barangImg.name)

    let barangPath = `barang-img/${barangImg.name}` 

    barangImg.mv(__dirname+`/public/${barangPath}/`)
    
    // console.log(barang)
    let content = `{"id":"${barang.insertId}","nama_barang":"${namaBarang}","kategori":"${kategori}","harga":"${harga}"}`
    if (content.length === 0) res.send("Empty Data!");

    let qrPath = `qrcode-img/${barang.insertId}.png`

    qr.toFile(`${__dirname}/public/${qrPath}`,content,(err, src) =>{
        if (err) res.send("Error occured");
    })

    // Update Path
    updatePathBarang(barang.insertId,qrPath,barangPath)


    qr.toDataURL(content, (err, src) => {
        if (err) res.send("Error occured");
        
        // const buf = new Buffer(src)
        // addImage(barang.id, buf)

        res.redirect("/produk")
    });
})

// ChartJS
app.get("/chart", async (req,res)=>{
    const data = await getBarangKeluarDate()
    // console.log(data[0].tanggal.getDate())
    let modifiedDate = data.map(function(date){
        let newDate = date.tanggal
        let day = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();

        let currentDate = `${year}-${month}-${day}`;
        return currentDate
    })
    let values = data.map(function(value){
        return(value.quantity)
    })

    // console.log(values)
    res.render("chartJS",{modifiedDate:modifiedDate,values:values})
})

// Produk 
app.get("/produk",async (req,res)=>{
    let datas = await getAllBarang()
    // res.send(datas)
    res.render("produk",{datas})
})

// Tampil Stok Masuk
app.get("/stok-masuk", async (req,res)=>{
    let datas = await getBarangMasuk()
    res.render("stok-masuk",{datas})
})

// Scan Masuk
app.get("/scan-masuk", async (req,res)=>{
    res.render("scan-masuk.ejs")
})


app.post("/scan-masuk", async (req,res)=>{
    let finalData = JSON.stringify(req.body.qrValue)
    finalData = finalData.replace(/\\/g, "")


    let toJson = JSON.parse(req.body.qrValue)


    // JSON Validator
    const schema = {type:"object",properties:{
        id:{type:"string"},
        nama_barang:{type:"string"},
        kategori:{type:"string"},
        harga:{type:"string"}
        },
        required: ["id", "nama_barang", "kategori", "harga"],
        additionalProperties: false
    }
    const validate = ajv.compile(schema)

    const valid = validate(toJson)
    if(!valid){
        res.send("QR Invalid !")
        console.log(validate.errors)
    }
    else{
        let string = encodeURIComponent(toJson.id);
        res.redirect('/barang-masuk/?id=' + string);
    }

})

// Barang Masuk
app.get("/barang-masuk", async (req,res)=>{
    let result = await getBarangScan(req.query.id)
    res.render("barang-masuk",{result})
})

app.post("/barang-masuk", async (req,res)=>{
    const {idBarang,quantity,tglProduksi,tglMasuk} = req.body

    try{
 
        insertGudang(idBarang,quantity,tglProduksi,tglMasuk)
        res.redirect("/stok-masuk")
    }
    catch(e){
        res.send(e)
    }
    
})



// === Barang Keluar ===

app.get("/stok-keluar", async (req,res)=>{
    let datas = await getTampilBarangKeluar()
    console.log(datas)
    res.render("stok-keluar",{datas})
})

// Scan Keluar
app.get("/scan-keluar", async (req,res)=>{
    res.render("scan-keluar.ejs")
})


app.post("/scan-keluar", async (req,res)=>{
    let finalData = JSON.stringify(req.body.test)
    finalData = finalData.replace(/\\/g, "")


    let toJson = JSON.parse(req.body.test)


    // JSON Validator
    const schema = {type:"object",properties:{
        id:{type:"string"},
        nama_barang:{type:"string"},
        kategori:{type:"string"},
        harga:{type:"string"}
        },
        required: ["id", "nama_barang", "kategori", "harga"],
        additionalProperties: false
    }
    const validate = ajv.compile(schema)

    const valid = validate(toJson)
    if(!valid){
        res.send("QR Invalid !")
        console.log(validate.errors)
    }
    else{
        let string = encodeURIComponent(toJson.id);
        res.redirect('/barang-keluar/?id=' + string);
    }

})

// Barang Keluar 

// Tampil Stok Keluar

app.get("/barang-keluar", async (req,res)=>{
    // Query Barang, Tampilkan informasi barang 

    // Render Halaman 
    let result = await getBarangScan(req.query.id)
    res.render("barang-keluar",{result})
})
app.post("/barang-keluar", async (req,res)=>{

    // Terima req.body dan kirim db

    const {idBarang,quantity,tglKeluar,tglExpired}= req.body
    console.log(tglExpired)
    try{
       let status = await outGudang(idBarang,quantity,tglExpired,tglKeluar)
       console.log(status)
       if(status){
        res.redirect("/stok-keluar")
       }
       else{
        res.send("Quantity Empty !")
       }
    
    }
    catch(e){
        res.send(e) 
    }
    

})

// // Tampil Stok

// app.post("/stok-masuk",async (req,res)=>{
//     const {idBarangMasuk}=req.body
//     console.log(idBarangMasuk)
// })

// == Tampil Barang Expired ===

app.get("/produk-expired", async (req,res)=>{
    const results = await getExpired()
    res.render("produk-expired",{results})
})

// ==== DEWA SAMPAI SINI ====

// ____ FAAT KE BAWAH ____

// +++++ READ +++++
//tampil barang
//  === MAY NOT NECESSARY ===
// app.get("/data-barang", async (req,res)=>{
//     const tampilBarang = await getTampilBarang()
//     res.render("tampil-barang.ejs",{tampilBarang:tampilBarang})
// })

// //tampil barang masuk
// app.get("/data-barang-masuk", async (req,res)=>{
//     const tampilBarangMasuk = await getTampilBarangMasuk()
//     res.render("tampil-barang-masuk.ejs",{tampilBarangMasuk:tampilBarangMasuk})
// })

// //tampil gudang
// app.get("/data-gudang", async (req,res)=>{
//     const tampilGudang = await getTampilGudang()
//     res.render("tampil-gudang.ejs",{tampilGudang:tampilGudang})
// })

// //tampil barang keluar
// app.get("/data-barang-keluar", async (req,res)=>{
//     const tampilBarangKeluar = await getTampilBarangKeluar()
//     res.render("tampil-barang-keluar.ejs",{tampilBarangKeluar})
// })

//tampil laporan
app.get("/laporan", async (req, res)=>{
    res.render("tampil-laporan.ejs")
})

app.post('/laporan-detail', async (req, res) => {
    const tanggal_produksi = req.body.tanggal_produksi
    const tanggal_expired = req.body.tanggal_expired
    const tampilLaporan = await getTampilLaporan(tanggal_produksi, tanggal_expired)
    res.render("tampil-laporan-detail.ejs", {tampilLaporan})
    console.log(tampilLaporan)
})





// +++++ UPDATE +++++
//detail tampil barang by id -> form barang
app.get('/data-barang/:idBarang', async (req, res) => { //request / 'get'
    const idBarang = req.params.idBarang
    const getIDBarang = await getBarangID(idBarang)
    res.render("update-barang.ejs",{getIDBarang})
})

//update barang
app.post('/update-barang/:idBarang', async (req, res) => { //request / 'post' to thunder client api with id
    const idBarang = req.params.idBarang
    const namaBarang = req.body.namaBarang
    const kategoriBarang = req.body.kategoriBarang
    const hargaBarang = req.body.hargaBarang
    await updateBarang(idBarang, namaBarang, kategoriBarang, hargaBarang)
    res.redirect(`/data-barang/${idBarang}`)
})

//detail tampil barang masuk by id -> form barang masuk
app.get('/data-barang-masuk/:idBarangMasuk', async (req, res) => { //request / 'get'
    const idBarangMasuk = req.params.idBarangMasuk
    const getIDBarangMasuk = await getBarangIDMasuk(idBarangMasuk)
    res.render("update-barang-masuk.ejs",{getIDBarangMasuk})
})

//update barang masuk blm selesai
app.post('/update-barang-masuk/:idBarangMasuk', async (req, res) => { //request / 'post' to thunder client api with id
    const idBarangMasuk = req.params.idBarangMasuk
    const idBarang = req.body.idBarang
    const namaBarang = req.body.namaBarang
    const idGudang = req.body.idGudang
    const quantity = req.body.quantity
    const tanggal = req.body.tanggal
    await updateBarangMasuk(idBarangMasuk, idBarang, namaBarang, idGudang, quantity, tanggal)
    res.redirect(`/data-barang-masuk/${idBarangMasuk}`)
})

//detail tampil gudang by id -> form gudang
app.get('/data-gudang/:idGudang', async (req, res) => { //request / 'get'
    const idGudang = req.params.idGudang
    const getIDGudang = await getGudangID(idGudang)
    res.render("update-gudang.ejs",{getIDGudang})
})

//update gudang blm selesai
app.post('/update-gudang/:idGudang', async (req, res) => { //request / 'post' to thunder client api with id
    const idGudang = req.params.idGudang
    const idBarang = req.body.idBarang
    const namaBarang = req.body.namaBarang
    const quantity = req.body.quantity
    const tanggalProduksi = req.body.tanggalProduksi
    const tanggalKadaluarsa = req.body.tanggalKadaluarsa
    await updateGudang(idGudang, idBarang, namaBarang, quantity, tanggalProduksi, tanggalKadaluarsa)
    res.redirect(`/data-gudang/${idGudang}`)
})

app.listen(8080, ()=>{
    console.log("server is running on port 8080")
})
