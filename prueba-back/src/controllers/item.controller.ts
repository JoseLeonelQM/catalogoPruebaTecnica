import type { Request, Response } from 'express';
import prisma from '../config/prisma';
import { uploadAndOptimizeImage } from '../services/image.service';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const createItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, description, price, category } = req.body;
    const userId = req.user?.userId;
    const file = req.file; 

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado en el servidor' });
      return;
    }

    if (!name || !description || !price || !category || !file) {
      res.status(400).json({ message: 'Todos los campos y la imagen son obligatorios' });
      return;
    }

    const imageUrl = await uploadAndOptimizeImage(file);

    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        imageUrl,
        userId,
      },
    });

    res.status(201).json({ message: 'Producto creado y optimizado con éxito', item: newItem });
  } catch (error) {
  console.error('ERROR CREATE ITEM:', error);

  res.status(500).json({
    message: 'Error al crear el ítem',
    error,
  });
}
};

export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', search, category } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const whereClause: any = {};

    if (category) {
      whereClause.category = category as string;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [items, totalItems] = await prisma.$transaction([
      prisma.item.findMany({
        where: whereClause,
        skip,
        take: limitNumber,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.item.count({ where: whereClause }),
    ]);

    res.status(200).json({
      items,
      meta: {
        totalItems,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalItems / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los ítems', error });
  }
};

export const updateItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string; 
    const { name, description, price, category } = req.body;
    const userId = req.user?.userId;
    const file = req.file;

    if (!id) {
      res.status(400).json({ message: 'El ID del producto es requerido' });
      return;
    }

    const existingItem = await prisma.item.findUnique({ where: { id } });
    if (!existingItem) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }

    if (existingItem.userId !== userId) {
      res.status(403).json({ message: 'No tienes permisos para modificar este producto' });
      return;
    }

    let imageUrl = existingItem.imageUrl;
    if (file) {
      imageUrl = await uploadAndOptimizeImage(file);
    }

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        name: name || existingItem.name,
        description: description || existingItem.description,
        price: price ? parseFloat(price) : existingItem.price,
        category: category || existingItem.category,
        imageUrl,
      },
    });

    res.status(200).json({ message: 'Producto actualizado con éxito', item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error });
  }
};

export const deleteItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string; 
    const userId = req.user?.userId;

    if (!id) {
      res.status(400).json({ message: 'El ID del producto es requerido' });
      return;
    }

    const existingItem = await prisma.item.findUnique({ where: { id } });
    if (!existingItem) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }

    if (existingItem.userId !== userId) {
      res.status(403).json({ message: 'No tienes permisos para eliminar este producto' });
      return;
    }
    
    await prisma.item.delete({ where: { id } });

    res.status(200).json({ message: 'Producto eliminado correctamente del catálogo' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
};
