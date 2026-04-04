"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const helpers_1 = require("../helpers");
describe('Simulation API', () => {
    let app;
    beforeEach(() => {
        ({ app } = (0, helpers_1.createTestApp)());
    });
    it('should return 400 for invalid simulation name', async () => {
        const response = await (0, supertest_1.default)(app)
            .post('/api/simulations/start')
            .send({ name: 'abc' });
        expect(response.status).toBe(400);
    });
    it('should start simulation with valid name', async () => {
        const response = await (0, supertest_1.default)(app)
            .post('/api/simulations/start')
            .send({ name: 'Katar 2023' });
        expect(response.status).toBe(201);
        expect(response.body.name).toBe('Katar 2023');
        expect(response.body.status).toBe('RUNNING');
    });
    it('should finish simulation manually', async () => {
        const start = await (0, supertest_1.default)(app)
            .post('/api/simulations/start')
            .send({ name: 'Katar 2023' });
        const finish = await (0, supertest_1.default)(app)
            .post(`/api/simulations/${start.body.id}/finish`);
        expect(finish.status).toBe(200);
        expect(finish.body.status).toBe('FINISHED');
    });
    it('should restart finished simulation', async () => {
        const start = await (0, supertest_1.default)(app)
            .post('/api/simulations/start')
            .send({ name: 'Katar 2023' });
        await (0, supertest_1.default)(app).post(`/api/simulations/${start.body.id}/finish`);
        const restart = await (0, supertest_1.default)(app)
            .post(`/api/simulations/${start.body.id}/restart`);
        expect(restart.status).toBe(200);
        expect(restart.body.status).toBe('RUNNING');
        expect(restart.body.elapsedTicks).toBe(0);
    });
    it('should return 404 for unknown simulation', async () => {
        const response = await (0, supertest_1.default)(app).get('/api/simulations/unknown-id');
        expect(response.status).toBe(404);
    });
    it('should not allow starting simulation more often than once per 5 seconds', async () => {
        await (0, supertest_1.default)(app)
            .post('/api/simulations/start')
            .send({ name: 'Katar 2023' });
        const second = await (0, supertest_1.default)(app)
            .post('/api/simulations/start')
            .send({ name: 'Another Test' });
        expect(second.status).toBe(400);
    });
    it('should not restart simulation if it is not finished', async () => {
        const start = await (0, supertest_1.default)(app)
            .post('/api/simulations/start')
            .send({ name: 'Katar 2023' });
        const restart = await (0, supertest_1.default)(app)
            .post(`/api/simulations/${start.body.id}/restart`);
        expect(restart.status).toBe(400);
    });
});
