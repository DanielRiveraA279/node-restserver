


// ================
// Puerto
// ================

process.env.PORT = process.env.PORT || 3000;


// ================
// Entorno
// ================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



// ================
// Base de datos
// ================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'; 
}else {
 urlDB = 'mongodb+srv://danielrivera:t5frK9wa4ZMNYjh6@cluster0.z7oo4.mongodb.net/<dbname>?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB;