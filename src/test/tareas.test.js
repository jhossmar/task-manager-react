import { describe, it, expect } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../../backend/src/index.ts' // Update relative path to your Express file

const mockToken = jwt.sign({ email: 'test@example.com' }, 'secret_key')

describe('API de tareas', () => {
  it('crea una tarea nueva', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ text: 'Escribir informe' })

    expect(res.status).toBe(201)
    expect(res.body.text).toBe('Escribir informe')
  })

  it('lista las tareas creadas', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${mockToken}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('Rechaza crear una tarea con titulo vacio', async () =>{
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ text: '' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Task text is required')
  })

})