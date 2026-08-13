
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const session = require("express-session");



app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "sonu",
    resave: false,
    saveUninitialized: false
}));



mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected Successfully");
})
.catch((err) => {
    console.log(err);
});





const customerOrderSchema = new mongoose.Schema({}, {
    strict: false
});

const CustomerOrder = mongoose.model(
    "CustomerOrder",
    customerOrderSchema
);






const orderSchema = new mongoose.Schema({}, {
    strict: false,
    collection: "orders"
});

const Order = mongoose.model("Order", orderSchema);



/*

const userSchema = new mongoose.Schema({
    name: String,
    number: String,
    email: String,
    password: String,
    genotp: Number,
orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
}]
});
*/



const userSchema = new mongoose.Schema({
    name: String,

    number: {
        type: String,
        unique: true,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: String,
    genotp: String,

    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }]
});




const User = mongoose.model("User", userSchema);



app.post("/admin-login", (req, res) => {


const ADMIN_USER_ID = "rahul123";
const ADMIN_PASSWORD = "998877";


    const { userId, password } = req.body;

    if (
        userId === ADMIN_USER_ID &&
        password === ADMIN_PASSWORD
    ) {

        req.session.isAdmin = true;

        return res.redirect("/admin");

    }

    res.status(401).send(`
        <script>
            alert("Wrong User ID or Password");
            history.back();
        </script>
    `);

});



app.get("/admin", adminAuth, (req, res) => {

    res.sendFile(
        path.join(__dirname, "admin.html")
    );

});

// ==========================================
// ADMIN ROUTES
// ==========================================


// ==========================================
// 1. ALL USERS - READ
// ==========================================

app.get("/users", async (req, res) => {
    try {

        const users = await User.find();

        res.json(users);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Users fetch failed"
        });

    }
});


// ==========================================
// 2. ALL ORDERS - READ
// ==========================================

app.get("/total-orders", async (req, res) => {
    try {

        const orders = await Order.find();

        res.json(orders);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Orders fetch failed"
        });

    }
});


// ==========================================
// 3. ALL CUSTOMER ORDERS - READ
// ==========================================

app.get("/customer-orders", async (req, res) => {
    try {

        const orders =
            await CustomerOrder.find();

        res.json(orders);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Customer orders fetch failed"
        });

    }
});


// ==========================================
// 4. USER UPDATE
// Manual userId se
// ==========================================

app.put("/user/:userId", async (req, res) => {

    try {

        const user =
            await User.findOneAndUpdate(

                {
                    userId: req.params.userId
                },

                {
                    $set: req.body
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        res.json(user);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "User update failed"
        });

    }

});


// ==========================================
// 5. USER DELETE
// ==========================================

app.delete("/user/:userId", async (req, res) => {

    try {

        const user =
            await User.findOneAndDelete({

                userId:
                    req.params.userId

            });


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        res.json({

            message:
                "User deleted successfully",

            user

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "User delete failed"
        });

    }

});


// ==========================================
// 6. ORDER UPDATE
// orderId se
// ==========================================

app.put("/order/:orderId", async (req, res) => {

    try {

        const order =
            await Order.findOneAndUpdate(

                {
                    orderId:
                        req.params.orderId
                },

                {
                    $set: req.body
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }


        res.json(order);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Order update failed"
        });

    }

});


// ==========================================
// 7. ORDER DELETE
// ==========================================

app.delete("/order/:orderId", async (req, res) => {

    try {

        const order =
            await Order.findOneAndDelete({

                orderId:
                    req.params.orderId

            });


        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }


        res.json({

            message:
                "Order deleted successfully",

            order

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Order delete failed"
        });

    }

});


// ==========================================
// 8. CUSTOMER ORDER UPDATE
// orderId ho to orderId se
// ==========================================

app.put("/customer-order/:orderId", async (req, res) => {

    try {

        const order =
            await CustomerOrder.findOneAndUpdate(

                {
                    orderId:
                        req.params.orderId
                },

                {
                    $set: req.body
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!order) {

            return res.status(404).json({
                message:
                    "Customer order not found"
            });

        }


        res.json(order);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Customer order update failed"
        });

    }

});


// ==========================================
// 9. CUSTOMER ORDER DELETE
// ==========================================

app.delete("/customer-order/:orderId", async (req, res) => {

    try {

        const order =
            await CustomerOrder.findOneAndDelete({

                orderId:
                    req.params.orderId

            });


        if (!order) {

            return res.status(404).json({
                message:
                    "Customer order not found"
            });

        }


        res.json({

            message:
                "Customer order deleted successfully",

            order

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Customer order delete failed"
        });

    }

});














/*


app.get("/total-users", async (req, res) => {
    try {
        const totalUsers = await User.find();

        res.json({
            totalUsers
        });

console.log(totalUsers);

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});



app.get("/total-orders", async (req, res) => {
    try {
        const orders = await Order.find();

        res.json(orders);
console.log(orders);
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});



app.get("/customer-orders", async (req, res) => {
    try {
        const orders = await CustomerOrder.find();

        res.json(orders);
console.log(orders)
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

*/
function adminAuth(req, res, next) {

    if (req.session.isAdmin) {
        return next();
    }

    res.redirect("/adminlogin.html");
};

async function existdata(req, res, next) {

    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) {
        return res.send("User not found");
    }

    next();
}
    
async function checksession(req, res, next) {

    if (!req.session.email) {
        return res.sendFile(path.join(__dirname, "public", "login.html"));
    }

    next();
};

function checkLogin(req, res, next) {

    if (req.session.userId) {
        next();
    }else  return res.sendFile(path.join(__dirname, "public", "login.html"));;

};

const PORT = process.env.PORT || 5000;





app.get("/", (req, res) => {
    res.send("Hello Express!");
});



app.get("/clean-databases", async (req, res) => {
    try {
        const keepDatabase = "project001";

        const admin = mongoose.connection.db.admin();
        const result = await admin.listDatabases();

        const deleted = [];

        for (const database of result.databases) {
            const dbName = database.name;

            // project001 aur MongoDB system databases ko chhod do
            if (
                dbName !== keepDatabase &&
                dbName !== "admin" &&
                dbName !== "config" &&
                dbName !== "local"
            ) {
                await mongoose.connection.client
                    .db(dbName)
                    .dropDatabase();

                deleted.push(dbName);
            }
        }

        res.json({
            success: true,
            keptDatabase: "project001",
            deletedDatabases: deleted
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});




app.post("/signup", async (req, res) => {

    const { name, number, email, password1, password2 } = req.body;

    if (!name || !number || !email || !password1 || !password2) {
        return res.send("All fields are required");
    }

    if (!/^[0-9]{10}$/.test(number)) {
        return res.send("Invalid mobile number");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.send("Invalid email");
    }

    if (password1.length < 6) {
        return res.send("Password must be at least 6 characters");
    }

    if (password1 !== password2) {
        return res.send("Password does not match");
    }

    const existingUser = await User.findOne({
        $or: [
            { email: email },
            { number: number }
        ]
    });

    if (existingUser) {
        res.sendFile(path.join(__dirname, "public", "userexit.html"));
    }

    await User.create({
        name,
        number,
        email,
        password: password1
    });

    res.send("Signup Successful");
});








// ------------------- SEND OTP -------------------

app.post("/sendotp", existdata, async (req, res) => {

    const { email } = req.body;

    const genotp = Math.floor(100000 + Math.random() * 900000);

    await User.updateOne(
        { email: email },
        { genotp: genotp }
    );
req.session.email = email;

console.log(req.session.email);
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ksonu737745@gmail.com",
            pass: "wjtxogmyqptsrphi"
        }
    });

    const mailOptions = {
        from: "ksonu737745@gmail.com",
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${genotp}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.sendFile(path.join(__dirname, "public", "checkotp.html"));
    } catch (err) {
        console.log(err);
        res.send("OTP Send Failed");
    }

});




// ------------------- VERIFY OTP -------------------

