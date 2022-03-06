import { PrismaClient } from '@prisma/client';
import task from '../routes/api/task';
const prisma = new PrismaClient();

export const getTasks = async (req: any, reply: any) => {
  try {
    const { project_id } = req.params;
    const tasks = await prisma.task.findMany({
      where: { project_id: project_id },
      include: { assigned: { select: { first_name: true, last_name: true } } },
    });
    console.log(tasks);
    reply.send(tasks);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const addTask = async (req: any, reply: any) => {
  try {
    console.log(req.body);
    await prisma.task.create({
      data: req.body,
    });
    const tasks = await prisma.task.findMany({
      where: { project_id: req.body.project_id },
      include: { assigned: { select: { first_name: true, last_name: true } } },
    });

    reply.send(tasks);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const updateTask = async (req: any, reply: any) => {
  try {
    const { task_id } = req.params;
    await prisma.task.update({ where: { task_id: task_id }, data: req.body });
    const tasks = await prisma.task.findMany({
      where: { project_id: req.body.project_id },
      include: { assigned: { select: { first_name: true, last_name: true } } },
    });
    reply.send(tasks);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const deleteTask = async (req: any, reply: any) => {
  try {
    console.log(req.body);
    const { project_id } = req.params;

    Promise.all(
      req.body.task_id?.forEach(async (task_id) => {
        await prisma.task.delete({ where: { task_id: task_id } });
      })
    );

    const tasks = await prisma.task.findMany({
      where: { project_id: project_id },
      include: { assigned: { select: { first_name: true, last_name: true } } },
    });
    reply.send(tasks);
  } catch (error) {
    reply.status(500).send(error);
  }
};
