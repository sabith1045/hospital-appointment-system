const request = require('supertest');
const app = require('../src/app');

test('GET /doctors returns the doctor list', async () => {
    const res = await request(app).get('/doctors');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
});

test('GET /doctors filters by specialization', async () => {
    const res = await request(app)
        .get('/doctors?specialization=Cardiology');

    expect(res.statusCode).toBe(200);
    expect(
        res.body.every(
            doctor => doctor.specialization === 'Cardiology'
        )
    ).toBe(true);
});

test('GET /doctors/:id returns 404 for unknown doctor', async () => {
    const res = await request(app).get('/doctors/999');

    expect(res.statusCode).toBe(404);
});

test('POST /appointments books a valid slot', async () => {
    const res = await request(app)
        .post('/appointments')
        .send({
            slotId: 1,
            patientName: 'Test Patient'
        });

    expect(res.statusCode).toBe(201);
});

test('POST /appointments rejects an already booked slot', async () => {
    const res = await request(app)
        .post('/appointments')
        .send({
            slotId: 1,
            patientName: 'Another Patient'
        });

    expect(res.statusCode).toBe(409);
});