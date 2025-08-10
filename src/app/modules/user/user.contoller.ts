import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All Users Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const approveAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { agentId } = req.params;
    const result = await UserServices.approveAgent(agentId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Agent approved successfully",
      data: result,
    });
  }
);

const suspendAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { agentId } = req.params;
    const result = await UserServices.suspendAgent(agentId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Agent suspended successfully",
      data: result,
    });
  }
);

const getAllAgents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllAgents();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All agents retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getPendingAgents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getPendingAgents();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Pending agents retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUsers,
  approveAgent,
  suspendAgent,
  getAllAgents,
  getPendingAgents,
};
