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
    const file = req.file; // Aquí atrapamos el archivo gracias a Multer

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado en el servidor' });
      return;
    }

    if (!name || !description || !price || !category || !file) {
      res.status(400).json({ message: 'Todos los campos y la imagen son obligatorios' });
      return;
    }

    // 🔥 Enviamos la imagen a Sharp y luego al Bucket de Supabase
    const imageUrl = await uploadAndOptimizeImage(file);

    // 💾 Guardamos el producto en la base de datos de PostgreSQL usando la URL obtenida
    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        imageUrl, // URL pública guardada
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

// Mantén tu función getItems abajo exactamente como la tenías en el paso anterior...

// 📋 LISTAR ÍTEMS CON PAGINACIÓN, BÚSQUEDA Y FILTRO (GET)
export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', search, category } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    // Construcción dinámica de filtros de búsqueda
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

    // Consulta en paralelo para optimizar rendimiento
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


// 🔄 EDITAR ÍTEM (PUT)
export const updateItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Forzamos que id sea interpretado estrictamente como un string para pasar el filtro exactOptionalPropertyTypes
    const id = req.params.id as string; 
    const { name, description, price, category } = req.body;
    const userId = req.user?.userId;
    const file = req.file;

    if (!id) {
      res.status(400).json({ message: 'El ID del producto es requerido' });
      return;
    }

    // 1. Verificar si el producto existe
    const existingItem = await prisma.item.findUnique({ where: { id } });
    if (!existingItem) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }

    // 2. Control de seguridad
    if (existingItem.userId !== userId) {
      res.status(403).json({ message: 'No tienes permisos para modificar este producto' });
      return;
    }

    let imageUrl = existingItem.imageUrl;
    if (file) {
      imageUrl = await uploadAndOptimizeImage(file);
    }

    // 4. Actualizar en la base de datos
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

// ❌ ELIMINAR ÍTEM (DELETE)
export const deleteItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string; // Forzamos el casteo a string puro
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