app.post("/checkotp", checksession, async (req, res) => {

    const email = req.session.email;
    const { otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.send("User not found");
    }

    if (user.genotp == Number(otp)) {

        await User.updateOne(
            { email },
            { genotp: null }
        );

       

        return res.sendFile(path.join(__dirname, "public", "createpassword.html"));
    }

    res.send("Invalid OTP");

});






app.post("/createpassword", async (req, res) => {

    const { password, confirmPassword } = req.body;

    const email = req.session.email;

    if (!password || !confirmPassword) {
        return res.send("All fields are required.");
    }

    if (password.length < 6) {
        return res.send("Password must be at least 6 characters.");
    }

    if (password !== confirmPassword) {
        return res.send("Passwords do not match.");
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.send("User not found.");
    }

    await User.updateOne(
        { email: email },
        { $set: { password: password } }
    );

     // Optional: password update ke baad cookie hata do

   res.sendFile(path.join(__dirname, "public", "success.html"));

});




app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    // Empty Validation
    if (!email || !password) {
        return res.send("All fields are required.");
    }

    // User Check
    const user = await User.findOne({ email });

    if (!user) {
        return res.send("Email does not exist.");
    }

    // Password Check
    if (user.password !== password) {
        return res.send("Incorrect password.");
    }

    // Login Session
    req.session.userId = user._id;
    req.session.email = user.email;

    // Dashboard
    res.redirect("/dashboard");

});




app.get("/dashboard", checkLogin,(req, res) => {

    res.sendFile(path.join(__dirname, "public", "dashbord.html"));

});

app.get("/geticon", checkLogin,async (req, res) => {
const email = req.session.email;
    
const user = await User.findOne({email:email});

res.json({
        user
    });



});







app.get("/order1", checkLogin,async (req, res) => {
res.sendFile(path.join(__dirname, "public", "confirmOrder1.html"));
});

app.get("/order2", checkLogin,async (req, res) => {
res.sendFile(path.join(__dirname, "public", "confirmOrder2.html"));
});

app.get("/order3", checkLogin,async (req, res) => {
res.sendFile(path.join(__dirname, "public", "confirmOrder3.html"));
});

app.get("/order4", checkLogin,async (req, res) => {
res.sendFile(path.join(__dirname, "public", "confirmOrder4.html"));
});

app.get("/order5", checkLogin,async (req, res) => {
res.sendFile(path.join(__dirname, "public", "confirmOrder5.html"));
});

app.get("/dashbordrout",checksession, checkLogin,(req, res) => {

    res.sendFile(path.join(__dirname, "public", "dashbord.html"));

});






app.get("/order6", checkLogin,async (req, res) => {
res.sendFile(path.join(__dirname, "public", "confirmOrder6.html"));
});

app.get("/order7", checkLogin,async (req, res) => {
res.sendFile(path.join(__dirname, "public", "confirmOrder7.html"));
});

app.get("/order8", checkLogin,async (req, res) => {
res.sendFile(path.join(__dirname, "public", "confirmOrder8.html"));
});

app.get("/order9", checkLogin,async (req, res) => {
res.sendFile(path.join(__dirname, "public", "confirmOrder9.html"));
});

app.get("/order10", checkLogin,async (req, res) => {
res.sendFile(path.join(__dirname, "public", "confirmOrder10.html"));
});


app.get("/order11", checkLogin,async (req, res) => {
res.sendFile(path.join(__dirname, "public", "confirmOrder11.html"));
});






let product;   // route के बाहर

app.post("/order",checkLogin, async (req, res) => {

    product = await Order.findOne({
        productId: req.body.productId
    });

    

if (!product) {
        return res.send("Product not found");
    }

    const data = product.toObject();

delete data._id;
    delete data.__v;

    data.sessionId = req.session.email;

    const savedOrder = await CustomerOrder.create(data);

    console.log(savedOrder);

   


});





/*
app.get("/sendorder", checkLogin, async (req, res) => {

    const orders = await CustomerOrder.find({
        sessionId: req.session.email
    }).lean();


function renderData(obj) {

    let html = "";

    for (const [key, value] of Object.entries(obj)) {

        // Ye fields user ko nahi dikhani
        if (key === "_id" || key === "sessionId") {
            continue;
        }

        if (
            value &&
            typeof value === "object" &&
            !Array.isArray(value)
        ) {

            html += `
                <div class="data-box nested-box">

                    <div class="data-label">
                        ${key}
                    </div>

                    <div class="nested-data">
                        ${renderData(value)}
                    </div>

                </div>
            `;

        } else {

            html += `
                <div class="data-box">

                    <span class="data-label">
                        ${key}
                    </span>

                    <strong class="data-value">
                        ${value ?? "N/A"}
                    </strong>

                </div>
            `;
        }
    }

    return html;
}

    // MongoDB ke kisi bhi object ko automatically HTML mein convert karega
/*    function renderData(obj) {

        let html = "";

        for (const [key, value] of Object.entries(obj)) {

            // MongoDB ka internal _id nahi dikhana
            if (key === "_id") continue;

            // Agar nested object hai
            if (
                value &&
                typeof value === "object" &&
                !Array.isArray(value)
            ) {

                html += `
                    <div class="data-box nested-box">

                        <div class="data-label">
                            ${key}
                        </div>

                        <div class="nested-data">
                            ${renderData(value)}
                        </div>

                    </div>
                `;

            } else {

                html += `
                    <div class="data-box">

                        <span class="data-label">
                            ${key}
                        </span>

                        <strong class="data-value">
                            ${value ?? "N/A"}
                        </strong>

                    </div>
                `;
            }
        }

        return html;
    }

*/
  /*  let cards = "";

    for (const order of orders) {

        cards += `
            <div class="order-card">

                <div class="order-top">

                    <div>
                        <h2>
                            ${order.serviceName || order.name || "Order Details"}
                        </h2>

                        <p>
                            Product ID:
                            <b>${order.productId || "N/A"}</b>
                        </p>
                    </div>

                    <span class="order-id">
                        ${order.orderId || "N/A"}
                    </span>

                </div>


                <div class="data-container">

                    ${renderData(order)}

                </div>

            </div>
        `;
    }


    res.send(`
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>My Orders</title>


<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}


body{

    font-family:Arial, sans-serif;

    background:
        linear-gradient(
            135deg,
            #eef4ff,
            #f8fafc,
            #edf3ff
        );

    min-height:100vh;

    padding:25px 15px;

    color:#1f2937;
}


.container{

    max-width:850px;

    margin:auto;
}


.page-title{

    text-align:center;

    margin-bottom:25px;

}


.page-title h1{

    font-size:30px;

    color:#1e3a8a;

    margin-bottom:7px;
}


.page-title p{

    color:#6b7280;

    font-size:15px;
}


/* ORDER CARD */
/*
.order-card{

    background:#ffffff;

    border-radius:24px;

    margin-bottom:25px;

    padding:25px;

    border-left:6px solid #2563eb;

    box-shadow:
        0 10px 30px rgba(37,99,235,0.10);

    overflow:hidden;
}


/* TOP */
/*
.order-top{

    display:flex;

    justify-content:space-between;

    align-items:center;

    gap:15px;

    padding-bottom:20px;

    border-bottom:1px solid #e5e7eb;
}


.order-top h2{

    font-size:25px;

    color:#111827;

    margin-bottom:8px;
}


.order-top p{

    color:#6b7280;

    font-size:14px;
}


.order-top p b{

    color:#2563eb;
}


.order-id{

    background:#eaf1ff;

    color:#2563eb;

    font-size:15px;

    font-weight:bold;

    padding:10px 14px;

    border-radius:12px;

    white-space:nowrap;
}


/* DATA */
/*
.data-container{

    display:grid;

    grid-template-columns:repeat(2,1fr);

    gap:15px;

    margin-top:20px;
}


.data-box{

    background:#f7f9fc;

    border-radius:15px;

    padding:15px 17px;

    min-width:0;

    border:1px solid #edf0f5;
}


.data-label{

    display:block;

    color:#737b87;

    font-size:14px;

    margin-bottom:7px;

    text-transform:capitalize;

    word-break:break-word;
}


.data-value{

    display:block;

    color:#1f2937;

    font-size:18px;

    word-break:break-word;

}


/* NESTED OBJECT */
/*
.nested-box{

    grid-column:1 / -1;

    background:#eef5ff;

    border-left:4px solid #2563eb;

}


.nested-data{

    display:grid;

    grid-template-columns:repeat(2,1fr);

    gap:12px;

    margin-top:10px;
}


.nested-data .data-box{

    background:#ffffff;

}


/* EMPTY */
/*
.empty{

    background:#ffffff;

    padding:40px 20px;

    border-radius:22px;

    text-align:center;

    color:#6b7280;

    box-shadow:0 8px 25px rgba(0,0,0,0.06);
}


/* MOBILE */
/*
@media(max-width:600px){

    body{

        padding:18px 12px;
    }


    .page-title h1{

        font-size:25px;
    }


    .order-card{

        padding:18px;

        border-radius:20px;
    }


    .order-top{

        align-items:flex-start;
    }


    .order-top h2{

        font-size:21px;
    }


    .order-id{

        font-size:13px;

        padding:8px 10px;
    }


    .data-container{

        grid-template-columns:1fr;

        gap:12px;
    }


    .nested-data{

        grid-template-columns:1fr;
    }


    .data-value{

        font-size:17px;
    }

}

</style>

</head>


<body>


<div class="container">


    <div class="page-title">

        <h1>My Orders</h1>

        <p>Order details and payment information</p>

    </div>


    ${
        cards ||
        `
        <div class="empty">
            No orders found.
        </div>
        `
    }


</div>


</body>

</html>
    `);
});


/*
app.get("/sendorder", checkLogin, async (req, res) => {

    const orders = await CustomerOrder.find({
        sessionId: req.session.email
    });

    let cards = "";

    for (const order of orders) {

        cards += `
            <div class="order-card">

                <div class="top">
                    <h2>${order.name}</h2>
                    <span>${order.orderId}</span>
                </div>

                <div class="details">

                    <div>
                        <small>Product ID</small>
                        <strong>${order.productId}</strong>
                    </div>

                    <div>
                        <small>Price</small>
                        <strong>₹${order.price}</strong>
                    </div>

                    <div>
                        <small>Stock</small>
                        <strong>${order.stock}</strong>
                    </div>

                    <div>
                        <small>Category</small>
                        <strong>${order.category}</strong>
                    </div>

                    <div>
                        <small>Brand</small>
                        <strong>${order.brand}</strong>
                    </div>

                </div>

            </div>
        `;
    }

    res.send(`
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>My Orders</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:Arial,sans-serif;
    background:#f4f6f8;
    padding:20px;
}

.container{
    max-width:600px;
    margin:auto;
}

.title{
    font-size:24px;
    margin-bottom:18px;
    color:#222;
}

.order-card{
    background:white;
    border-radius:16px;
    padding:18px;
    margin-bottom:15px;
    box-shadow:0 4px 15px rgba(0,0,0,0.08);
}

.top{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
    padding-bottom:15px;
    border-bottom:1px solid #eee;
}

.top h2{
    font-size:19px;
    color:#222;
}

.top span{
    background:#eef3ff;
    color:#315ee7;
    padding:6px 9px;
    border-radius:7px;
    font-size:12px;
    font-weight:bold;
}

.details{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:12px;
    margin-top:15px;
}

.details div{
    background:#f7f8fa;
    padding:11px;
    border-radius:9px;
}

.details small{
    display:block;
    color:#777;
    font-size:11px;
    margin-bottom:5px;
}

.details strong{
    display:block;
    color:#222;
    font-size:14px;
    word-break:break-word;
}

</style>

</head>

<body>

<div class="container">

    <div class="title">
        My Orders
    </div>

    ${cards}

</div>

</body>
</html>
    `);
});


*/





