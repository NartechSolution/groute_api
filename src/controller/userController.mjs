import prisma from "../config/prisma.mjs";
import {
  assignOrRemoveRolesSchema,
  getUserByIdSchema,
  updateUserSchema,
} from "../schemas/user.schema.mjs";
import MyError from "../utils/error.mjs";
import { hashPassword } from "../utils/password.mjs";
import response from "../utils/response.mjs";

class UserController {
  async createUser(req, res, next) {
    try {
      const { name, email, password, departmentId } = req.body;

      const oldUser = await prisma.user.findFirst({ where: { email: email } });
      if (oldUser) {
        throw new MyError("User with email already exists", 404);
      }

      const department = await prisma.department.findUnique({
        where: {
          id: departmentId,
        },
      });

      if (!department) {
        throw new MyError("Department not found", 404);
      }

      const hashedPass = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPass,
          departmentId,
        },
      });

      response(res, 201, true, "User created successfully", {
        ...user,
        password: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { error, value } = getUserByIdSchema.validate(req.params);
      if (error) {
        throw new MyError(error.details[0].message, 422);
      }

      const user = await prisma.user.findUnique({
        where: {
          id: value.userId,
        },

        // select is for the fields to be returned
        // select: {
        //   id: true,
        //   name: true,
        //   email: true,
        //   department: true,
        // },

        // include is for the relations
        include: {
          department: true,
          roles: true,
        },
      });

      if (!user) {
        throw new MyError("User not found", 404);
      }

      response(res, 200, true, "User found successfully", user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { error, value } = updateUserSchema.validate(req.body);

      if (error) {
        throw new MyError(error.details[0].message, 422);
      }

      const { userId } = req.params;

      const oldUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!oldUser) {
        throw new MyError("User not found", 404);
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: value,
      });

      response(res, 200, true, "User updated successfully", user);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;
      const user = await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      response(res, 200, true, "User deleted successfully", user);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await prisma.user.findMany();

      response(res, 200, true, "Users fetched successfully", users);
    } catch (error) {
      next(error);
    }
  }

  async assignOrRemoveRoles(req, res, next) {
    try {
      //TODO: 1. Validate schema
      const { error, value } = assignOrRemoveRolesSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 422);
      }

      //TODO: 2. Check if user exists
      const { userId, roleIds } = value;
      const { action } = req.params;

      if (action !== "assign" && action !== "remove") {
        throw new MyError("Invalid action, must be assign or remove", 400);
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new MyError("User not found", 404);
      }

      //TODO: 3. Check if roles exists
      const roles = await prisma.role.findMany({
        where: {
          id: { in: roleIds },
        },
      });

      if (!roles || roles.length !== roleIds.length) {
        throw new MyError("Roles not found", 404);
      }

      //TODO: 4. Assign or remove roles
      let newRoles;
      let message;
      if (action === "assign") {
        //TODO: 4.1. Assign roles
        newRoles = await prisma.user.update({
          where: { id: userId },
          data: { roles: { connect: roleIds.map((id) => ({ id })) } },
        });

        message = "Roles assigned successfully";
      } else {
        //TODO: 4.2. Remove roles
        newRoles = await prisma.user.update({
          where: { id: userId },
          data: { roles: { disconnect: roleIds.map((id) => ({ id })) } },
        });

        message = "Roles removed successfully";
      }

      //TODO: 5. Return response
      response(res, 200, true, message, newRoles);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
