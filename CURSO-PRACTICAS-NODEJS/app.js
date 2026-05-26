const saludo = require("./saludos");
//otra forma seria
// const { saludo, saludarHolaMundo } = require("./saludos"); se utiliza cuando son varios elementos exportados
const saludarHolaMundo = require("./saludos")

console.log(saludo); //aqui veremos que contiene la constante saludar, que en este caso
//contiene una funcion requerida
console.log(saludo.saludar("holaa")); //utilizamos el objeto "saludo" que mande a llamar a la funcion saludar
console.log(saludo.saludarHolaMundo());

console.warn("Ocurrio un error");
console.error("Ocurrio un errro");
//console.error(new Error('Ocurrio un error')); //mucho mas explicito
console.log(process.env); //nos dira el ambiente de ejecucion del programa