/*app.get("/sendorder", checkLogin, async (req, res) => {

    const orders = await CustomerOrder.find({
        sessionId: req.session.email
    }).lean();


    // MongoDB ke kisi bhi document ke fields ko automatically display karega
    function renderData(obj) {

        let html = "";

        for (const [key, value] of Object.entries(obj)) {

            // Ye fields customer ko nahi dikhani
            if (
                key === "_id" ||
                key === "__v" ||
                key === "sessionId"
            ) {
                continue;
            }


            // Agar value ek nested object hai
            if (
                value &&
                typeof value === "object" &&
                !Array.isArray(value)
            ) {

                html += `
                    <div class="data-box nested-box">

                        <div class="data-label">
                            ${key}
                        </div>

                        <div class="nested-data">
                            ${renderData(value)}
                        </div>

                    </div>
                `;

            } else {

                html += `
                    <div class="data-box">

                        <span class="data-label">
                            ${key}
                        </span>

                        <strong class="data-value">
                            ${value ?? "N/A"}
                        </strong>

                    </div>
                `;
            }
        }

        return html;
    }


    let cards = "";


    for (const order of orders) {

        cards += `
            <div class="order-card">

                <div class="order-top">

                    <div>

                        <h2>
                            ${
                                order.serviceName ||
                                order.name ||
                                "Order Details"
                            }
                        </h2>

                        <p>
                            Product ID:
                            <b>
                                ${order.productId || "N/A"}
                            </b>
                        </p>

                    </div>


                    <span class="order-id">
                        ${order.orderId || "N/A"}
                    </span>

                </div>


                <div class="data-container">

                    ${renderData(order)}

                </div>

            </div>
        `;
    }


    res.send(`

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>My Orders</title>


<style>

/* =========================
   RESET
========================= */
/*
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


/* =========================
   BODY
========================= */
/*
body {

    font-family: Arial, sans-serif;

    background:
        linear-gradient(
            135deg,
            #eef4ff,
            #f8fafc,
            #edf3ff
        );

    min-height: 100vh;

    padding: 20px 14px;

    color: #1f2937;
}


/* =========================
   CONTAINER
========================= */
/*
.container {

    width: 100%;

    max-width: 850px;

    margin: auto;
}


/* =========================
   PAGE TITLE
========================= */
/*
.page-title {

    text-align: center;

    margin-bottom: 25px;
}


.page-title h1 {

    font-size: 30px;

    color: #2563eb;

    margin-bottom: 6px;
}


.page-title p {

    color: #6b7280;

    font-size: 15px;
}


/* =========================
   ORDER CARD
========================= */
/*
.order-card {

    background: #ffffff;

    border-left: 6px solid #2563eb;

    border-radius: 22px;

    padding: 24px;

    margin-bottom: 24px;

    box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.08);
}


/* =========================
   ORDER TOP
========================= */
/*
.order-top {

    display: flex;

    justify-content: space-between;

    align-items: center;

    gap: 15px;

    padding-bottom: 18px;

    border-bottom: 1px solid #e5e7eb;
}


.order-top h2 {

    font-size: 24px;

    color: #111827;

    margin-bottom: 7px;
}


.order-top p {

    font-size: 14px;

    color: #6b7280;
}


.order-top p b {

    color: #2563eb;
}


/* =========================
   ORDER ID
========================= */
/*
.order-id {

    background: #edf3ff;

    color: #2563eb;

    padding: 9px 13px;

    border-radius: 11px;

    font-size: 14px;

    font-weight: bold;

    white-space: nowrap;
}


/* =========================
   DATA CONTAINER
========================= */
/*
.data-container {

    display: grid;

    grid-template-columns: repeat(2, 1fr);

    gap: 14px;

    margin-top: 20px;
}


/* =========================
   DATA BOX
========================= */
/*
.data-box {

    background: #f7f9fc;

    border: 1px solid #edf0f5;

    border-radius: 15px;

    padding: 15px 17px;

    min-width: 0;
}


.data-label {

    display: block;

    color: #737b87;

    font-size: 14px;

    margin-bottom: 7px;

    text-transform: capitalize;

    word-break: break-word;
}


.data-value {

    display: block;

    color: #111827;

    font-size: 18px;

    word-break: break-word;
}


/* =========================
   NESTED OBJECT
========================= */
/*
.nested-box {

    grid-column: 1 / -1;

    background: #eef5ff;

    border-left: 4px solid #2563eb;
}


.nested-data {

    display: grid;

    grid-template-columns: repeat(2, 1fr);

    gap: 12px;

    margin-top: 10px;
}


.nested-data .data-box {

    background: #ffffff;
}


/* =========================
   EMPTY
========================= */
/*
.empty {

    background: #ffffff;

    padding: 40px 20px;

    text-align: center;

    border-radius: 20px;

    color: #6b7280;

    box-shadow:
        0 8px 25px rgba(0, 0, 0, 0.07);
}


/* =========================
   MOBILE
========================= */
/*
@media (max-width: 600px) {

    body {
        padding: 15px 10px;
    }


    .page-title h1 {
        font-size: 26px;
    }


    .order-card {

        padding: 18px;

        border-radius: 20px;

        border-left-width: 5px;
    }


    .order-top {

        align-items: flex-start;
    }


    .order-top h2 {

        font-size: 21px;
    }


    .order-id {

        font-size: 12px;

        padding: 8px 10px;
    }


    .data-container {

        grid-template-columns: 1fr;

        gap: 11px;
    }


    .nested-data {

        grid-template-columns: 1fr;
    }


    .data-value {

        font-size: 17px;
    }
}

</style>

</head>


<body>


<div class="container">


    <div class="page-title">

        <h1>My Orders</h1>

        <p>
            Order details and payment information
        </p>

    </div>


    ${
        cards ||
        `
        <div class="empty">
            No orders found.
        </div>
        `
    }


</div>


</body>

</html>

    `);
});
*/



