const express = require('express');

const app = express();

app.use(express.json());

const doctors = [
    {
        id: 1,
        name: 'Dr. Asha Menon',
        specialization: 'Cardiology',
        available: true
    },
    {
        id: 2,
        name: 'Dr. Rahul Nair',
        specialization: 'Dermatology',
        available: true
    },
    {
        id: 3,
        name: 'Dr. Priya Thomas',
        specialization: 'Pediatrics',
        available: false
    }
];

const slots = [
    {
        id: 1,
        doctorId: 1,
        time: '2026-10-06T10:00',
        booked: false
    },
    {
        id: 2,
        doctorId: 1,
        time: '2026-10-06T11:00',
        booked: false
    },
    {
        id: 3,
        doctorId: 2,
        time: '2026-10-06T14:00',
        booked: false
    }
];

const appointments = [];

// SCRUM-10 + SCRUM-11
// Search and filter doctors
app.get('/doctors', (req, res) => {

    const { search, specialization, available } = req.query;

    let result = doctors;

    if (search) {
        result = result.filter(doctor =>
            doctor.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (specialization) {
        result = result.filter(doctor =>
            doctor.specialization.toLowerCase() ===
            specialization.toLowerCase()
        );
    }

    if (available === 'true') {
        result = result.filter(doctor => doctor.available);
    }

    res.json(result);
});

// SCRUM-12
// View doctor profile
app.get('/doctors/:id', (req, res) => {

    const doctor = doctors.find(
        doctor => doctor.id === Number(req.params.id)
    );

    if (!doctor) {
        return res.status(404).json({
            error: 'Doctor not found'
        });
    }

    res.json(doctor);
});

// SCRUM-13
// View available appointment slots
app.get('/doctors/:id/slots', (req, res) => {

    const doctorSlots = slots.filter(
        slot =>
            slot.doctorId === Number(req.params.id) &&
            !slot.booked
    );

    res.json(doctorSlots);
});

// SCRUM-14
// Book an appointment
app.post('/appointments', (req, res) => {

    const { slotId, patientName } = req.body;

    const slot = slots.find(
        slot => slot.id === slotId
    );

    if (!slot) {
        return res.status(404).json({
            error: 'Slot not found'
        });
    }

    if (slot.booked) {
        return res.status(409).json({
            error: 'Slot already booked'
        });
    }

    slot.booked = true;

    const appointment = {
        id: appointments.length + 1,
        slotId: slotId,
        doctorId: slot.doctorId,
        patientName: patientName
    };

    appointments.push(appointment);

    res.status(201).json(appointment);
});

// View appointments
app.get('/appointments', (req, res) => {
    res.json(appointments);
});

module.exports = app;