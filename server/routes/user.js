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

export const verifyUserOrAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && (req.user.id === req.params.id || req.user.admin === true)) {
      next();
    } else {
      res.sendStatus(403);
    }
  });
};

router.get("/", (req, res) => {
  res.json({ message: "Hello from user routes!" });
});

router.get("/users", verifyToken, verifyAdmin, (req, res) => {
  prisma.user
    .findMany({
      include: { favorites: true, comments: true }
    })
    .then((data) => {
      data.forEach(user => {
        if (!user.favorites) {
          user.favorites = [];
        }
        if (!user.comments) {
          user.comments = [];
        }
      });
      res.json(data);
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

router.get("/user/:id", verifyUserOrAdmin, (req, res) => {
  const { id } = req.params;
  prisma.user
    .findUnique({
      where: {
        id: id,
      },
      include: { favorites: true, comments: true }
    })
    .then((data) => {
      if (!data.favorites) {
        data.favorites = [];
      }
      if (!data.comments) {
        data.comments = [];
      }
      res.json(data);
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

router.get("/profile/:username", (req, res) => {
  const { username } = req.params;
  prisma.user
    .findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        email: true,
        createdAt: true,
        favorites: true,
        comments: true,
      },
    })
    .then((data) => {
      if (!data.favorites) {
        data.favorites = [];
      }
      if (!data.comments) {
        data.comments = [];
      }
      res.json(data);
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

router.post("/register", async (req, res) => {
  const { username, password, firstName, lastName, email } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (existingUser) {
        return res.json({ message: "Username already exists" });
      }

    // verify if email already exists
    try {
      const existingEmail = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      
      if (existingEmail) {
        return res.json({ message: "Email already exists" });
      }

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hash,
        firstName,
        lastName,
        email,
      },
    });
    const token = jwt.sign({ id: newUser.id, admin: newUser.admin }, "secret");
    res.json({ access_token: token, userID: newUser.id, admin: newUser.admin, username: newUser.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
}
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
        .json({ message: "Username or password is incorrect" });
    }

    if (!user.password) {
      return res
        .json({ message: "User data is invalid" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .json({ message: "Username or password is incorrect" });
    }

    const token = jwt.sign({ id: user.id, admin: user.admin }, "secret");
    
    res.json({ access_token: token, userID: user.id, admin: user.admin, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.put("/user/:id", verifyUserOrAdmin, (req, res) => {
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

router.delete("/user/:id", verifyUserOrAdmin, (req, res) => {
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
