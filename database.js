import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE,
    port:process.env.MYSQL_PORT
}).promise()


async function getAllBarang(){
    const [result] = await pool.query("SELECT * FROM tb_barang")
    return result
}

async function getItem(id){
    const [result] = await pool.query("SELECT * FROM tb_barang where id= ?",[id])
    return result
}

async function insertItem(nama,stok,harga){
    const [result] = await pool.query("INSERT INTO tb_barang (nama,stok,harga) VALUES (?,?,?)",[nama,stok,harga])
    return result
}

async function getAllTransactions(){
    const [result]=await pool.query("SELECT * FROM tb_transaksi")
    return result
}

async function getTransaction(id){
    const [result] = await pool.query("SELECT * FROM tb_transaksi where id = ?", [id])
    return result
}


async function insertTransaction(id,qty){
    const [item] = await getItem(id)
    let {nama,stok}=item
    let updatedStok = () =>{
        if(qty<=stok){
            return stok-qty
        }
    }
    await pool.query("UPDATE tb_barang SET stok = ? where id = ?", [updatedStok(),id])
    await pool.query("INSERT INTO tb_transaksi (quantity,id_barang) VALUES (?,?)", [qty,id]) 
}

async function showAllTransactionDate(date){
    const item= await pool.query("SELECT SUM(quantity) FROM tb_transaksi where tanggal = ?",[date])
    console.log(item)
}

async function showTransactionItemDate(date,id){
    const [item]= await pool.query("SELECT SUM(quantity),id_barang FROM tb_transaksi where tanggal = ? AND id_barang = ?",[date,id])
    console.log(item)
}













// Scan QR Get Barang
export async function getBarangScan(idBarang){
    const [returnGetBarang]= await pool.query("SELECT * FROM tb_barang where id = ?",[idBarang])
    console.log(returnGetBarang[0])
    return returnGetBarang[0]
}

// Query Barang Masuk
export async function insertGudang(idBarang,qty,tglProduksi){

    //  IF DUNNO TANGGAL PRODUKSI, GENERATE TANGGAL PRODUKSI - TANGGAL EXPIRED
    // Insert to tb_gudang
    let tglExpired = generateExpired(tglProduksi)
    const [returnInsertGudang]= await pool.query("INSERT INTO tb_gudang (id_barang, quantity, tanggal_produksi, tanggal_expired) VALUES (?, ?, ?, ?)",[idBarang,qty,tglProduksi, tglExpired])
    
    console.log(returnInsertGudang)

    // Insert to tb_barang_masuk
    const [returnInsertMasuk]= await pool.query("INSERT INTO tb_barang_masuk (id_gudang, quantity, tanggal) VALUES (?, ?, ?)",[returnInsertGudang.insertId,qty,getDateNow()])
}

// Query Barang Keluar
export async function outGudang(idBarang,qty,tglExpired){
    // Update Barang Gudang
    const [returnUpdateGudang]= await pool.query("UPDATE tb_gudang SET quantity = quantity - ? where tanggal_expired = ? AND id_barang = ?",[qty,tglExpired,idBarang])

    // //reng rengan update
    // update tb_gudang where id = ?, [idBarang]

    // Get ID Barang Gudang
    const [returnGetItem]= await pool.query("SELECT * FROM tb_gudang where tanggal_expired = ? AND id_barang = ?",[tglExpired,idBarang])


    // Insert Barang Keluar

    const [returnBarangKeluar]= await pool.query("INSERT INTO tb_barang_keluar (id_gudang, quantity, tanggal) VALUES (?, ?, ?)",[returnGetItem[0].id , qty, getDateNow()])
    console.log(returnBarangKeluar)
}

// Delete Hanya Gudang
export async function deleteOnlyGudang(idGudang){
    await pool.query("SET foreign_key_checks = 0;")
    const [resultOnlyGudang] = await pool.query("DELETE FROM tb_gudang WHERE id = ?",[idGudang])
    console.log(resultOnlyGudang)
    await pool.query("SET foreign_key_checks = 1;")
}

// Delete Gudang dan Sekitarnya
export async function deleteGudangAll(idGudang){
    await pool.query("DELETE FROM tb_barang_masuk WHERE id_gudang = ?",[idGudang])
    await pool.query("DELETE FROM tb_barang_keluar WHERE id_gudang = ?",[idGudang])
    const [result]=await pool.query("DELETE FROM tb_gudang WHERE id = ?",[idGudang])
    console.log(result)
}

// Utility Function Below

// Get Date Now
function getDateNow(){
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${year}-${month}-${day}`;
    return currentDate
}

// Generate Expired 
function generateExpired(tglProduksi){
    const date= new Date(tglProduksi)
    let month = date.getMonth() +1
    console.log("Month Before :" +month)
    month += 3
    date.setMonth(month)
    console.log(date.getMonth())
    return (`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
}




