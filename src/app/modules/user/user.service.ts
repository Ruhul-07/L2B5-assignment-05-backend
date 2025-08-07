import bcryptjs from "bcryptjs";
import AppError from "../../errorHelpers/appError";
import httpStatus from "http-status-codes";
import { User } from "./user.model";
import { envVars } from "../../config/env";
import { IsActive, IUser, Role } from "./user.interface";
import mongoose from "mongoose";
import { WalletServices } from "../wallet/wallet.service";

const createUser = async (payload: Partial<IUser>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { phone, password, ...rest } = payload;

    const isUserExist = await User.findOne({ phone });

    if (isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
    }

    const hashedPassword = await bcryptjs.hash(
      password as string,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const user = await User.create(
      [
        {
          phone,
          password: hashedPassword,
          ...rest,
        },
      ],
      { session }
    );

    // Automatically create wallet for USER and AGENT roles
    if (user[0].role === Role.USER || user[0].role === Role.AGENT) {
      await WalletServices.createWallet(user[0]._id.toString());
    }

    await session.commitTransaction();

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user[0].toObject();

    return userWithoutPassword;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

const approveAgent = async (agentId: string) => {
  const agent = await User.findById(agentId);

  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }

  if (agent.role !== Role.AGENT) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not an agent");
  }

  if (agent.isApproved) {
    throw new AppError(httpStatus.BAD_REQUEST, "Agent is already approved");
  }

  agent.isApproved = true;
  await agent.save();

  return agent;
};

const suspendAgent = async (agentId: string) => {
  const agent = await User.findById(agentId);

  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }

  if (agent.role !== Role.AGENT) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not an agent");
  }

  agent.isApproved = false;
  agent.isActive = IsActive.INACTIVE;
  await agent.save();

  return agent;
};

const getAllAgents = async () => {
  const agents = await User.find({ role: Role.AGENT });
  const totalAgents = await User.countDocuments({ role: Role.AGENT });

  return {
    data: agents,
    meta: {
      total: totalAgents,
    },
  };
};

const getPendingAgents = async () => {
  const pendingAgents = await User.find({
    role: Role.AGENT,
    isApproved: false,
  });

  return {
    data: pendingAgents,
    meta: {
      total: pendingAgents.length,
    },
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
  approveAgent,
  suspendAgent,
  getAllAgents,
  getPendingAgents,
};
