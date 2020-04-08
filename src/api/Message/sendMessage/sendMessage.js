import { prisma } from "../../../../generated/prisma-client";
import { ROOM_FRAGMENT } from "../../../fragments";

export default {
  Mutation: {
    sendMessage: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { roomId, message, toId } = args;
      let room;
      if (roomId === undefined) {
        // room이 없는경우. 맨처음 메시지일 경우 room 생성. connect 배열로 둘다 연결
        if (user.id !== toId) {
          room = await prisma
            .createRoom({
              participants: {
                connect: [{ id: toId }, { id: user.id }],
              },
            })
            .$fragment(ROOM_FRAGMENT);
        }
      } else {
        // 기존 룸이 존재하는경우. toId가 없을 것이기 때문에 getTo를 찾아줌
        room = await prisma.room({ id: roomId }).$fragment(ROOM_FRAGMENT);
      }
      if (!room) {
        throw Error("Room not found");
      }
      const getTo = room.participants.filter(
        (participant) => participant.id !== user.id
      )[0]; // filtered array의 0번째 index.
      return prisma.createMessage({
        text: message,
        from: {
          connect: { id: user.id }, // from === req.user
        },
        to: {
          connect: {
            id: roomId ? getTo.id : toId, // 기존 room이 있는경우는 필터로 얻어온 getTo.id. 최초 메시지인경우 toId
          },
        },
        room: {
          connect: {
            id: room.id,
          },
        },
      });
    },
  },
};
