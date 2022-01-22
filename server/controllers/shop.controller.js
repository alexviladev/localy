const Shop = require("../models/shops.model");

const createShop = async (req, res) => {
  try {
    const { products, picture } = req.body;
    const prodArr = products.split(",");
    const pictArr = picture.split(",");
    const shop = await Shop.create({
      ...req.body,
      products: prodArr,
      picture: pictArr,
    });
    res.status(201).send(shop);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "400", message: "Could not create shop" });
  }
};

const addImageToShop = async (req, res) => {
  try {
    const newPicture = req.body.picture;
    const shopId = req.body.shopId;
    const shop = Shop.findOne({
      where: { id: shopId },
    }).then((shop) => {
      shop.sequelize.query(
        `UPDATE "Shops" SET picture='{${[
          shop.picture,
          newPicture,
        ]}}'WHERE id=${shopId}`
      );
    });

    res.status(200).send(shop);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "400", message: "Could not create shop" });
  }
};

const addProductsToShop = async (req, res) => {
  try {
    const { products } = req.body;
    const newProdArr = products.split(",");
    const shopId = req.body.shopId;

    const shop = Shop.findOne({
      where: { id: shopId },
    }).then((shop) => {
      shop.sequelize.query(
        `UPDATE "Shops" SET products='{${[
          shop.products,
          ...newProdArr,
        ]}}'WHERE id=${shopId}`
      );
    });

    res.status(200).send(shop);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "400", message: "Could not create shop" });
  }
};

const removeProduct = async (req, res) => {
  try {
    const productToDelete = req.body.product;
    const shopId = req.body.shopId;
    const shop = Shop.findOne({
      where: { id: shopId },
    }).then((shop) => {
      shop.sequelize.query(
        `UPDATE "Shops" SET products='{${[
          shop.products.filter((product) => product !== productToDelete),
        ]}}'WHERE id=${shopId}`
      );
    });

    res.status(200).send(shop);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "400", message: "Could not create shop" });
  }
};

const deleteShop = async (req, res) => {
  try {
    const shop = Shop.findByPk(req.shopId);
    if (!shop) {
      res.status(404).send({ message: "Shop not found.", error: "404" });
    } else {
      await shop.destroy();
      res.status(202).send({ message: "Shop oblitirated", error: "202" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error: "400",
      message: "Shop too gud to delete, please reconsider.",
    });
  }
};

module.exports = {
  createShop,
  addImageToShop,
  addProductsToShop,
  removeProduct,
  deleteShop,
};
