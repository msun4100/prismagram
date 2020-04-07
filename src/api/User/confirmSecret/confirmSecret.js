import { prisma } from "../../../../generated/prisma-client";
import { generateToken } from "../../../utils";

export default {
  Mutation: {
    confirmSecret: async (_, args) => {
      const { email, secret } = args;
      const user = await prisma.user({ email });
      if (user.loginSecret === secret) {
        // 시크릿 확인되면 삭제
        await prisma.updateUser({
          where: {
            id: user.id,
          },
          data: {
            loginSecret: "",
          },
        });
        return generateToken(user.id); // jwt token
      } else {
        throw Error("Wrong email/secret combination");
      }
    },
  },
};
