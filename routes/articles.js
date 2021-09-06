const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get(`/articles`, async (req, res) => {
  console.log("Using Route : /articles");
  console.log(req.query);
  try {
    const articles = await Article.find().sort({ title: "asc" });

    for (let i = 0; i < articles.length; i++) {
      sortedArticles = articles.sort((a, b) =>
        a.category.toLowerCase().localeCompare(b.category.toLowerCase())
      );
    }
    res.status(200).json(sortedArticles);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.get(`/article/:id`, async (req, res) => {
  console.log("Using Route : /article/:id");
  console.log(req.params.id);
  try {
    const article = await Article.findById(req.params.id);
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// router.post("/article/create", async (req, res) => {
//   console.log("Using route : /article/create");
//   try {
//     const picture = req.files.picture.path;
//     const { title, quantity, price, description, category, subCategory } =
//       req.fields;

//     if (title && quantity && price && description && category && picture) {
//       const result = await cloudinary.uploader.upload(picture, {
//         folder: `/golden-crunchy-snacks/${title}`,
//       });

//       const newArticle = new Article({
//         title: title,
//         quantity: quantity,
//         price: price,
//         description: description,
//         picture: result.url,
//         category: category,

//         subCategory: subCategory,
//       });
//       newArticle.save();
//       res.status(200).json({
//         _id: newArticle._id,
//       });
//     } else {
//       res.status(400).json({ message: "Missing parameter" });
//     }
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

router.put("/article/pay", async (req, res) => {
  console.log("route : /article/pay");
  console.log(req.fields);
  try {
    const article = await Article.findById(req.fields.id);

    article.quantity = article.quantity - req.fields.quantity;
    await article.save();
    res.json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// router.put("/article/update", async (req, res) => {
//   console.log("route : /article/update");
//   const urlCheck = /^((http|https|ftp):\/\/)/;

//   const { id, title, quantity, price, description, category, subCategory } =
//     req.fields;
//   const picture =
//     req.files.picture === undefined
//       ? req.fields.picture
//       : req.files.picture.path;
//   try {
//     if (
//       id &&
//       title &&
//       quantity &&
//       price &&
//       description &&
//       category &&
//       picture
//     ) {
//       if (!urlCheck.test(picture)) {
//         const result = await cloudinary.uploader.upload(picture, {
//           folder: "/golden-crunchy-snacks",
//         });
//         const article = await Article.findById(id);
//         article.title = title;
//         article.quantity = quantity;
//         article.price = price;
//         article.description = description;
//         article.category = category;
//         article.picture = result.url;
//         article.subCategory = subCategory;

//         await article.save();
//         res.json(article);
//       } else {
//         const article = await Article.findById(id);
//         article.title = title;
//         article.quantity = quantity;
//         article.price = price;
//         article.description = description;
//         article.category = category;
//         article.picture = picture;
//         article.subCategory = subCategory;
//         await article.save();
//         res.json(article);
//       }
//     } else {
//       res.status(400).json({ message: "Missing parameter" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(400).json(error);
//   }
// });

router.delete("/article/delete/:id", async (req, res) => {
  console.log("route : /article/delete");
  console.log(req.params);
  try {
    if (req.params.id) {
      await Article.findByIdAndDelete(req.params.id);

      res.json({ message: "Article removed" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Testing

router.put("/article/update", async (req, res) => {
  console.log("route : /article/update");
  const urlCheck = /^((http|https|ftp):\/\/)/;
  let newPicture1 = "";
  let newPicture2 = "";
  let newPicture3 = "";
  let newPicture4 = "";

  const {
    id,
    title,
    quantity,
    price,
    description,
    category,
    subCategory,
    wholeSalePrice,
  } = req.fields;
  console.log(req.fields);

  const picture1 = req.files.picture1
    ? req.files.picture1.path
    : req.fields.picture1;
  const picture2 = req.files.picture2
    ? req.files.picture2.path
    : req.fields.picture2;
  const picture3 = req.files.picture3
    ? req.files.picture3.path
    : req.fields.picture3;
  const picture4 = req.files.picture4
    ? req.files.picture4.path
    : req.fields.picture4;
  try {
    const article = await Article.findById(id);
    if (id && title && quantity && price && description && category) {
      if (picture1) {
        if (!urlCheck.test(picture1)) {
          const result = await cloudinary.uploader.upload(picture1, {
            folder: "/golden-crunchy-snacks",
          });
          newPicture1 = result.url;
        } else {
          newPicture1 = picture1;
        }
      }
      if (picture2) {
        if (!urlCheck.test(picture2)) {
          const result = await cloudinary.uploader.upload(picture2, {
            folder: "/golden-crunchy-snacks",
          });
          newPicture2 = result.url;
        } else {
          newPicture2 = picture2;
        }
      }
      if (picture3) {
        if (!urlCheck.test(picture3)) {
          const result = await cloudinary.uploader.upload(picture3, {
            folder: "/golden-crunchy-snacks",
          });
          newPicture3 = result.url;
        } else {
          newPicture3 = picture3;
        }
      }

      if (picture4) {
        if (!urlCheck.test(picture4)) {
          const result = await cloudinary.uploader.upload(picture4, {
            folder: "/golden-crunchy-snacks",
          });
          newPicture4 = result.url;
        } else {
          newPicture4 = picture4;
        }
      }
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
    article.title = title;
    article.quantity = quantity;
    article.price = price;
    article.description = description;
    article.category = category;
    article.subCategory = subCategory;
    article.wholeSalePrice = wholeSalePrice;
    article.pictures.picture1 = newPicture1;
    article.pictures.picture2 = newPicture2;
    article.pictures.picture3 = newPicture3;
    article.pictures.picture4 = newPicture4;
    await article.save();
    res.status(200).json(article);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.post("/article/create", async (req, res) => {
  console.log("Using route : /article/create");
  console.log(req.files);
  let picture1 = "";
  let picture2 = "";
  let picture3 = "";
  let picture4 = "";

  try {
    const {
      title,
      quantity,
      price,
      description,
      category,
      subCategory,
      wholeSalePrice,
    } = req.fields;

    if (title && quantity && price && description && category) {
      if (req.fields.picture1) {
        picture1 = req.fields.picture1;
      }
      if (req.files.picture1) {
        const result1 = await cloudinary.uploader.upload(
          req.files.picture1.path,
          {
            folder: `/golden-crunchy-snacks/${title}`,
          }
        );
        picture1 = result1.url;
      }
      if (req.files.picture2) {
        const result2 = await cloudinary.uploader.upload(
          req.files.picture2.path,
          {
            folder: `/golden-crunchy-snacks/${title}`,
          }
        );
        picture2 = result2.url;
      }

      if (req.files.picture3) {
        const result3 = await cloudinary.uploader.upload(
          req.files.picture3.path,
          {
            folder: `/golden-crunchy-snacks/${title}`,
          }
        );
        picture3 = result3.url;
      }

      if (req.files.picture4) {
        const result4 = await cloudinary.uploader.upload(
          req.files.picture4.path,
          {
            folder: `/golden-crunchy-snacks/${title}`,
          }
        );
        picture4 = result4.url;
      }

      const newArticle = new Article({
        title: title,
        quantity: quantity,
        price: price,
        description: description,
        wholeSalePrice: wholeSalePrice,
        pictures: {
          picture1: picture1,
          picture2: picture2,
          picture3: picture3,
          picture4: picture4,
        },
        category: category,
        subCategory: subCategory,
      });
      newArticle.save();
      res.status(200).json({
        _id: newArticle._id,
      });
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
