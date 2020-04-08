import { prisma } from "../../../../generated/prisma-client";

const DELETE = "DELETE";
const EDIT = "EDIT";

export default {
  Mutation: {
    editPost: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { id, caption, location, action } = args;
      const { user } = request;
      const post = await prisma.$exists.post({ id, user: { id: user.id } });
      if (post) {
        if (action === EDIT) {
          return prisma.updatePost({
            data: {
              caption,
              location,
            },
            where: {
              id,
            },
          });
        } else if (action === DELETE) {
          // deletePost Toolkit 확인하면 PostPromise를 리턴. 그래서 nullable 일 필요가 없음
          return prisma.deletePost({ id });
        } else {
          throw Error("You can't do that without ACTIONS");
        }
      } else {
        throw Error("You can't do that");
      }
    },
  },
};
