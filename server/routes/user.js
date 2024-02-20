import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secret", (err, decoded) => {
      if (err) {
        return res.json({ token, error: err.message });
      } 
      req.user = decoded;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.get("/", (req, res) => {
  res.send("Hello from user routes!");
});

router.get("/users", verifyToken, (req, res) => {
  prisma.user
    .findMany()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

router.get("/user/:id", (req, res) => {
  const { id } = req.params;
  prisma.user
    .findUnique({
      where: {
        id: parseInt(id),
      },
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

router.post("/register", (req, res) => {
  const { username, password, firstName, lastName, email } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  prisma.user
    .create({
      data: {
        username,
        password: hash,
        firstName,
        lastName,
        email,
      },
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }

    // Ensure that the user object has the expected properties
    if (!user.password) {
      return res
        .status(500)
        .json({ message: "User data is invalid" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }

    const token = jwt.sign({ id: user._id }, "secret");
    res.json({ token, userID: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/user/:id", (req, res) => {
  const { id } = req.params;
  const { username, password, firstName, lastName, email } = req.body;
  prisma.user
    .update({
      where: {
        id: parseInt(id),
      },
      data: {
        username,
        password,
        firstName,
        lastName,
        email,
      },
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

router.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  prisma.user
    .delete({
      where: {
        id: parseInt(id),
      },
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

export { router as userRouter };
