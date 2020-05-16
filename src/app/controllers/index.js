const fs = require('fs');
const path = require('path');

/** CRIA UM ARQUIVO ONDE ELE AUTO REALIZA INCLUSÃO DE NOVOS CONTROLLERS
 * fs => FileSistem
 * path => Caminhos dentro do sistema
 */
module.exports = app => {
  fs
    .readdirSync(__dirname)
    .filter(file => ((file.indexOf('.')) !== 0 &&  (file !== "index.js")))
    .forEach(file => require(path.resolve(__dirname, file))(app));
}