import  express  from "express";

// AJV JSON Validator
import Ajv from "ajv"
const ajv = new Ajv()

const app = express()
app.use(express.json())

// View Engine*
app.set("view engine","ejs")

// Allow URL Encoded
app.use(express.urlencoded({extended:true}))

// QR Generator
import qr, { toDataURL } from "qrcode"
import { getBarangScan, insertGudang, outGudang,
    getTampilBarang, getTampilBarangMasuk, getTampilGudang, getTampilBarangKeluar,
getBarangID, getBarangIDMasuk, getGudangID, 
updateBarang, updateBarangMasuk, updateGudang} from "./database.js";



// Create
app.get("/create", async (req,res)=>{
    res.render("create.ejs")
})

app.post("/create", async (req,res)=>{
    const {tipe,nama,harga} = req.body
    // let barang = await createBarang(tipe,nama,harga,stok)
    // console.log(barang)
    let content = `{"tipe":"${tipe}","nama":"${nama}","harga":"${harga}"}`
    if (content.length === 0) res.send("Empty Data!");

    qr.toDataURL(content, (err, src) => {
        if (err) res.send("Error occured");
      
        // const buf = new Buffer(src)
        // addImage(barang.id, buf)
        res.render("generatedQR.ejs", { src });
    });
})




// Scan Masuk
app.get("/scan-masuk", async (req,res)=>{
    res.render("scan-masuk.ejs")
})


app.post("/scan-masuk", async (req,res)=>{
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
        res.redirect('/barang-masuk/?id=' + string);
    }

})

// Barang Masuk
app.get("/barang-masuk", async (req,res)=>{
    let result = await getBarangScan(req.query.id)
    res.json(result)
})

app.post("/barang-masuk", async (req,res)=>{
    const {idBarang,qty,tglProduksi} = req.body

    try{
        insertGudang(idBarang,qty,tglProduksi)
        res.send("OK!")
    }
    catch(e){
        res.send(e)
    }
    
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

app.get("/barang-keluar", async (req,res)=>{
    // Query Barang, Tampilkan informasi barang 

    // Render Halaman 
    let result = await getBarangScan(req.query.id)
    res.json(result)
})
app.post("/barang-keluar", async (req,res)=>{

    // Terima req.body dan kirim db

    const {idBarang,qty,tglExpired}= req.body
    try{
       await outGudang(idBarang,qty,tglExpired)
        res.send("OK!")
    }
    catch(e){
        res.send(e)
    }
    

})

app.listen(8080, ()=>{
    console.log("server is running on port 8080")
})



//get all data lewat THUNDER CLIENT *run* terminal -> node app.js -> thunder client -> localhost:8080/tampil
// app.get("/tampil", async (req,res)=>{
//     const tampilData = await getTampilData()
//     res.send(tampilData)
// })


//TAMPIL
//get all data lewat WEBSITE VIEWS *run* terminal -> npm run dev -> localhost:8080/data-barang
//tampil barang
app.get("/data-barang", async (req,res)=>{
    const tampilBarang = await getTampilBarang()
    res.render("tampil-barang.ejs",{tampilBarang:tampilBarang})
})

//tampil barang masuk
app.get("/data-barang-masuk", async (req,res)=>{
    const tampilBarangMasuk = await getTampilBarangMasuk()
    res.render("tampil-barang-masuk.ejs",{tampilBarangMasuk:tampilBarangMasuk})
})

//tampil gudang
app.get("/data-gudang", async (req,res)=>{
    const tampilGudang = await getTampilGudang()
    res.render("tampil-gudang.ejs",{tampilGudang:tampilGudang})
})

//tampil barang keluar
app.get("/data-barang-keluar", async (req,res)=>{
    const tampilBarangKeluar = await getTampilBarangKeluar()
    res.render("tampil-barang-keluar.ejs",{tampilBarangKeluar})
})



//UPDATE
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


