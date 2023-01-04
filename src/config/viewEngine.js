import express from 'express'

let configviewEngine = (app) => {
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");// logic trong html
    app.set("views", "./src/views")

}
module.exports = configviewEngine;