import { Router } from 'express';
import { createItem, getItems, updateItem, deleteItem } from '../controllers/item.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Públicas
router.get('/', getItems);


// Solo ADMIN
router.post(
  '/',
  authenticateJWT,
  authorize('ADMIN'),
  upload.single('image'),
  createItem
);

router.put(
  '/:id',
  authenticateJWT,
  authorize('ADMIN'),
  upload.single('image'),
  updateItem
);

router.delete(
  '/:id',
  authenticateJWT,
  authorize('ADMIN'),
  deleteItem
);

export default router;