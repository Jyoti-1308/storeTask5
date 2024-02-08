var express = require("express");
var app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
    next();
});
var port = process.env.PORT||2410;

app.listen(port, () => console.log(`Node App listening on port ${port}!`));
let { data } = require("./myStoreData.js");
// console.log(data);
let orders = [], users = [
    { email: "jyoti@gmail.com", password: "jyoti123" }
];
app.get("/product/:id", function (req, res) {
    let id = req.params.id;
    console.log(id);
    let prod = data.find(ele => ele.id === +id);
    // console.log(prod);
    res.send(prod);
});
app.get("/products/:category", function (req, res) {
    let category = req.params.category;
    let newData = data.filter(ele => ele.category === category);
    res.send(newData);
});

app.get("/products", function (req, res) {
    let page = +req.query.page;
    let filterarr = [];
    let search = req.query.search;
    console.log(search);
    let search1 = search && (search[0].toUpperCase() + search.substring(1).toLowerCase());
    console.log(search1);
    if (search) {
        filterarr = data.filter(ele => ele.name.startsWith(search1));
        console.log(filterarr);
    }
    else {
        filterarr = data;
    }
    // console.log(page);

    // console.log(data);
    let respArr = pagination(filterarr, page);
    // console.log("resparr",respArr);
    let len = data.length;
    let quo = Math.floor(len / 18);
    let rem = len % 18;
    //console.log(quo,rem);
    let extra = rem === 0 ? 0 : 1
    let numofpages = quo + extra;


    let pageInfo = { pageNumber: page, numberOfPages: numofpages, numOfItems: respArr.length, totalItemCount: data.length };
    let json = {
        pageInfo: pageInfo,
        data: respArr,

    };
    res.send(json);
});
function pagination(obj, page) {
    let page1 = page ? page : 1;
    var resArr = obj;
    resArr = resArr.slice(page1 * 18 - 18, page1 * 18);
    return resArr;
}
app.post("/products", function (req, res) {
    let body = req.body;
    let maxid = data.reduce((acc, curr) => acc.id >= curr.id ? acc : curr).id;
    let newProd = { id: maxid + 1, ...body };
    data.push(newProd);
    res.send(newProd);
});
app.put("/products/:id", function (req, res) {
    let body = req.body;
    let id = req.params.id;
    let newProd = { id: +id, ...body };
    let index = data.findIndex(ele => ele.id === +id);
    data[index] = newProd
    res.send(newProd);
});
app.delete("/products/:id", function (req, res) {
    let id = req.params.id;
    let index = data.findIndex(ele => ele.id === +id);
    data.splice(index, 1);
    res.send("Product deleted");
});
app.get("/orders", function (req, res) {
    res.send(orders);
});
app.get("/categories", function (req, res) {
    let categories = data.reduce((acc, curr) => {
        console.log(acc);
        let a1 = acc.find(ele => ele === curr.category);
        console.log(a1);
        if (!a1){
            acc.push(curr.category);
        }
        return acc;
    }, []);

    res.send(categories);
});
app.post("/order", function (req, res) {
    let body = req.body;
    console.log(body);
    let maxid = orders.length > 0 ? orders.reduce((acc, curr) => acc.id >= curr.id ? acc : curr).id : 0;
    let newOrder = { id: maxid + 1, ...body };
    orders.push(newOrder);
    res.send(newOrder);
});
app.post("/login", function (req, res) {
    let body = req.body;
    let user = users.find(ele => ele.email === body.email && ele.password === body.password);
    if (user)
        res.send(user);
    else
        res.status(401).send("login failed");
});
app.post("/register", function (req, res) {
    let body = req.body;
    let maxid = orders.length > 0 ? orders.reduce((acc, curr) => acc.id >= curr.id ? acc : curr).id : 0;
    let newOrder = { id: maxid + 1, ...body };
    orders.push(newOrder);
    res.send(newOrder);
});