/*
app.get("/sendorder", checkLogin, async (req, res) => {

    const orders = await CustomerOrder.find({
        sessionId: req.session.email
    }).lean();


    // ==========================================
    // AUTOMATIC DATA RENDER
    // ==========================================

    function renderData(obj) {

        let html = "";

        for (const [key, value] of Object.entries(obj)) {

            // Ye fields customer ko nahi dikhani
            if (
                key === "_id" ||
                key === "__v" ||
                key === "sessionId"
            ) {
                continue;
            }


            // ==================================
            // STATUS COLOR
            // ==================================

            let statusClass = "";

            if (key === "orderStatus") {

                const status = String(value).toLowerCase();

                if (status === "pending") {
                    statusClass = "status-pending";
                }

                else if (status === "confirmed") {
                    statusClass = "status-confirmed";
                }

                else if (status === "working") {
                    statusClass = "status-working";
                }

                else if (status === "completed") {
                    statusClass = "status-completed";
                }

                else if (status === "cancelled") {
                    statusClass = "status-cancelled";
                }
            }


            // ==================================
            // NESTED OBJECT
            // ==================================

            if (
                value &&
                typeof value === "object" &&
                !Array.isArray(value)
            ) {

                html += `
                    <div class="data-box nested-box">

                        <div class="data-label">
                            ${key}
                        </div>

                        <div class="nested-data">
                            ${renderData(value)}
                        </div>

                    </div>
                `;

            }

            else {

                html += `
                    <div class="data-box">

                        <span class="data-label">
                            ${key}
                        </span>

                        <strong class="data-value ${statusClass}">
                            ${value ?? "N/A"}
                        </strong>

                    </div>
                `;
            }
        }

        return html;
    }


    // ==========================================
    // CREATE ORDER CARDS
    // ==========================================

    let cards = "";


    for (const order of orders) {

        cards += `

            <div class="order-card">

                <div class="order-top">

                    <div>

                        <h2>
                            ${
                                order.serviceName ||
                                order.name ||
                                "Order Details"
                            }
                        </h2>

                        <p>
                            Product ID:
                            <b>
                                ${order.productId || "N/A"}
                            </b>
                        </p>

                    </div>


                    <span class="order-id">

                        ${order.orderId || "N/A"}

                    </span>

                </div>


                <div class="data-container">

                    ${renderData(order)}

                </div>

            </div>

        `;
    }


    // ==========================================
    // PAGE
    // ==========================================

    res.send(`

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>My Orders</title>


<style>


/* ==========================================
   RESET
========================================== */
/*
* {

    margin: 0;

    padding: 0;

    box-sizing: border-box;
}


/* ==========================================
   BODY
========================================== */
/*
body {

    font-family: Arial, sans-serif;

    background:

        linear-gradient(
            135deg,
            #eef4ff,
            #f8fafc,
            #edf3ff
        );

    min-height: 100vh;

    padding: 20px 14px;

    color: #1f2937;
}


/* ==========================================
   CONTAINER
========================================== */
/*
.container {

    width: 100%;

    max-width: 850px;

    margin: auto;
}


/* ==========================================
   PAGE TITLE
========================================== */
/*
.page-title {

    text-align: center;

    margin-bottom: 25px;
}


.page-title h1 {

    font-size: 30px;

    color: #2563eb;

    margin-bottom: 6px;
}


.page-title p {

    color: #6b7280;

    font-size: 15px;
}


/* ==========================================
   ORDER CARD
========================================== */
/*
.order-card {

    background: #ffffff;

    border-left: 6px solid #2563eb;

    border-radius: 22px;

    padding: 24px;

    margin-bottom: 24px;

    box-shadow:

        0 10px 30px
        rgba(0, 0, 0, 0.08);

    overflow: hidden;
}


/* ==========================================
   ORDER TOP
========================================== */
/*
.order-top {

    display: flex;

    justify-content: space-between;

    align-items: center;

    gap: 15px;

    padding-bottom: 18px;

    border-bottom: 1px solid #e5e7eb;
}


.order-top h2 {

    font-size: 24px;

    color: #111827;

    margin-bottom: 7px;
}


.order-top p {

    font-size: 14px;

    color: #6b7280;
}


.order-top p b {

    color: #2563eb;
}


/* ==========================================
   ORDER ID
========================================== */
/*
.order-id {

    background: #edf3ff;

    color: #2563eb;

    padding: 9px 13px;

    border-radius: 11px;

    font-size: 14px;

    font-weight: bold;

    white-space: nowrap;
}


/* ==========================================
   DATA CONTAINER
========================================== */
/*
.data-container {

    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 14px;

    margin-top: 20px;
}


/* ==========================================
   DATA BOX
========================================== */
/*
.data-box {

    background: #f7f9fc;

    border: 1px solid #edf0f5;

    border-radius: 15px;

    padding: 15px 17px;

    min-width: 0;
}


.data-label {

    display: block;

    color: #737b87;

    font-size: 14px;

    margin-bottom: 7px;

    text-transform: capitalize;

    word-break: break-word;
}


.data-value {

    display: block;

    color: #111827;

    font-size: 18px;

    word-break: break-word;
}


/* ==========================================
   STATUS BADGES
   ONLY STATUS BACKGROUND CHANGES
========================================== */
/*
.status-pending,
.status-confirmed,
.status-working,
.status-completed,
.status-cancelled {

    display: inline-block;

    padding: 6px 12px;

    border-radius: 8px;

    font-size: 15px;

    font-weight: 700;

    width: fit-content;
}


/* Pending */
/*
.status-pending {

    color: #b45309;

    background: #fef3c7;
}


/* Confirmed */
/*
.status-confirmed {

    color: #1d4ed8;

    background: #dbeafe;
}


/* Working */
/*
.status-working {

    color: #6d28d9;

    background: #ede9fe;
}


/* Completed */
/*
.status-completed {

    color: #15803d;

    background: #dcfce7;
}


/* Cancelled */
/*
.status-cancelled {

    color: #b91c1c;

    background: #fee2e2;
}


/* ==========================================
   NESTED OBJECT
========================================== */
/*
.nested-box {

    grid-column: 1 / -1;

    background: #eef5ff;

    border-left: 4px solid #2563eb;
}


.nested-data {

    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 12px;

    margin-top: 10px;
}


.nested-data .data-box {

    background: #ffffff;
}


/* ==========================================
   EMPTY
========================================== */
/*
.empty {

    background: #ffffff;

    padding: 40px 20px;

    text-align: center;

    border-radius: 20px;

    color: #6b7280;

    box-shadow:

        0 8px 25px
        rgba(0, 0, 0, 0.07);
}


/* ==========================================
   MOBILE
========================================== */
/*
@media (max-width: 600px) {

    body {

        padding: 15px 10px;
    }


    .page-title h1 {

        font-size: 26px;
    }


    .order-card {

        padding: 18px;

        border-radius: 20px;

        border-left-width: 5px;
    }


    .order-top {

        align-items: flex-start;
    }


    .order-top h2 {

        font-size: 21px;
    }


    .order-id {

        font-size: 12px;

        padding: 8px 10px;
    }


    .data-container {

        grid-template-columns: 1fr;

        gap: 11px;
    }


    .nested-data {

        grid-template-columns: 1fr;
    }


    .data-value {

        font-size: 17px;
    }


    .status-pending,
    .status-confirmed,
    .status-working,
    .status-completed,
    .status-cancelled {

        font-size: 14px;

        padding: 5px 10px;
    }

}

</style>

</head>


<body>


<div class="container">


    <div class="page-title">

        <h1>My Orders</h1>

        <p>
            Order details and payment information
        </p>

    </div>


    ${
        cards ||

        `
        <div class="empty">

            No orders found.

        </div>
        `
    }


</div>


</body>

</html>

    `);

});

*/



