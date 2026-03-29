import * as messageService from '../services/message.service.js';
import ApiResponse from '../utils/ApiResponse.js';

export const sendMessage = async (req, res, next) => {
  try {
    const message = await messageService.sendMessage(req.user.id, req.body);
    res.status(201).json(new ApiResponse(201, message, 'Message sent'));
  } catch (err) {
    next(err);
  }
};

export const getConversation = async (req, res, next) => {
  try {
    const messages = await messageService.getConversation(
      req.params.orderId,
      req.user.id
    );
    res.status(200).json(new ApiResponse(200, messages, 'Conversation fetched'));
  } catch (err) {
    next(err);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const data = await messageService.getUnreadCount(req.user.id);
    res.status(200).json(new ApiResponse(200, data, 'Unread count fetched'));
  } catch (err) {
    next(err);
  }
};