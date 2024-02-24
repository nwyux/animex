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

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.admin === true) {
      next();
    } else {
      res.sendStatus(403);
    }
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.id === req.params.id) {
      next();
    } else {
      res.sendStatus(403);
    }
  });
};

router.get("/", (req, res) => {
  res.send("Hello from user routes!");
});

router.get("/users", verifyToken, verifyAdmin, (req, res) => {
  prisma.user
    .findMany()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

router.get("/user/:id", verifyToken, verifyUser, (req, res) => {
  const { id } = req.params;
  prisma.user
    .findUnique({
      where: {
        id: id,
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
      const token = jwt.sign({ id: data.id, admin: data.admin }, "secret");
      res.json({ access_token: token, userID: data.id, admin: data.admin });
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

    const token = jwt.sign({ id: user.id, admin: user.admin }, "secret");
    
    res.json({ access_token: token, userID: user.id, admin: user.admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.put("/user/:id", verifyToken, verifyUser, (req, res) => {
  const { id } = req.params;
  const { username, password, firstName, lastName, email } = req.body;
  prisma.user
    .update({
      where: {
        id: id,
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

router.delete("/user/:id", verifyToken, verifyUser, (req, res) => {
  const { id } = req.params;
  prisma.user
    .delete({
      where: {
        id: id,
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