/*


app.get("/sendorder", checkLogin, async (req, res) => {

    const orders = await CustomerOrder.find({
        sessionId: req.session.email
    }).lean();


    // ==========================================
    // STATUS CLASS
    // ==========================================

    function getStatusClass(value) {

        const status = String(value).toLowerCase();

        if (status === "pending") {
            return "status-pending";
        }

        if (status === "confirmed") {
            return "status-confirmed";
        }

        if (status === "working") {
            return "status-working";
        }

        if (status === "completed") {
            return "status-completed";
        }

        if (status === "cancelled") {
            return "status-cancelled";
        }

        return "";
    }


    // ==========================================
    // AUTOMATIC DATA RENDER
    // ==========================================

    function renderData(obj) {

        let html = "";

        for (const [key, value] of Object.entries(obj)) {

            // Hidden fields
            if (
                key === "_id" ||
                key === "__v" ||
                key === "sessionId"
            ) {
                continue;
            }


            // ==================================
            // NESTED OBJECT
            // ==================================

            if (
                value &&
                typeof value === "object" &&
                !Array.isArray(value)
            ) {

                html += `
                    <div class="data-box nested-box">

                        <div class="data-label">
                            ${key}
                        </div>

                        <div class="nested-data">

                            ${renderData(value)}

                        </div>

                    </div>
                `;

            }

            else {

                // Key ke naam mein "status" ho
                // to uska status color lagao

                const isStatus =
                    key.toLowerCase().includes("status");

                const statusClass =
                    isStatus
                        ? getStatusClass(value)
                        : "";


                html += `
                    <div class="data-box">

                        <span class="data-label">
                            ${key}
                        </span>

                        <strong
                            class="data-value ${statusClass}">
                            ${value ?? "N/A"}
                        </strong>

                    </div>
                `;
            }
        }

        return html;
    }


    // ==========================================
    // ORDER CARDS
    // ==========================================

    let cards = "";


    for (const order of orders) {

        cards += `

            <div class="order-card">

                <div class="order-top">

                    <div>

                        <h2>
                            ${
                                order.serviceName ||
                                order.name ||
                                "Order Details"
                            }
                        </h2>

                        <p>
                            Product ID:
                            <b>
                                ${order.productId || "N/A"}
                            </b>
                        </p>

                    </div>


                    <span class="order-id">
                        ${order.orderId || "N/A"}
                    </span>

                </div>


                <div class="data-container">

                    ${renderData(order)}

                </div>

            </div>

        `;
    }


    // ==========================================
    // PAGE
    // ==========================================

    res.send(`

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>My Orders</title>


<style>

/* ==========================================
   RESET
========================================== */
/*
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


/* ==========================================
   BODY
========================================== */
/*
body {

    font-family: Arial, sans-serif;

    background:
        linear-gradient(
            135deg,
            #eef4ff,
            #f8fafc,
            #edf3ff
        );

    min-height: 100vh;

    padding: 20px 14px;

    color: #1f2937;
}


/* ==========================================
   CONTAINER
========================================== */
/*
.container {

    width: 100%;

    max-width: 850px;

    margin: auto;
}


/* ==========================================
   TITLE
========================================== */
/*
.page-title {

    text-align: center;

    margin-bottom: 25px;
}


.page-title h1 {

    font-size: 30px;

    color: #2563eb;

    margin-bottom: 6px;
}


.page-title p {

    color: #6b7280;

    font-size: 15px;
}


/* ==========================================
   ORDER CARD
========================================== */
/*
.order-card {

    background: #ffffff;

    border-left: 6px solid #2563eb;

    border-radius: 22px;

    padding: 24px;

    margin-bottom: 24px;

    box-shadow:
        0 10px 30px
        rgba(0, 0, 0, 0.08);
}


/* ==========================================
   ORDER TOP
========================================== */
/*
.order-top {

    display: flex;

    justify-content: space-between;

    align-items: center;

    gap: 15px;

    padding-bottom: 18px;

    border-bottom: 1px solid #e5e7eb;
}


.order-top h2 {

    font-size: 24px;

    color: #111827;

    margin-bottom: 7px;
}


.order-top p {

    font-size: 14px;

    color: #6b7280;
}


.order-top p b {

    color: #2563eb;
}


/* ==========================================
   ORDER ID
========================================== */
/*
.order-id {

    background: #edf3ff;

    color: #2563eb;

    padding: 9px 13px;

    border-radius: 11px;

    font-size: 14px;

    font-weight: bold;

    white-space: nowrap;
}


/* ==========================================
   DATA
========================================== */
/*
.data-container {

    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 14px;

    margin-top: 20px;
}


.data-box {

    background: #f7f9fc;

    border: 1px solid #edf0f5;

    border-radius: 15px;

    padding: 15px 17px;

    min-width: 0;
}


.data-label {

    display: block;

    color: #737b87;

    font-size: 14px;

    margin-bottom: 7px;

    text-transform: capitalize;

    word-break: break-word;
}


.data-value {

    display: inline-block;

    color: #111827;

    font-size: 18px;

    word-break: break-word;
}


/* ==========================================
   STATUS BADGES
========================================== */
/*
.status-pending,
.status-confirmed,
.status-working,
.status-completed,
.status-cancelled {

    padding: 6px 12px;

    border-radius: 8px;

    font-size: 15px;

    font-weight: 700;

    width: fit-content;
}


/* Pending */
/*
.status-pending {

    color: #b45309;

    background: #fef3c7;
}


/* Confirmed */
/*
.status-confirmed {

    color: #1d4ed8;

    background: #dbeafe;
}


/* Working */
/*
.status-working {

    color: #6d28d9;

    background: #ede9fe;
}


/* Completed */
/*
.status-completed {

    color: #15803d;

    background: #dcfce7;
}


/* Cancelled */
/*
.status-cancelled {

    color: #b91c1c;

    background: #fee2e2;
}


/* ==========================================
   NESTED OBJECT
========================================== */
/*
.nested-box {

    grid-column: 1 / -1;

    background: #eef5ff;

    border-left: 4px solid #2563eb;
}


.nested-data {

    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 12px;

    margin-top: 10px;
}


.nested-data .data-box {

    background: #ffffff;
}


/* ==========================================
   EMPTY
========================================== */
/*
.empty {

    background: #ffffff;

    padding: 40px 20px;

    text-align: center;

    border-radius: 20px;

    color: #6b7280;

    box-shadow:
        0 8px 25px
        rgba(0, 0, 0, 0.07);
}


/* ==========================================
   MOBILE
========================================== */
/*
@media (max-width: 600px) {

    body {
        padding: 15px 10px;
    }


    .page-title h1 {
        font-size: 26px;
    }


    .order-card {
        padding: 18px;
        border-radius: 20px;
        border-left-width: 5px;
    }


    .order-top {
        align-items: flex-start;
    }


    .order-top h2 {
        font-size: 21px;
    }


    .order-id {
        font-size: 12px;
        padding: 8px 10px;
    }


    .data-container {
        grid-template-columns: 1fr;
        gap: 11px;
    }


    .nested-data {
        grid-template-columns: 1fr;
    }


    .data-value {
        font-size: 17px;
    }


    .status-pending,
    .status-confirmed,
    .status-working,
    .status-completed,
    .status-cancelled {

        font-size: 14px;

        padding: 5px 10px;
    }

}

</style>

</head>


<body>

<div class="container">

    <div class="page-title">

        <h1>My Orders</h1>

        <p>
            Order details and payment information
        </p>

    </div>


    ${
        cards ||
        `
        <div class="empty">
            No orders found.
        </div>
        `
    }

</div>

</body>

</html>

    `);

});

*/

