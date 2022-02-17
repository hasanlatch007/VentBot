import { Prisma, VentMessage } from "@prisma/client";
import prisma from "../../../prisma";

const handleTimer = async (data: VentMessage) => {
  try {
    const exists = await prisma.ventMessage.delete({ where: { id: data.id } });
    if (!exists?.id) {
      // Cancelled
      return;
    }
  } catch (e) {
    if (
      !(e instanceof Prisma.PrismaClientKnownRequestError) ||
      e.code !== "P2025"
    ) {
      console.log("Failed to delete timer entry: ", e);
    }
  }
};

const scheduleTimer = async (data: VentMessage) => {
  const timeDiff = data.createdAt.getTime() - Date.now();
  if (timeDiff <= 0) {
    await handleTimer(data);
  } else {
    setTimeout(() => handleTimer(data), timeDiff);
  }
};

export default scheduleTimer;
