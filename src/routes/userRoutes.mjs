import express from "express";

import UserController from "../controller/userController.mjs";

const router = express.Router();
const controller = new UserController();

router.post("/", controller.createUser);
router.get("/:userId", controller.getUserById);
router.put("/:userId", controller.updateUser);
router.patch("/roles/:action", controller.assignOrRemoveRoles);
router.delete("/:userId", controller.deleteUser);
router.get("/", controller.getUsers);

export default router;
