// tests/mocks/operationPlanMocks.ts

export const createMockOperationPlan = (overrides = {}) => ({
  domainId: 'test-plan-' + Math.random().toString(36).substr(2, 9),
  vvnId: 'test-vvn-' + Math.random().toString(36).substr(2, 9),
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  createdBy: 'test-user',
  algorithmUsed: 'optimal',
  schedule: [
    {
      vesselName: 'Test Vessel',
      start: new Date('2025-01-01T08:00:00.000Z'),
      end: new Date('2025-01-15T12:00:00.000Z'),
      delay: 0,
      dock: 'Dock A',
      cranes: ['Crane-1'],
      staff: ['Staff-1']
    }
  ],
  ...overrides
});

export const createMockBatchRequest = (count = 2) => ({
  plans: Array.from({ length: count }, (_, i) => ({
    vvnId: `vvn-batch-${i + 1}`,
    createdAt: new Date().toISOString(),
    createdBy: 'batch-process',
    algorithmUsed: 'optimal',
    schedule: [
      {
        vesselName: `Vessel ${i + 1}`,
        start: new Date().toISOString(),
        end: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), 
        delay: i * 30, 
        dock: `Dock ${String.fromCharCode(65 + i)}`,
        cranes: [`Crane-${i + 1}`],
        staff: [`Staff-${i + 1}`]
      }
    ]
  })),
  metadata: {
    algorithmUsed: 'optimal',
    createdBy: 'system',
    generatedAt: new Date().toISOString()
  }
});