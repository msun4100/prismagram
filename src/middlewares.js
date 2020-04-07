// express 미들웨어는 아니고 Graphql에서 사용하는 미들웨어

export const isAuthenticated = (request) => {
  if (!request.user) {
    throw Error("You need to log in to perform this action");
  }
  return;
};