// generateExpired("2023-03-19")

// insertGudang(1,2,"2023-06-19")
// outGudang("2023-09-19", 1,1)

// insertTransaction(1,3)


// showAllTransactionDate("2023-02-19")
// showTransactionItemDate("2023-02-19",1)





//get all data MYSQL
//tampil barang
export async function getTampilBarang(){
    const [rows] = await pool.query("SELECT * FROM tb_barang")
    return rows
}

//tampil barang masuk
export async function getTampilBarangMasuk(){
    // const [rows] = await pool.query("SELECT * FROM tb_barang_masuk")
    const [rows] = await pool.query("SELECT tb_barang_masuk.id, tb_barang_masuk.idBarang, tb_barang.nama_barang, tb_barang_masuk.id_gudang, tb_barang_masuk.quantity, tb_barang_masuk.tanggal FROM tb_barang_masuk INNER JOIN tb_barang ON tb_barang_masuk.idBarang=tb_barang.id")
    return rows
    
}
//tampil gudang
export async function getTampilGudang(){
    // const [rows] = await pool.query("SELECT * FROM tb_gudang")
    //orders = tb_gudang customer = tb_barang
    // SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate FROM Orders INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;
    const [rows] = await pool.query("SELECT tb_gudang.id, tb_barang.nama_barang, tb_gudang.id_barang, tb_gudang.quantity, tb_gudang.tanggal_produksi, tb_gudang.tanggal_expired FROM tb_gudang INNER JOIN tb_barang ON tb_gudang.id_barang=tb_barang.id")
    return rows
}
//tampil barang keluar
export async function getTampilBarangKeluar(){
    // const [rows] = await pool.query("SELECT * FROM tb_barang_keluar")
    const [rows] = await pool.query("SELECT tb_barang_keluar.idBarang, tb_barang.nama_barang, tb_barang_keluar.id_gudang, tb_barang_keluar.quantity, tb_barang_keluar.tanggal FROM tb_barang_keluar INNER JOIN tb_barang ON tb_barang_keluar.idBarang=tb_barang.id")
    return rows
}


//update all data MYSQL
//update barang
export async function getBarangID(idBarang){
    const [rows]= await pool.query("SELECT * FROM tb_barang where id = ?",[idBarang])
    console.log(rows[0])
    return rows[0]
}

export async function updateBarang(idBarang, namaBarang, kategoriBarang, hargaBarang){
    const [updatedBarang]= await pool.query("UPDATE tb_barang SET nama_barang = ?, kategori = ?, harga = ? where id = ?",[namaBarang, kategoriBarang, hargaBarang, idBarang])
    return(updatedBarang)
    
}

//update barang masuk
export async function getBarangIDMasuk(idBarangMasuk){
    const [rows]= await pool.query("SELECT tb_barang_masuk.id, tb_barang_masuk.idBarang, tb_barang.nama_barang, tb_barang_masuk.id_gudang, tb_barang_masuk.quantity, tb_barang_masuk.tanggal FROM tb_barang_masuk INNER JOIN tb_barang ON tb_barang_masuk.idBarang=tb_barang.id WHERE tb_barang_masuk.id = ?",[idBarangMasuk])
    console.log(rows[0])
    return rows[0]
}

//belum selesai SQL UPDATE INNER JOIN
export async function updateBarangMasuk(idBarangMasuk, idBarang, namaBarang, idGudang, quantity, tanggal){
    const [updatedBarangMasuk]= await pool.query("UPDATE tb_barang_masuk SET idBarang = ?, nama_barang = ?, id_gudang = ?, quantity = ?, tanggal = ? where id = ?",[idBarang, namaBarang, idGudang, quantity, tanggal, idBarangMasuk])
    return(updatedBarangMasuk)
    
}

//update gudang
export async function getGudangID(idGudang){
    const [rows]= await pool.query("SELECT tb_gudang.id, tb_gudang.id_barang, tb_barang.nama_barang, tb_gudang.quantity, tb_gudang.tanggal_produksi, tb_gudang.tanggal_expired FROM tb_gudang INNER JOIN tb_barang ON tb_gudang.id_barang=tb_barang.id WHERE tb_gudang.id = ?",[idGudang])
    console.log(rows[0])
    return rows[0]
}

//belum selesai SQL UPDATE INNER JOIN
export async function updateGudang(idGudang, idBarang, namaBarang, quantity, tanggal){
    const [updatedGudang]= await pool.query("UPDATE tb_gudang SET idBarang = ?, nama_barang = ?, id_gudang = ?, quantity = ?, tanggal = ? where id = ?",[idBarang, namaBarang, idGudang, quantity, tanggal, idGudang])
    return(updatedGudang)
    
}
