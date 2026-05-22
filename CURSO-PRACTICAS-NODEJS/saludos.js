function saludar (nombre) {
    return `holaaa ${nombre}`
}

function saludarHolaMundo () {
    return "Hola Mundooo";
}
//se puede hacer de esta forma
//module.exports.saludar = saludar; //aqui usamos el objeto module.exports para exportar la funcion saludar 
//module.exports.saludarHolaMundo = saludarHolaMundo;

//o de esta como tipo diccionario clave : valor

module.exports = {
    saludar : saludar,
    saludarHolaMundo : saludarHolaMundo
}
console.log(module.exports); //con module.exports podemos ver que se exporta de este modulo saludo
