

import app from '../app';
import { createVender, getVender, getVenderById, updateVender, deleteVender } from '../services/vender';


app.post('/vender', async (c) => {
  try {
    const body = await c.req.json();
    const result = await createVender(body, globalThis.env.DB);
    return c.json(result, result.code);
  } catch (error) {
    console.error('Error creating vender:', error);
    return c.json({ status: 'error', message: 'Failed to create vender' }, 500);
  }
});


app.get('/vender', async (c) => {
  try {
    const result = await getVender(globalThis.env.DB);
    return c.json(result, result.code);
  } catch (error) {
    console.error('Error fetching vender:', error);
    return c.json({ status: 'error', message: 'Failed to fetch vender' }, 500);
  }
});


app.get('/vender/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const result = await getVenderById(parseInt(id), globalThis.env.DB);
    return c.json(result, result.code);
  } catch (error) {
    console.error('Error fetching vender:', error);
    return c.json({ status: 'error', message: 'Failed to fetch vender' }, 500);
  }
});


app.put('/vender/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const result = await updateVender(parseInt(id), body, globalThis.env.DB);
    return c.json(result, result.code);
  } catch (error) {
    console.error('Error updating vender:', error);
    return c.json({ status: 'error', message: 'Failed to update vender' }, 500);
  }
});


app.delete('/vender/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const result = await deleteVender(parseInt(id), globalThis.env.DB);
    return c.json(result, result.code);
  } catch (error) {
    console.error('Error deleting vender:', error);
    return c.json({ status: 'error', message: 'Failed to delete vender' }, 500);
  }
});