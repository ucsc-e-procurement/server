const express = require("express");
const multer = require('multer');
const sprintf = require('sprintf-js').sprintf;
const upload = multer();
const router = express.Router();

// Database Models
const supplierModel = require("../../models/supplier_model");

module.exports = (app) => {

    app.use("/supplier", router);

    // Health Check Route for Testing
    router.get("", (req, res) => {
        res.send("Supplier routes are working").status(200).end();
    });

    let formData = upload.fields([
        { name: 'name' }, 
        { name: 'email' },
        { name: 'contact' },
        { name: 'address' },
        { name: 'password' },
        { name: 'categories' },
        { name: 'payment' },
    ]);

    router.post("/registration", formData, async (req, res) => {
        const result = await supplierModel.checkExistingSupplier(req.body['email'])
            .then(results => {
                if(results.length > 0) {
                    return res.statusMessage = "User exists";
                }
            })
            .catch(err => {
                console.log(err);
            });
        if(!result) {
            const result = await supplierModel.getLastID();
            // generate new ids for user
            const user_id = 'u'+sprintf('%04d', parseInt(result[0].lastID.match(/\d+/)[0])+1);
            const supplier_id = 's'+sprintf('%04d', parseInt(result[0].lastID.match(/\d+/)[0])+1);

            supplierModel.registerSupplier(req.body, user_id)
                .then(() => { 
                    supplierModel.saveSupplierInfo(req, user_id, supplier_id)
                        .then(() => {
                            res.statusMessage = "Successfully added";
                            res.send("Successful").status(200).end();   
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
                .catch(err => {
                    console.log(err)
                });
        }
    });

    router.post("/price_schedule", (req, res) => {
        supplierModel.enterSupplierBid(req.body).then(() => {
            supplierModel.saveBidProducts(req.body.items)
                .then(() => {
                    res.send("Successful").status(200).end();   
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err);
        })
    });
};