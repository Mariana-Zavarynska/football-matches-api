# Football Matches Simulation API

Backend application for simulating 3 football matches:

- Germany vs Poland
- Brazil vs Mexico
- Argentina vs Uruguay

Built with:

- Express
- TypeScript
- WebSocket (`ws`)
- Jest
- Supertest
- Zod

## Features

- Start simulation
- Finish simulation manually before 9 seconds
- Restart finished simulation
- Score updates every second
- Automatic finish after 9 seconds
- WebSocket events for real-time updates
- In-memory persistence
- Validation for simulation name
- Unit and integration tests

## Simulation Rules

- Simulation name must:
    - be 8 to 30 characters long
    - contain only letters, digits, and spaces
- Simulation cannot be started more frequently than once per 5 seconds
- Each simulation lasts 9 seconds unless manually finished earlier
- Every second, exactly one random team scores one goal
- First goal is scored at second 1
- Last goal is scored at second 9
- After finishing, simulation can be restarted and all scores are reset

## Project Structure

- `domain` – business entities and states
- `application` – use cases and orchestration
- `infrastructure` – repository, clock and websocket adapters
- `presentation` – HTTP layer, controllers, routes, middleware

This keeps the business logic isolated from Express and WebSocket implementation details.

## API Endpoints

### Start simulation

`POST /api/simulations/start`

Body:

```json
{
  "name": "Katar 2023"
}