/*Usable data*/
/*

app.get("/sendorder", checkLogin, async (req, res) => {

    const orders = await CustomerOrder.find({
        sessionId: req.session.email
    }).lean();


    // ==========================================
    // STATUS CLASS
    // ==========================================

    function getStatusClass(value) {

        const status = String(value).toLowerCase();

        if (status === "pending") {
            return "status-pending";
        }

        if (status === "confirmed") {
            return "status-confirmed";
        }

        if (status === "working") {
            return "status-working";
        }

        if (status === "completed") {
            return "status-completed";
        }

        if (status === "cancelled") {
            return "status-cancelled";
        }

        return "";
    }


    // ==========================================
    // AUTOMATIC DATA RENDER
    // ==========================================

    function renderData(obj) {

        let html = "";

        for (const [key, value] of Object.entries(obj)) {

            // Hidden fields
            if (
                key === "_id" ||
                key === "__v" ||
                key === "sessionId"
            ) {
                continue;
            }


            // ==================================
            // NESTED OBJECT
            // ==================================

            if (
                value &&
                typeof value === "object" &&
                !Array.isArray(value)
            ) {

                html += `
                    <div class="data-box nested-box">

                        <div class="data-label">
                            ${key}
                        </div>

                        <div class="nested-data">
                            ${renderData(value)}
                        </div>

                    </div>
                `;

            }

            else {

                const isStatus =
                    key.toLowerCase().includes("status");

                const statusClass =
                    isStatus
                        ? getStatusClass(value)
                        : "";


                html += `
                    <div class="data-box">

                        <span class="data-label">
                            ${key}
                        </span>

                        <strong
                            class="data-value ${statusClass}">
                            ${value ?? "N/A"}
                        </strong>

                    </div>
                `;
            }
        }

        return html;
    }


    // ==========================================
    // ORDER CARDS
    // ==========================================

    let cards = "";


    for (const order of orders) {

        cards += `

            <div class="order-card">

                <div class="order-top">

                    <div>

                        <h2>
                            ${
                                order.serviceName ||
                                order.name ||
                                "Order Details"
                            }
                        </h2>

                        <p>
                            Product ID:
                            <b>
                                ${order.productId || "N/A"}
                            </b>
                        </p>

                    </div>


                    <span class="order-id">
                        ${order.orderId || "N/A"}
                    </span>

                </div>


                <div class="data-container">

                    ${renderData(order)}

                </div>

            </div>

        `;
    }


    // ==========================================
    // PAGE
    // ==========================================

    res.send(`

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>My Orders</title>


<style>

/* ==========================================
   RESET
========================================== */
/*
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


/* ==========================================
   BODY
========================================== */
/*
body {

    font-family: Arial, sans-serif;

    background:
        linear-gradient(
            135deg,
            #eef4ff,
            #f8fafc,
            #edf3ff
        );

    min-height: 100vh;

    padding: 15px 10px;

    color: #1f2937;
}


/* ==========================================
   CONTAINER
========================================== */
/*
.container {

    width: 100%;

    max-width: 760px;

    margin: auto;
}


/* ==========================================
   TITLE
========================================== */
/*
.page-title {

    text-align: center;

    margin-bottom: 18px;
}


.page-title h1 {

    font-size: 25px;

    color: #2563eb;

    margin-bottom: 4px;
}


.page-title p {

    color: #6b7280;

    font-size: 13px;
}


/* ==========================================
   ORDER CARD
========================================== */
/*
.order-card {

    background: #ffffff;

    border-left: 4px solid #2563eb;

    border-radius: 14px;

    padding: 14px 16px;

    margin-bottom: 15px;

    box-shadow:
        0 5px 18px
        rgba(0, 0, 0, 0.07);
}


/* ==========================================
   ORDER TOP
========================================== */
/*
.order-top {

    display: flex;

    justify-content: space-between;

    align-items: center;

    gap: 10px;

    padding-bottom: 12px;

    border-bottom: 1px solid #e5e7eb;
}


.order-top h2 {

    font-size: 19px;

    color: #111827;

    margin-bottom: 4px;
}


.order-top p {

    font-size: 12px;

    color: #6b7280;
}


.order-top p b {

    color: #2563eb;
}


/* ==========================================
   ORDER ID
========================================== */
/*
.order-id {

    background: #edf3ff;

    color: #2563eb;

    padding: 6px 9px;

    border-radius: 8px;

    font-size: 11px;

    font-weight: bold;

    white-space: nowrap;
}


/* ==========================================
   DATA
========================================== */
/*
.data-container {

    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 9px;

    margin-top: 13px;
}


.data-box {

    background: #f7f9fc;

    border: 1px solid #edf0f5;

    border-radius: 10px;

    padding: 10px 12px;

    min-width: 0;
}


.data-label {

    display: block;

    color: #737b87;

    font-size: 11px;

    margin-bottom: 4px;

    text-transform: capitalize;

    word-break: break-word;
}


.data-value {

    display: inline-block;

    color: #111827;

    font-size: 14px;

    word-break: break-word;
}


/* ==========================================
   STATUS BADGES
========================================== */
/*
.status-pending,
.status-confirmed,
.status-working,
.status-completed,
.status-cancelled {

    padding: 5px 9px;

    border-radius: 7px;

    font-size: 13px;

    font-weight: 700;

    width: fit-content;
}


/* Pending */
/*
.status-pending {

    color: #b45309;

    background: #fef3c7;
}


/* Confirmed */
/*
.status-confirmed {

    color: #1d4ed8;

    background: #dbeafe;
}


/* Working */
/*
.status-working {

    color: #6d28d9;

    background: #ede9fe;
}


/* Completed */
/*
.status-completed {

    color: #15803d;

    background: #dcfce7;
}


/* Cancelled */
/*
.status-cancelled {

    color: #b91c1c;

    background: #fee2e2;
}


/* ==========================================
   NESTED OBJECT
========================================== */
/*
.nested-box {

    grid-column: 1 / -1;

    background: #eef5ff;

    border-left: 3px solid #2563eb;
}


.nested-data {

    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 8px;

    margin-top: 7px;
}


.nested-data .data-box {

    background: #ffffff;
}


/* ==========================================
   EMPTY
========================================== */
/*
.empty {

    background: #ffffff;

    padding: 30px 18px;

    text-align: center;

    border-radius: 15px;

    color: #6b7280;

    box-shadow:
        0 6px 20px
        rgba(0, 0, 0, 0.06);
}


/* ==========================================
   MOBILE
========================================== */
/*
@media (max-width: 600px) {

    body {

        padding: 12px 8px;
    }


    .page-title {

        margin-bottom: 16px;
    }


    .page-title h1 {

        font-size: 23px;
    }


    .page-title p {

        font-size: 12px;
    }


    .order-card {

        padding: 13px;

        border-radius: 14px;

        border-left-width: 4px;

        margin-bottom: 12px;
    }


    .order-top {

        gap: 8px;

        align-items: flex-start;
    }


    .order-top h2 {

        font-size: 17px;
    }


    .order-top p {

        font-size: 11px;
    }


    .order-id {

        font-size: 10px;

        padding: 5px 7px;

        border-radius: 7px;
    }


    .data-container {

        grid-template-columns: 1fr;

        gap: 7px;

        margin-top: 10px;
    }


    .data-box {

        padding: 9px 10px;

        border-radius: 9px;
    }


    .data-label {

        font-size: 10px;

        margin-bottom: 3px;
    }


    .data-value {

        font-size: 13px;
    }


    .nested-data {

        grid-template-columns: 1fr;

        gap: 7px;
    }


    .status-pending,
    .status-confirmed,
    .status-working,
    .status-completed,
    .status-cancelled {

        font-size: 12px;

        padding: 4px 8px;
    }

}

</style>

</head>


<body>

<div class="container">

    <div class="page-title">

        <h1>My Orders</h1>

        <p>
            Order details and payment information
        </p>

    </div>


    ${cards ||
        `
        <div class="empty">
            No orders found.
        </div>
        `
    }

</div>

</body>

</html>

    `);

});

*/
/*
app.get("/logout", checkLogin, async (req, res) => {

    req.session.destroy();

    res.send(`

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>Logout</title>


<style>

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


body {

    min-height: 100vh;

    display: flex;

    justify-content: center;

    align-items: center;

    background: #f3f4f6;

    font-family: Arial, sans-serif;
}


.box {

    background: white;

    padding: 25px;

    width: 90%;

    max-width: 330px;

    text-align: center;

    border-radius: 14px;

    box-shadow:
        0 5px 20px
        rgba(0,0,0,.1);
}


h2 {

    margin-bottom: 18px;

    color: #222;
}


button {

    width: 100%;

    padding: 11px;

    border: 0;

    border-radius: 8px;

    background: #222;

    color: white;

    font-size: 14px;

    cursor: pointer;
}

</style>

</head>


<body>

<div class="box">

    <h2>
        Logout Successful
    </h2>

    <button
        onclick="history.back(); setTimeout(() => location.reload(), 500)">
        Back
    </button>

</div>

</body>

</html>

    `);

});

*/



