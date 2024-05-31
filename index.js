const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors')
const bodyParsery = require('body-parser');
const koneksi = require('./config/database');
const { error } = require('console');
const app = express();
const PORT = process.env.PORT || 4000;


// set body parser
app.use(bodyParsery.json());
app.use(bodyParsery.urlencoded({extended: true}));

// script upload
app.use(cors({
    origin: '*'
}));

app.use(express.static("./public"))
// !use multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/image/') // './public/image/' direktori name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '' +Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({
    storage: storage
});

// insert data movies
app.post('/api/movies', upload.single('foto'),(req, res) => {
    
    // buat variabel penampung data dan query sql
    if (!req.file) {
        const data = { ...req.body };
        const judul = data.judul;
        const rating = data.rating;
        const deskripsi = data.deskripsi;
        const sutradara = data.sutradara;
        const queryUpdate = 'INSERT INTO movies (judul,rating,deskripsi,sutradara) VALUES (?,?,?,?)';
        
        // jalankan query untuk melakukan pencarian data
        koneksi.query(queryUpdate, [judul,rating,deskripsi,foto,sutradara], (err, rows, field) => {
            // error handling
                if (err) {
                        return res.status(500).json({ message: 'Ada kesalahan', error: err });
                    }
        
            // jika update berhasil
                    res.status(200).json({ success: true, message: 'Data berhasil ditambahkan', data: rows });
                });
    } else {
        console.log(req.file.filename)
        var imgsrc = 'http://localhost:4000/image/' + req.file.filename
        // buat variabel penampung data dan query sql
        const data = { ...req.body };
        const querySql = 'INSERT INTO movies (judul,rating,deskripsi,sutradara,foto) values(?,?,?,?,?);';
        const judul = data.judul;
        const rating = data.rating;
        const deskripsi = data.deskripsi;
        const sutradara = data.sutradara;
        const foto = imgsrc;

        // jalankan query
        koneksi.query(querySql,[ judul,rating,deskripsi,sutradara,foto], (err, rows, field) => {
            // error handling
            if (err) {
                return res.status(500).json({ message: `Gagal insert data!`, error: err});
            }

            // jika berhasil
            res.status(201).json({ success: true, message: `Berhasil insert data` })
        });
    }
});

  

// insert data mahasiswa
app.post('/api/mahasiswa', upload.single('photo'),(req, res) => {


    const data = { ...req.body };
    const nim = req.body.nim;
    const nama = req.body.nama;
    const tanggal_lahir = req.body.tanggal_lahir;
    const alamat = req.body.alamat;

    if (!req.file) {
        console.log("No file upload");
        const querySql = 'INSERT INTO mahasiswa (nim, nama, tanggal_lahir, alamat) values (?,?,?,?);';
         
        // jalankan query
        koneksi.query(querySql,[ nim, nama, tanggal_lahir, alamat], (err, rows, field) => {
            // error handling
            if (err) {
                return res.status(500).json({ message: 'Gagal insert data!', error: err });
            }
       
            // jika request berhasil
            res.status(201).json({ success: true, message: 'Berhasil insert data!' });
        });
    } else {
        console.log(req.file.filename)
        var imgsrc = 'http://localhost:4000/photo/' + req.file.filename;
        // buat variabel penampung data dan query sql
        const foto =   imgsrc;
        const data = { ...req.body };
        const nim = data.nim;
        const nama = data.nama;
        const tanggal_lahir = data.tanggal_lahir;
        const alamat = data.alamat;
        const querySql = 'INSERT INTO mahasiswa (nim, nama, tanggal_lahir, alamat, foto) values (?,?,?,?,?);';
 
    // jalankan query
    koneksi.query(querySql,[ nim, nama, tanggal_lahir, alamat, foto], (err, rows, field) => {
        // error handling
        if (err) {
        return res.status(500).json({ message: 'Gagal insert data!', error: err });
        }

        // jika request berhasil
        res.status(201).json({ success: true, message: 'Berhasil insert data!' });
});
}
});

// read data / get data
app.get('/api/movies', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM movies';
    console.log(querySql);

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});
app.get('/api/movies/:judul', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM movies WHERE judul like \'%' + req.params.judul + '%\';';
    console.log(querySql);

    // jalankan query
    koneksi.query(querySql, req.params.judul, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});

app.get('/api/mahasiswa', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM mahasiswa';

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});
app.get('/api/mahasiswa/:nim', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM mahasiswa WHERE nim = ?';

    // jalankan query
    koneksi.query(querySql, req.params.nim, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});

// update data
app.put('/api/movies/:id', (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM movies WHERE id = ?';
    const judul = data.judul;
    const rating = data.rating;
    const deskripsi = data.deskripsi;
    const foto = data.foto;
    const sutradara = data.sutradara;

    const queryUpdate = 'UPDATE movies SET judul=?,rating=?,deskripsi=?,foto=?,sutradara=? WHERE id = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.id, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query update
            koneksi.query(queryUpdate, [judul,rating,deskripsi,foto,sutradara, req.params.id], (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika update berhasil
                res.status(200).json({ success: true, message: 'Berhasil update data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

// update data
app.put('/api/mahasiswa/:nim', (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM mahasiswa WHERE nim = ?';
    const nama = data.nama;
    const tanggal_lahir = data.tanggal_lahir;
    const alamat = data.alamat;

    const queryUpdate = 'UPDATE mahasiswa SET nama=?,tanggal_lahir=?,alamat=? WHERE nim = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.nim, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query update
            koneksi.query(queryUpdate, [nama,tanggal_lahir,alamat, req.params.nim], (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika update berhasil
                res.status(200).json({ success: true, message: 'Berhasil update data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

// delete data
app.delete('/api/movies/:id', (req, res) => {
    // buat query sql untuk mencari data dan hapus
    const querySearch = 'SELECT * FROM movies WHERE id = ?';
    const queryDelete = 'DELETE FROM movies WHERE id = ?';
    console.log(queryDelete);

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.id, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query delete
            koneksi.query(queryDelete, req.params.id, (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika delete berhasil
                res.status(200).json({ success: true, message: 'Berhasil hapus data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});


app.delete('/api/mahasiswa/:nim', (req, res) => {
    // buat query sql untuk mencari data dan hapus
    const querySearch = 'SELECT * FROM mahasiswa WHERE nim = ?';
    const queryDelete = 'DELETE FROM mahasiswa WHERE nim = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.nim, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query delete
            koneksi.query(queryDelete, req.params.nim, (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika delete berhasil
                res.status(200).json({ success: true, message: 'Berhasil hapus data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

// buat server nya menggunakan port sesusai settingan konstanta = 5000
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));