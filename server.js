const express = require("express");
const cors = require("cors");
const app = express();
const models = require('./models');
const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/products", (req, res) => {
  models.Product.findAll({//상품정보들 복수개를 조회할때는,
    order : [["createdAt","DESC"]],
    attributes: ["id","name","price","createdAt","seller"],//이정보들만 받겠다.    
  }).then((result)=>{
    console.log("PRODUCTS :",result);
    res.send({
      products:result
    })
  }).catch((error)=>{
    console.log(error);
    res.send("에러발생");
  })
});

app.post("/products", (req, res) => {
  const body = req.body;
  const {name, description, price, seller} = body;
  if(!name || !description || !price || !seller){//방어코드 
    res.send("모든필드를 입력해주세요");
  }
  models.Product.create({
    name,
    description,
    price,
    seller
  }).then((result)=>{
    console.log("상품 생성결과 :",result);
    res.send({
      result,
    })
  }).catch((error)=>{
    console.log(error);
    res.send("상품 업로드에 문제가 발생했습니다.");
  })
});

app.get("/products/:id",(req,res)=>{
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    where: {
      id: id,
    },
  }).then((result)=>{
    console.log("PRODUCT :",result);
    res.send({
      product : result
    });
  }).catch((error)=>{
    console.log(error);
    res.send("상품 조회에 에러가 발생했습니다.");
  });
});

app.listen(port, () => {
  console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다");
  models.sequelize.sync().then(()=>{
    console.log('DB 연결 성공!');
  }).catch((err)=>{
    console.log(err);
    console.log('DB 연결 에러');
    process.exit();//종료
  })
});