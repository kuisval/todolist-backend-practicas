const saludo = require("./saludos");
const saludarHolaMundo = require("./saludos")

console.log(saludo); //aqui veremos que contiene la constante saludar, que en este caso
//contiene una funcion requerida
console.log(saludo.saludar("holaa")); //utilizamos el objeto "saludo" que mande a llamar a la funcion saludar
console.log(saludo.saludarHolaMundo());