app.get("/sendorder", checkLogin, async (req, res) => {

    const orders = await CustomerOrder.find({
        sessionId: req.session.email
    }).lean();


    // ==========================================
    // STATUS CLASS
    // ==========================================

    function getStatusClass(value) {

        const status = String(value).toLowerCase();

        if (status === "pending") return "status-pending";
        if (status === "confirmed") return "status-confirmed";
        if (status === "working") return "status-working";
        if (status === "completed") return "status-completed";
        if (status === "cancelled") return "status-cancelled";

        return "";
    }


    // ==========================================
    // AUTOMATIC DATA RENDER
    // ==========================================

    function renderData(obj) {

        let html = "";

        for (const [key, value] of Object.entries(obj)) {

            if (
                key === "_id" ||
                key === "__v" ||
                key === "sessionId"
            ) {
                continue;
            }


            // ==================================
            // NESTED OBJECT
            // ==================================

            if (
                value &&
                typeof value === "object" &&
                !Array.isArray(value)
            ) {

                html += `
                    <div class="data-box nested-box">

                        <div class="data-label">
                            ${key}
                        </div>

                        <div class="nested-data">
                            ${renderData(value)}
                        </div>

                    </div>
                `;

            } else {

                const isStatus =
                    key.toLowerCase().includes("status");

                const statusClass =
                    isStatus
                        ? getStatusClass(value)
                        : "";


                html += `
                    <div class="data-box">

                        <span class="data-label">
                            ${key}
                        </span>

                        <strong class="data-value ${statusClass}">
                            ${value ?? "N/A"}
                        </strong>

                    </div>
                `;
            }
        }

        return html;
    }


    // ==========================================
    // ORDER CARDS
    // ==========================================

    let cards = "";


    for (const order of orders) {

        cards += `

            <div class="order-card">

                <div class="order-top">

                    <div class="title-area">

                        <h2>
                            ${
                                order.serviceName ||
                                order.name ||
                                "Order Details"
                            }
                        </h2>

                        <p>
                            Product ID:
                            <b>
                                ${order.productId || "N/A"}
                            </b>
                        </p>

                    </div>


                    <span class="order-id">
                        ${order.orderId || "N/A"}
                    </span>

                </div>


                <div class="data-container">

                    ${renderData(order)}

                </div>

            </div>

        `;
    }


    // ==========================================
    // PAGE
    // ==========================================

    res.send(`

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>My Orders</title>


<style>

/* ==========================================
   RESET
========================================== */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


/* ==========================================
   BODY
========================================== */

body {

    font-family: Arial, sans-serif;

    background:
        linear-gradient(
            135deg,
            #eef4ff,
            #f8fafc,
            #edf3ff
        );

    min-height: 100vh;

    padding: 18px 12px;

    color: #1f2937;
}


/* ==========================================
   CONTAINER
========================================== */

.container {

    width: 100%;

    max-width: 900px;

    margin: auto;
}


/* ==========================================
   PAGE TITLE
========================================== */

.page-title {

    text-align: center;

    margin-bottom: 16px;
}


.page-title h1 {

    font-size: 24px;

    color: #2563eb;

    margin-bottom: 3px;
}


.page-title p {

    color: #6b7280;

    font-size: 12px;
}


/* ==========================================
   ORDER CARD
========================================== */

.order-card {

    background: #ffffff;

    border-left: 4px solid #2563eb;

    border-radius: 14px;

    padding: 13px;

    margin-bottom: 13px;

    box-shadow:
        0 5px 18px
        rgba(0, 0, 0, 0.07);
}


/* ==========================================
   ORDER TOP
========================================== */

.order-top {

    display: flex;

    justify-content: space-between;

    align-items: center;

    gap: 8px;

    padding-bottom: 10px;

    border-bottom: 1px solid #e5e7eb;
}


.title-area {

    min-width: 0;
}


.order-top h2 {

    font-size: 18px;

    color: #111827;

    margin-bottom: 3px;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;
}


.order-top p {

    font-size: 11px;

    color: #6b7280;
}


.order-top p b {

    color: #2563eb;
}


/* ==========================================
   ORDER ID
========================================== */

.order-id {

    background: #edf3ff;

    color: #2563eb;

    padding: 5px 8px;

    border-radius: 7px;

    font-size: 10px;

    font-weight: bold;

    white-space: nowrap;
}


/* ==========================================
   DATA CONTAINER
========================================== */

.data-container {

    display: grid;

    grid-template-columns:
        repeat(3, 1fr);

    gap: 7px;

    margin-top: 10px;
}


/* ==========================================
   DATA BOX
========================================== */

.data-box {

    background: #f7f9fc;

    border: 1px solid #edf0f5;

    border-radius: 9px;

    padding: 9px 10px;

    min-width: 0;

    overflow: hidden;
}


.data-label {

    display: block;

    color: #737b87;

    font-size: 10px;

    margin-bottom: 3px;

    text-transform: capitalize;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;
}


.data-value {

    display: block;

    color: #111827;

    font-size: 13px;

    line-height: 1.2;

    word-break: break-word;
}


/* ==========================================
   STATUS
========================================== */

.status-pending,
.status-confirmed,
.status-working,
.status-completed,
.status-cancelled {

    display: inline-block;

    width: fit-content;

    padding: 4px 7px;

    border-radius: 6px;

    font-size: 11px;

    font-weight: 700;

    line-height: 1;
}


/* Pending */

.status-pending {

    color: #b45309;

    background: #fef3c7;
}


/* Confirmed */

.status-confirmed {

    color: #1d4ed8;

    background: #dbeafe;
}


/* Working */

.status-working {

    color: #6d28d9;

    background: #ede9fe;
}


/* Completed */

.status-completed {

    color: #15803d;

    background: #dcfce7;
}


/* Cancelled */

.status-cancelled {

    color: #b91c1c;

    background: #fee2e2;
}


/* ==========================================
   NESTED OBJECT
========================================== */

.nested-box {

    grid-column: 1 / -1;

    background: #eef5ff;

    border-left: 3px solid #2563eb;

    padding: 8px;
}


.nested-data {

    display: grid;

    grid-template-columns:
        repeat(3, 1fr);

    gap: 6px;

    margin-top: 6px;
}


.nested-data .data-box {

    background: #ffffff;

    padding: 8px;
}


/* ==========================================
   EMPTY
========================================== */

.empty {

    background: #ffffff;

    padding: 28px 15px;

    text-align: center;

    border-radius: 14px;

    color: #6b7280;

    box-shadow:
        0 5px 18px
        rgba(0, 0, 0, 0.06);
}


/* ==========================================
   TABLET
========================================== */

@media (max-width: 700px) {

    .data-container {

        grid-template-columns:
            repeat(2, 1fr);
    }


    .nested-data {

        grid-template-columns:
            repeat(2, 1fr);
    }
}


/* ==========================================
   MOBILE
========================================== */

@media (max-width: 480px) {

    body {

        padding: 12px 8px;
    }


    .container {

        max-width: 100%;
    }


    .page-title {

        margin-bottom: 13px;
    }


    .page-title h1 {

        font-size: 21px;
    }


    .page-title p {

        font-size: 11px;
    }


    .order-card {

        padding: 10px;

        border-radius: 12px;

        border-left-width: 3px;

        margin-bottom: 10px;
    }


    .order-top {

        padding-bottom: 8px;

        gap: 6px;
    }


    .order-top h2 {

        font-size: 15px;
    }


    .order-top p {

        font-size: 9px;
    }


    .order-id {

        font-size: 9px;

        padding: 4px 6px;
    }


    .data-container {

        grid-template-columns:
            repeat(2, 1fr);

        gap: 6px;

        margin-top: 8px;
    }


    .data-box {

        padding: 7px 8px;

        border-radius: 8px;
    }


    .data-label {

        font-size: 9px;

        margin-bottom: 2px;
    }


    .data-value {

        font-size: 12px;
    }


    .status-pending,
    .status-confirmed,
    .status-working,
    .status-completed,
    .status-cancelled {

        font-size: 10px;

        padding: 4px 6px;
    }


    .nested-data {

        grid-template-columns:
            repeat(2, 1fr);

        gap: 5px;
    }


    .nested-data .data-box {

        padding: 7px;
    }

}

</style>

</head>


<body>

<div class="container">

    <div class="page-title">

        <h1>My Orders</h1>

        <p>
            Order details and payment information
        </p>

    </div>


    ${
        cards ||
        `
        <div class="empty">
            No orders found.
        </div>
        `
    }

</div>

</body>

</html>

    `);

});



