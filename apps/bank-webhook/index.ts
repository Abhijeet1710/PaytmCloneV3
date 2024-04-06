import express from "express";
import db from "@repo/db";

const app = express()

app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?
    const paymentInformation = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };
    // Update balance in db, add txn
    await db.$transaction([

        await db.balance.update({
            where: {
                userId: paymentInformation.userId
            },
            data: {
                amount: {
                    increment: paymentInformation.amount
                }
            }
        }),
    
        await db.onRampTransaction.update({
            where: {
                token: paymentInformation.token
            },
            data: {
                status: "Receipt"
            }
        })
    ])

    res.status(200).json({
        message: "Receipt"
    })
})


app.listen(3002, () => {
    console.log("WebHook Server Up And Running on https://localhost:3200")
})