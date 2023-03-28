const bcrypt = require("bcrypt");
const knex = require("../../../db/db.js");
const jwt = require("jsonwebtoken");
const { USERS, TOKENS } = require("../../constants/tables.js");
const logger = require("simple-node-logger").createSimpleLogger();

module.exports = authService = {
  getUserByEmail: async (email) => {
    return knex(`${USERS}`).select("*").where("email", email).first();
  },

  signUp: async (body) => {
    const { password } = body;
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);
    const user = {
      ...body,
      password: hashPassword,
    };
    return knex(`${USERS}`)
      .insert(user)
      .then(() => {
        return knex(`${USERS}`)
          .select("id", "firstName", "lastName", "email")
          .where("email", body.email)
          .first();
      });
  },

  generateTokens: async (payload) => {
    try {
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
      });

      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFE,
      });

      if (!refreshToken) {
        logger.error("Can't not generate tokens");
        return null;
      }

      const token = await knex(`${TOKENS}`)
        .where("userId", payload.userId)
        .first();
      if (token) {
        await knex(`${TOKENS}`).where("userId", payload.userId).update({
          refreshToken,
          expiresIn: process.env.REFRESH_TOKEN_LIFE,
          updatedAt: new Date(),
        });
      } else {
        await knex(`${TOKENS}`).insert({
          userId: payload.userId,
          refreshToken,
          expiresIn: process.env.REFRESH_TOKEN_LIFE,
        });
      }

      return { accessToken, refreshToken };
    } catch (error) {
      logger.error(`Error in generate tokens:  + ${error}`);
      return null;
    }
  },

  signOut: async (refreshToken) => {
    const token = await knex(`${TOKENS}`)
      .where("refreshToken", refreshToken)
      .del();

    if (!token) {
      logger.error("Refresh token doesn't exist");
      return null;
    }

    return true;
  },

  refreshToken: async (refreshToken) => {
    try {
      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
      const token =  await knex(`${TOKENS}`).where("refreshToken", refreshToken).first();
      if(!token) {
        return null
      }
      const decoded = jwt.verify(refreshToken, refreshTokenSecret);
      if (!decoded) {
        return null;
      }

      const { userId } = decoded;
      const user = await knex(`${USERS}`).where("id", userId).first();

      if (!user) {
        logger.error("User was not found");
        return null;
      }

      const payload = {
        userId: user.id,
        email: user.email,
      };

      return {
        accessToken: jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: process.env.ACCESS_TOKEN_LIFE,
        }),
      };
    } catch (error) {
      logger.error(error);
      return null;
    }
  },
};