/* ==========================================
   LOGOUT
========================================== */

app.get("/logout", checkLogin, async (req, res) => {

    req.session.destroy();

    res.send(`

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>Logout</title>

<style>

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


body {

    min-height: 100vh;

    display: flex;

    justify-content: center;

    align-items: center;

    background: #f3f4f6;

    font-family: Arial, sans-serif;
}


.box {

    background: white;

    padding: 25px;

    width: 90%;

    max-width: 330px;

    text-align: center;

    border-radius: 14px;

    box-shadow:
        0 5px 20px
        rgba(0,0,0,.1);
}


h2 {

    margin-bottom: 18px;

    color: #222;
}


button {

    width: 100%;

    padding: 11px;

    border: 0;

    border-radius: 8px;

    background: #222;

    color: white;

    font-size: 14px;

    cursor: pointer;
}

</style>

</head>


<body>

<div class="box">

    <h2>
        Logout Successful
    </h2>

    <button
        onclick="history.back(); setTimeout(() => location.reload(), 500)">
        Back
    </button>

</div>

</body>

</html>

    `);

});




/*
app.get("/logout", checkLogin,async (req, res) => {
req.session.destroy();
res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Logout</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:#f3f4f6;
    font-family:Arial,sans-serif;
}

.box{
    background:white;
    padding:30px;
    width:90%;
    max-width:350px;
    text-align:center;
    border-radius:15px;
    box-shadow:0 5px 20px rgba(0,0,0,.1);
}

h2{
    margin-bottom:20px;
    color:#222;
}

button{
    width:100%;
    padding:12px;
    border:0;
    border-radius:8px;
    background:#222;
    color:white;
    font-size:15px;
    cursor:pointer;
}
</style>

</head>

<body>

<div class="box">

    <h2>Logout Successful</h2>

    <button onclick="history.back(); setTimeout(() => location.reload(), 500)">
        Back
    </button>

</div>

</body>
</html>`)
});










// second
app.get("/admin/user/:value", async (req, res) => {

    try {

        const value = req.params.value;

        let user = null;

        // ID se
        if (mongoose.Types.ObjectId.isValid(value)) {
            user = await User.findById(value).lean();
        }

        // Email / number se
        if (!user) {
            user = await User.findOne({
                $or: [
                    { email: value },
                    { number: value }
                ]
            }).lean();
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        console.log("USER:", user);

        const orders = await CustomerOrder.find().lean();

        console.log("CUSTOMER ORDERS:", orders);

        return res.json({
            user: user,
            orders: orders
        });

    } catch (error) {

        console.log("ADMIN ERROR:", error);

        return res.status(500).json({
            message: error.message
        });
    }

});


// ===============================
// ADMIN STATS
// ===============================

app.get("/admi", async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalOrders = await CustomerOrder.countDocuments();

        const orders = await CustomerOrder.find();

        let totalRevenue = 0;
        let pendingOrders = 0;

        orders.forEach(order => {

            totalRevenue += Number(
                order.amount ||
                order.price ||
                0
            );

            if (
                order.status === "Pending" ||
                order.status === "Pending Verification"
            ) {
                pendingOrders++;
            }

        });

        res.json({
            totalUsers,
            totalOrders,
            totalRevenue,
            pendingOrders
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Stats error"
        });

    }

});


// ===============================
// SEARCH USER
// ===============================

app.get("/admin/user/:value", async (req, res) => {

    try {

        const value = req.params.value;

        const user = await User.findOne({

            $or: [
                { email: value },
                { number: value }
            ]

        });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        const orders = await CustomerOrder.find({

            $or: [

                { userId: user._id.toString() },

                { userId: user._id },

                { email: user.email },

                { number: user.number }

            ]

        });


        res.json({
            user,
            orders
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "User search error"
        });

    }

});


// ===============================
// UPDATE ORDER STATUS
// ===============================

app.put("/admin/order/:id", async (req, res) => {

    try {

        const { status } = req.body;

        const order =
            await CustomerOrder.findByIdAndUpdate(

                req.params.id,

                {
                    $set: {
                        status: status
                    }
                },

                {
                    new: true
                }

            );

        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }

        res.json({
            message: "Order updated",
            order
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Order update error"
        });

    }

});


// ===============================
// DELETE ORDER
// ===============================

app.delete("/admin/order/:id", async (req, res) => {

    try {

        const order =
            await CustomerOrder.findByIdAndDelete(
                req.params.id
            );

        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }

        res.json({
            message: "Order deleted"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Order delete error"
        });

    }

});



*/


// ------------------- START SERVER -------------------

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



